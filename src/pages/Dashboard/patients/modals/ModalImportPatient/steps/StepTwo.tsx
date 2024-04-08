import { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import Select, { SingleValue } from 'react-select';
import { useModalImportPatientStore } from '../hooks';
import { useWizard } from 'react-use-wizard';
import CsLineIcons from '../../../../../../cs-line-icons/CsLineIcons';

export default function StepTwo() {
  const fileTitles = useModalImportPatientStore((state) => state.fileTitles);
  const selectedIndexes = useModalImportPatientStore((state) => state.selectedIndexes);
  const [nextButtonDisabled, setNextButtonDisabled] = useState(true);

  const [optionValues, setOptionValues] = useState<SingleValue<{ label: string; value: string }>[]>([]);
  const [isFullNameSelected, setIsFullNameSelected] = useState(false);
  const [isEmailSelected, setIsEmailSelected] = useState(false);
  const [isSexSelected, setIsSexSelected] = useState(false);
  const [isBirthSelected, setIsBirthSelected] = useState(false);

  const options = fileTitles.map((title, index) => ({ label: title, value: index.toString() }));

  const { setSelectedIndexes } = useModalImportPatientStore();
  const { nextStep } = useWizard();

  const handleChangeFieldIndex = (option: SingleValue<{ label: string; value: string }>, index: string) => {
    const indexes = index.split(',').map(Number);
    const [fieldIndex] = indexes;

    setOptionValues(optionValues.map((o, i) => (i === fieldIndex ? option : o)));

    // Atualiza o estado apropriado baseado no campo sendo alterado
    if (fieldIndex === 0) {
      setIsFullNameSelected(!!option);
    } else if (fieldIndex === 1) {
      setIsEmailSelected(!!option);
    } else if (fieldIndex === 2) {
      setIsSexSelected(!!option);
    } else if (fieldIndex === 3) {
      setIsBirthSelected(!!option);
    }

    const newSelectedIndexes = selectedIndexes.map((selected, i) => {
      return i === fieldIndex ? `${option ? option.value : ''}, ${indexes[1]}` : selected;
    });

    setSelectedIndexes(newSelectedIndexes);

    const selectedButtonEnabled = newSelectedIndexes.slice(0, 4).every((value) => {
      const parts = value ? value.split(',') : [''];
      return parts[0] !== '';
    });

    setNextButtonDisabled(!selectedButtonEnabled);
  };

  return (
    <>
      <div className="wizard wizard-default">
        {/* NOME COMPLETO */}
        <Row className="align-items-center">
          {/* Coluna para o select */}
          <Col>
            <div className="top-label mb-3">
              <Select
                classNamePrefix="react-select"
                options={options}
                value={optionValues[0]}
                onChange={(o) => handleChangeFieldIndex(o, '0, 0')}
                placeholder=""
              />
              <span>SELECIONE O NOME COMPLETO</span>
            </div>
          </Col>
        </Row>

        {/* E-MAIL */}
        <Row className="align-items-center">
          <Col>
            <div className="top-label mb-3">
              <Select
                classNamePrefix="react-select"
                options={options}
                value={optionValues[1]}
                onChange={(o) => handleChangeFieldIndex(o, '1, 5')}
                placeholder=""
              />
              <span>SELECIONE O EMAIL</span>
            </div>
          </Col>
        </Row>

        {/* SEXO */}
        <Row className="align-items-center">
          {/* Coluna para o select */}
          <Col>
            <div className="top-label mb-3">
              <Select
                classNamePrefix="react-select"
                options={options}
                value={optionValues[2]}
                onChange={(o) => handleChangeFieldIndex(o, '2, 1')}
                placeholder=""
              />
              <span>SELECIONE O SEXO</span>
            </div>
          </Col>
        </Row>

        {/* NASCIMENTO */}
        <Row className="align-items-center">
          {/* Coluna para o select */}
          <Col>
            <div className="top-label mb-3">
              <Select
                classNamePrefix="react-select"
                options={options}
                value={optionValues[3]}
                onChange={(o) => handleChangeFieldIndex(o, '3, 2')}
                placeholder=""
              />
              <span>SELECIONE A DATA DE NASCIMENTO</span>
            </div>
          </Col>
        </Row>

        {/* CPF */}
        <Row className="align-items-center">
          {/* Coluna para o select */}
          <Col>
            <div className="top-label mb-3">
              <Select
                classNamePrefix="react-select"
                options={options}
                value={optionValues[4]}
                onChange={(o) => handleChangeFieldIndex(o, '4, 6')}
                placeholder=""
              />
              <span>SELECIONE O CPF</span>
            </div>
          </Col>
        </Row>

        {/* TELEFONE */}
        <Row className="align-items-center">
          {/* Coluna para o select */}
          <Col>
            <div className="top-label mb-3">
              <Select
                classNamePrefix="react-select"
                options={options}
                value={optionValues[5]}
                onChange={(o) => handleChangeFieldIndex(o, '5, 7')}
                placeholder=""
              />
              <span>SELECIONE O TELEFONE</span>
            </div>
          </Col>
        </Row>

        <div className="d-flex mb-3 align-items-center">
          <div className="d-flex align-items-center me-3">
            <span className="ms-2">Dados obrigatórios:</span>
          </div>
          <div className="d-flex align-items-center me-3">
            <CsLineIcons icon={isFullNameSelected ? 'check-circle' : 'close-circle'} className={isFullNameSelected ? 'text-primary' : ''} />
            <span className="ms-2">Nome completo</span>
          </div>

          <div className="d-flex align-items-center me-3">
            <CsLineIcons icon={isEmailSelected ? 'check-circle' : 'close-circle'} className={isEmailSelected ? 'text-primary' : ''} />
            <span className="ms-2">E-mail</span>
          </div>

          <div className="d-flex align-items-center me-3">
            <CsLineIcons icon={isSexSelected ? 'check-circle' : 'close-circle'} className={isSexSelected ? 'text-primary' : ''} />
            <span className="ms-2">Sexo</span>
          </div>

          <div className="d-flex align-items-center me-3">
            <CsLineIcons icon={isBirthSelected ? 'check-circle' : 'close-circle'} className={isBirthSelected ? 'text-primary' : ''} />
            <span className="ms-2">Data de nascimento</span>
          </div>
        </div>
      </div>

      {/* Botões de navegação, adaptados para o contexto do useWizard */}
      <div className="wizard-buttons d-flex justify-content-center">
        <Button
          variant="outline-primary"
          className={`btn-icon btn-icon-end ${nextButtonDisabled ? 'disabled' : ''}`}
          onClick={() => nextStep()}
          disabled={nextButtonDisabled}
        >
          <span>Avançar</span> <CsLineIcons icon="chevron-right" />
        </Button>
      </div>
    </>
  );
}
