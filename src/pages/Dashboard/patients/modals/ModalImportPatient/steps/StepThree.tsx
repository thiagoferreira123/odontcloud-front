import { Accordion, Alert, Table } from 'react-bootstrap';
import StaticLoading from '../../../../../../components/loading/StaticLoading';
import * as XLSX from 'xlsx';
import { SuccessResponse, useModalImportPatientStore } from '../hooks';
import api from '../../../../../../services/useAxios';
import { notify } from '../../../../../../components/toast/NotificationIcon';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import usePatientStore from '../../../hooks/PatientStore';

interface Step {
  id: string;
  name: string;
  desc: string;
  isDone: boolean;
  hideTopNav: boolean;
}

// Função auxiliar para converter uma string binária para um ArrayBuffer
function s2ab(s: string): ArrayBuffer {
  const buffer = new ArrayBuffer(s.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff; // Converte cada caractere em byte
  }
  return buffer;
}

export default function StepThree() {
  const jsonFile = useModalImportPatientStore((state) => state.jsonFile);
  const selectedIndexes = useModalImportPatientStore((state) => state.selectedIndexes);

  const selectedLocal = useModalImportPatientStore((state) => state.selectedLocal);

  const queryClient = useQueryClient();

  const { addPatient } = usePatientStore();

  const handleSubmit = async () => {
    const blob = reorderJsonFieldsAndGetFile();

    try {
      // Prepara o Blob para envio usando FormData
      const formData = new FormData();
      formData.append('file', blob, 'modified_excel.xlsx'); // Adiciona o Blob como um arquivo

      // // Envia o arquivo modificado para o endpoint
      const { data } = await api.post<SuccessResponse>('/paciente/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.data.pacientesCriados.length > 0) {
        for (const patient of data.data.pacientesCriados) {
          const cacheResponse = await addPatient(patient, queryClient);

          if (!cacheResponse) {
            notify('Erro ao salvar paciente', 'Erro', 'close', 'danger');
          }
        }

        notify('Pacientes cadastrados com sucesso', 'Sucesso', 'check', 'success');
      }

      return data;
    } catch (error) {
      console.error('Error on submit', error);
      notify('Erro ao enviar arquivo', 'Erro', 'close', 'danger');

      return {
        message: 'Erro ao enviar arquivo',
        data: {
          pacientesCriados: [],
          registrosIgnorados: 0,
          detalhesIgnorados: [],
        },
        error: true,
      };
    }
  };

  const reorderJsonFieldsAndGetFile = () => {
    const data = jsonFile.map((row) => {
      const newRow = Array(10).fill('');

      for (let i = 0; i < selectedIndexes.length; i++) {
        if (!selectedIndexes[i]) continue;

        const indexes = selectedIndexes[i].split(',').map(Number);

        newRow[indexes[1]] = row[Number(indexes[0])];
      }

      newRow[3] = selectedLocal;

      return newRow;
    });

    // Converte os dados modificados de volta para uma planilha
    const newWorksheet = XLSX.utils.aoa_to_sheet(data); // aoa = Array Of Arrays
    const newWorkbook = XLSX.utils.book_new(); // Cria um novo workbook
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1'); // Adiciona a planilha ao workbook

    // Escreve o novo workbook para um arquivo Blob
    const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

    return blob;
  };

  const result = useQuery({ queryKey: ['submit-patients'], queryFn: handleSubmit });

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center">
        {result.isLoading || result.isFetching ? (
          <StaticLoading />
        ) : result.data ? (
          <>
            <h3 className="mb-3 mt-3 text-center">{result.data && result.data.error ? 'Erro' : 'Bom trabalho!'}</h3>
            <p>{result.data ? result.data.message : 'Não feche! Estamos quase terminando de processar.. Um relatório será gerado 😎'}</p>
            <Alert variant="primary">{result.data.data.pacientesCriados.length} pacientes foram cadastrados com sucesso.</Alert>
            <Alert variant="danger">
              {' '}
              <span>{result.data.data.registrosIgnorados} pacientes foram ignorados</span>{' '}
            </Alert>
          </>
        ) : null}
      </div>

      {result.data && result.data.data.detalhesIgnorados.length ? (
        <div>
          <Accordion flush>
            <Accordion.Item eventKey="1">
              <Accordion.Header as="div">Visualizar relatório completo</Accordion.Header>
              <Accordion.Body>
                <Table>
                  <thead>
                    <tr>
                      <th scope="col">Dado do paciente</th>
                      <th scope="col">Motivo da rejeição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.data.data.detalhesIgnorados.map((detail, index) => (
                      <tr key={index}>
                        <td>{Object.values(detail)[0]}</td>
                        <td>{detail.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      ) : null}
    </>
  );
}
