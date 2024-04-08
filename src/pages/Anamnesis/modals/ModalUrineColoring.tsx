import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { useUrineColoringModalStore } from '../hooks/modals/UrineColoringModalStore';
import { useEditModalStore } from '../hooks/EditModalStore';
import AnamneseFezesHidratacao from '../constants/Anamnese-Fezes-Hidratacao';

const UrineColoringModal = () => {
  const showModal = useUrineColoringModalStore((state) => state.showModal);
  const selectedAnamnesis = useEditModalStore((state) => state.selectedAnamnesis);

  const { hideModal } = useUrineColoringModalStore();
  const { handleChangeAnamnesis } = useEditModalStore();

  const handleSelectScale = (id: number) => {
    const item = AnamneseFezesHidratacao.find((item) => item.id === id);
    item && handleChangeAnamnesis({ ...selectedAnamnesis, textFromAnamnesis: selectedAnamnesis?.textFromAnamnesis + '<br>' +  item.Hidratacao });
    hideModal();
  };
  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Escala de hidratação | Defina a cor da urina do paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-4">
        <Row>
          <Col lg="12" className="mb-5">
            <Row className="g-2">
              <Col xs="6">
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
                      <img src="/img/anamnesis/1.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Hidratação ideal</span>
                      <span className="text-alternate fw-medium d-block">A urina é de cor amarelo-claro ou palha. Este é um indicativo de que o paciente está bem hidratado.</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6">
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
                      <img src="/img/anamnesis/2.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Levemente desidratado</span>
                      <span className="text-alternate fw-medium d-block">A urina aparece em um amarelo mais escuro. Isso sugere que o paciente deve beber mais água.</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6">
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
                      <img src="/img/anamnesis/3.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Moderadamente desidratado</span>
                      <span className="text-alternate fw-medium d-block">A cor da urina se torna âmbar ou mel. Este é um sinal de desidratação e necessidade imediata de reidratação.</span>
                    </span>
                  </span>
                </label>
              </Col>
              <Col xs="6">
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
                      <img src="/img/anamnesis/4.webp" className="img-fluid rounded-md" alt="thumb" />
                      <span className="heading mt-3 text-body text-primary d-block">Severamente desidratado</span>
                      <span className="text-alternate fw-medium d-block">A urina é de cor marrom escuro, parecida com a cor do chá. Esta é uma situação grave que requer atenção, pois indica desidratação severa.</span>
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

export default UrineColoringModal;
