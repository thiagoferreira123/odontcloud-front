import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { useBistrolScaleModalStore } from '../hooks/modals/BistrolScaleModal';
import AnamneseFezesBistrol from '../constants/Anamnese-Fezes-Bistrol';
import { useEditModalStore } from '../hooks/EditModalStore';

const BistrolScaleModal = () => {
  const showModal = useBistrolScaleModalStore((state) => state.showModal);
  const selectedAnamnesis = useEditModalStore((state) => state.selectedAnamnesis);

  const { hideModal } = useBistrolScaleModalStore();
  const { handleChangeAnamnesis } = useEditModalStore();

  const handleSelectScale = (id: number) => {
    const item = AnamneseFezesBistrol.find((item) => item.id === id);
    item && handleChangeAnamnesis({ ...selectedAnamnesis, textFromAnamnesis: selectedAnamnesis?.textFromAnamnesis + '<br>' +  item.escala });
    hideModal();
  };

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Escala de bistrol | Defina o formato das fezes do paciente</Modal.Title>
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
                      <img src="/img/anamnesis/fezes_tipo_1.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="text-alternate fw-medium d-block">Pedaços duros e separados, como nozes (dificeís de passar)</span>
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
                      <img src="/img/anamnesis/fezes_tipo_2.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="text-alternate fw-medium d-block">Em formato de uma salsicha, porém com aspecto granuloso</span>
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
                      <img src="/img/anamnesis/fezes_tipo_3.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="text-alternate fw-medium d-block">Em forma de salsicha, mas com rachaduras em sua superficie.</span>
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
                      <img src="/img/anamnesis/fezes_tipo_4.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="text-alternate fw-medium d-block">Em formato de uma salsicha ou cobra, suave e macia</span>
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
                      <img src="/img/anamnesis/fezes_tipo_5.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="text-alternate fw-medium d-block">Bolhas suaves com bordas bem definidas (passa facilmente)</span>
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
                      <img src="/img/anamnesis/fezes_tipo_6.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="text-alternate fw-medium d-block">Com aspecto aquoso, sem peças sólidas, totalmente líquido</span>
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
                      e.target.checked && handleSelectScale(7);
                    }}
                  />
                  <span className="card form-check-label w-100 custom-border">
                    <span className="card-body text-center">
                      <img src="/img/anamnesis/fezes_tipo_7.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="text-alternate fw-medium d-block">Pedaços macios com bordas irregulares</span>
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

export default BistrolScaleModal;
