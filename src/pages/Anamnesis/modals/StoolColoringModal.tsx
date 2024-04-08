import React from 'react';
import { Col, Modal, Row, } from 'react-bootstrap';
import { useStoolColoringModalStore } from '../hooks/modals/StoolColoringModalStore';
import { useEditModalStore } from '../hooks/EditModalStore';
import AnamneseFezesColoracao from '../constants/Anamnese-Fezes-Coloracao';

const StoolColoringModal = () => {
  const showModal = useStoolColoringModalStore((state) => state.showModal);
  const selectedAnamnesis = useEditModalStore((state) => state.selectedAnamnesis);

  const { hideModal } = useStoolColoringModalStore();
  const { handleChangeAnamnesis } = useEditModalStore();

  const handleSelectScale = (id: number) => {
    const item = AnamneseFezesColoracao.find((item) => item.id === id);
    item && handleChangeAnamnesis({ ...selectedAnamnesis, textFromAnamnesis: selectedAnamnesis?.textFromAnamnesis + '<br>' +  item.coloracao });
    hideModal();
  };

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Coloração das fezes | Defina a cor das fezes do paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-4">
        <Row>
          <Col lg="12" className="mb-5">
            <Row className="g-2">
              <Col xs="6" sm="4">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input
                    type="radio"
                    name='bistrol-scale'
                    className="form-check-input position-absolute e-2 t-2 z-index-1"
                    onChange={(e) => {
                      e.target.checked && handleSelectScale(1);
                    }}
                  />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      <img src="/img/anamnesis/amarela.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Amarelada</span>
                      <span className="text-alternate fw-medium d-block">Pode indicar má absorção de gordura ou doença hepática. Também é comum em bebês.</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6" sm="4">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input
                    type="radio"
                    name='bistrol-scale'
                    className="form-check-input position-absolute e-2 t-2 z-index-1"
                    onChange={(e) => {
                      e.target.checked && handleSelectScale(2);
                    }}
                  />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      <img src="/img/anamnesis/branca.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Branca</span>
                      <span className="text-alternate fw-medium d-block">Pode ser um sinal de obstrução do ducto biliar e problemas hepáticos.</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6" sm="4">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input
                    type="radio"
                    name='bistrol-scale'
                    className="form-check-input position-absolute e-2 t-2 z-index-1"
                    onChange={(e) => {
                      e.target.checked && handleSelectScale(3);
                    }}
                  />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      <img src="/img/anamnesis/escura.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Escura</span>
                      <span className="text-alternate fw-medium d-block">Pode ser causado por suplementos de ferro ou sangramento gastrointestinal alto. Alimentos escuros, como amoras, também podem causar fezes pretas.</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6" sm="4">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input
                    type="radio"
                    name='bistrol-scale'
                    className="form-check-input position-absolute e-2 t-2 z-index-1"
                    onChange={(e) => {
                      e.target.checked && handleSelectScale(4);
                    }}
                  />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      <img src="/img/anamnesis/marrom.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Marrom</span>
                      <span className="text-alternate fw-medium d-block">Cor normal, resultante da digestão e da bilirrubina presente na bile.</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6" sm="4">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input
                    type="radio"
                    name='bistrol-scale'
                    className="form-check-input position-absolute e-2 t-2 z-index-1"
                    onChange={(e) => {
                      e.target.checked && handleSelectScale(5);
                    }}
                  />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      <img src="/img/anamnesis/verde.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Verde</span>
                      <span className="text-alternate fw-medium d-block">Pode ocorrer devido ao consumo de vegetais verdes, alimentos com corantes verdes ou trânsito intestinal rápido.</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6" sm="4">
                <label className="form-check custom-card w-100 position-relative p-0 m-0 pointer">
                  <input
                    type="radio"
                    name='bistrol-scale'
                    className="form-check-input position-absolute e-2 t-2 z-index-1"
                    onChange={(e) => {
                      e.target.checked && handleSelectScale(6);
                    }}
                  />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      <img src="/img/anamnesis/vermelha.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Vermelha</span>
                      <span className="text-alternate fw-medium d-block">Pode indicar sangramento no trato gastrointestinal inferior ou consumo de alimentos vermelhos, como beterraba.</span>
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

export default StoolColoringModal;
