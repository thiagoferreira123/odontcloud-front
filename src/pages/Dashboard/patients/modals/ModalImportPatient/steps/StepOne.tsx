import React, { useState } from 'react';
import { useServiceLocationStore } from '../../../../../../hooks/professional/ServiceLocationStore';
import StaticLoading from '../../../../../../components/loading/StaticLoading';
import Select, { components, ControlProps, GroupBase, SingleValue } from 'react-select';
import { Option } from '../../../../../../types/inputs';
import { useQuery } from '@tanstack/react-query';
import Dropzone, { IMeta, defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import * as XLSX from 'xlsx';
import { useModalImportPatientStore } from '../hooks';
import { excelSerialDateToJSDate, isValidExcelDate } from '../../../../../../helpers/DateHelper';
import { Button } from 'react-bootstrap';
import { useWizard } from 'react-use-wizard';
import DropzonePreview from '../../../../../../components/dropzone/DropzonePreview';
import CsLineIcons from '../../../../../../cs-line-icons/CsLineIcons';

export default function StepOne() {
  const [selectedLocal, setValue] = useState<Option>();
  const jsonFile = useModalImportPatientStore((state) => state.jsonFile);

  const { getServiceLocations } = useServiceLocationStore();
  const { setFileTitles, setJsonFile, setSelectedLocal } = useModalImportPatientStore();
  const { nextStep } = useWizard();

  const onChangeLocationSelect = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setValue(selectedOption);
      setSelectedLocal(+selectedOption.value);
    }
  };

  const getServiceLocations_ = async () => {
    try {
      const response = await getServiceLocations();

      if (response === false) throw new Error('Error on get service locations');

      return response;
    } catch (error) {
      console.error('Error on get service locations', error);
      throw error;
    }
  };

  const handleFileAdd = (file: { meta: IMeta; file: File }) => {
    // Verifica se o arquivo é um CSV ou XLSX antes de processar
    if (file.meta.type === 'text/csv' || file.meta.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) return;

        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        setJsonFile(
          json.map((row) => {
            row = row.map((value) => {
              if (!isValidExcelDate(+value)) return value;

              const date = excelSerialDateToJSDate(+value);

              return date.toLocaleDateString('pt-BR');
            });

            return row;
          })
        );

        const headers: string[] = json[0]; // Primeira linha contém os cabeçalhos
        setFileTitles(headers); // Fazer algo com os cabeçalhos
      };
      reader.readAsBinaryString(file.file);
    }

    // Retorna false para cancelar o add (não adicionar à fila de upload)
    return true;
  };

  const resultLocals = useQuery({ queryKey: ['locals'], queryFn: getServiceLocations_ });

  const Control = ({ children, ...props }: ControlProps<Option, boolean, GroupBase<Option>>) => {
    return (
      <components.Control {...props} className="form-floating">
        {children}
        <label>Local de atendimento</label>
      </components.Control>
    );
  };

  return (
    <>
      <div className="sh-30 wizard wizard-default">
        {resultLocals.isLoading ? (
          <StaticLoading />
        ) : (
          <div className="mb-3">
            {/* <div>
            <Alert variant="light">Todos os pacientes serão atrelados a um local de atendimento. Caso você não possua um local de atendimento cadastrado, vá até "Meus dados" na barra superior, e cadastre.</Alert>
          </div> */}
            <Select
              classNamePrefix="react-select"
              name="consultationLocation"
              options={resultLocals.data?.map((local) => ({ value: local.id.toString(), label: local.nome } as Option))}
              value={selectedLocal}
              onChange={(o) => onChangeLocationSelect(o as SingleValue<Option>)}
              placeholder=""
              components={{ Control }}
            />
          </div>
        )}
        <div className="top-label">
          <Dropzone
            PreviewComponent={DropzonePreview}
            onChangeStatus={({ meta, file }, status) => {
              if (status === 'done') {
                handleFileAdd({ meta, file });
              }
              if (status === 'removed') {
                setJsonFile([]);
                setFileTitles([]);
              }
            }}
            submitButtonContent={null}
            accept="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            submitButtonDisabled
            inputWithFilesContent={null}
            autoUpload={false}
            classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
            inputContent="Insira o arquivo CSV ou XLSX com os pacientes"
          />
          <span>INSIRA O ARQUIVO CSV OU XLSX</span>
        </div>
      </div>

      {/* Botões de navegação, adaptados para o contexto do useWizard */}
      <div className="wizard-buttons d-flex justify-content-center">
        <Button
          variant="outline-primary"
          className={`btn-icon btn-icon-end ${!jsonFile.length || !selectedLocal ? 'disabled' : ''}`}
          onClick={() => nextStep()}
          disabled={!jsonFile.length || !selectedLocal}
        >
          <span>Avançar</span> <CsLineIcons icon="chevron-right" />
        </Button>
      </div>
    </>
  );
}
