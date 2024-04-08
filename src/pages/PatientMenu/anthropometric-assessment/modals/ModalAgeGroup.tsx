import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { AntropometricAssessmentHistory } from '/src/types/AntropometricAssessment';
import { useConfigModalStore } from '../hooks/ConfigModalStore';

interface ModalAgeGroupProps {
  showModal: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModal: (showModal: boolean) => void;
}

const ModalAgeGroup = ({ showModal, setShowModal }: ModalAgeGroupProps) => {

  const { handleSelectAssessment } = useConfigModalStore();

  const handleChangeAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowModal(false);

    const payload: AntropometricAssessmentHistory<unknown> = {
      paciente_id: 0,
      id_bioimpedancia: 0,
      faixa_etaria: Number(e.target.value),
      data_registro: (new Date()).getTime() / 1000,
    }

    handleSelectAssessment(payload);
  };

  return (
    <Modal className="modal-close-out" size="lg" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Selecione a faixa etária ou tipo de antropometria</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg="12" className="mb-5">
            <Row className="g-2">
              <Col xs="6">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input value={1} name="age" onChange={handleChangeAge} type="checkbox" className="form-check-input position-absolute e-2 t-2 z-index-1" />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      👶🏻
                      <span className="heading mt-3 text-body text-primary d-block">Infantil 0-5 anos</span>
                      <span className="text fw-medium text-muted d-block">Contém curvas da OMS (comprimento, peso e IMC para idade)</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input value={2} name="age" onChange={handleChangeAge} type="checkbox" className="form-check-input position-absolute e-2 t-2 z-index-1" />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      🧒🏻
                      <span className="heading mt-3 text-body text-primary d-block">Infantil 5-19 anos</span>
                      <span className="text fw-medium text-muted d-block">Contém curvas da OMS e protocolo de % de gordura</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input value={3} name="age" onChange={handleChangeAge} type="checkbox" className="form-check-input position-absolute e-2 t-2 z-index-1" />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      👨🏼‍🦱👨🏽‍🦳
                      <span className="heading mt-3 text-body text-primary d-block">Adulto ou idoso</span>
                      <span className="text fw-medium text-muted d-block">Contém protocolo de % de gordura e dados mais específicos</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input value={5} name="age" onChange={handleChangeAge} type="checkbox" className="form-check-input position-absolute e-2 t-2 z-index-1" />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      🤰🏻
                      <span className="heading mt-3 text-body text-primary d-block">Gestante</span>
                      <span className="text fw-medium text-muted d-block">Contém gráficos e equações específicas para gestantes</span>
                    </span>
                  </span>
                </label>
              </Col>
              {/* <Col xs="6">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input value={3} name="age" onChange={handleChangeAge} type="checkbox" className="form-check-input position-absolute e-2 t-2 z-index-1" />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      🤕
                      <span className="heading mt-3 text-body text-primary d-block">Acamado</span>
                      <span className="text fw-medium text-muted d-block">Contém equações especificas</span>
                    </span>
                  </span>
                </label>
              </Col> */}
              <Col xs="6">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input value={6} name="age" onChange={handleChangeAge} type="checkbox" className="form-check-input position-absolute e-2 t-2 z-index-1" />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      📝
                      <span className="heading mt-3 text-body text-primary d-block">Bioimpedância</span>
                      <span className="text fw-medium text-muted d-block">Ficha para inserção dos dados</span>
                    </span>
                  </span>
                </label>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAgeGroup;
