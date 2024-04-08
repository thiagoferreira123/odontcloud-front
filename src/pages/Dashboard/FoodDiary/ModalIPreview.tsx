import React from 'react';
import { Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { useModalIPreviewStore } from './hooks/ModalIPreviewStore';
import { getAvatarByGender } from '../../PatientMenu/hooks/patientMenuStore';
import AsyncButton from '../../../components/AsyncButton';
import { notify } from '../../../components/toast/NotificationIcon';
import { useQueryClient } from '@tanstack/react-query';

const ModalIPreview = () => {
  const showModal = useModalIPreviewStore((state) => state.showModal);
  const selectedRegister = useModalIPreviewStore((state) => state.selectedRegister);
  const [isSaving, setIsSaving] = React.useState(false);

  const queryClient = useQueryClient();

  const { handleCloseModal, handleUpdateComment, persistComment } = useModalIPreviewStore();

  const handleSubmit = async () => {
    try {
      setIsSaving(true);

      const response = await persistComment(queryClient);

      if(response === false) throw new Error('Error on persistComment');

      setIsSaving(false);
      notify('Comentário salvo com sucesso', 'Sucesso', 'check', 'success');
      handleCloseModal();
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      notify('Erro ao salvar comentário', 'Erro', 'close', 'danger');
    }
  }

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Registro alimentar</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-4">
        <Row className="g-0 mb-3">
          <Col xs="auto">
            <img
              src={selectedRegister && selectedRegister.paciente_foto ? selectedRegister.paciente_foto : getAvatarByGender(selectedRegister?.paciente_sexo ?? 1)}
              className="card-img rounded-xl sh-6 sw-6"
              alt="thumb"
            />
          </Col>
          <Col>
            <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center mb-2 justify-content-between">
              <div className="d-flex flex-column">
                <div>{selectedRegister?.paciente_nome}</div>
                <div className="text-muted mb-2">
                  {selectedRegister?.comentario}
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Card.Img src={selectedRegister && selectedRegister.registro_imagem ? selectedRegister.registro_imagem : '/img/product/small/product-4.webp'} className="card-img-top sh-40 mt-2" alt="card image" />
        <div className="mb-3 mt-3">
          <Form.Label>Comentário</Form.Label>
          <Form.Control as="textarea" rows={3} value={selectedRegister?.comentario_nutricionista} onChange={e => handleUpdateComment(e.target.value)} />
        </div>
        <div className="text-center">
          <AsyncButton isSaving={isSaving} variant="primary" className="mb-1 hover-scale-up" type="submit" onClickHandler={handleSubmit}>
            Salvar comentário
          </AsyncButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalIPreview;
