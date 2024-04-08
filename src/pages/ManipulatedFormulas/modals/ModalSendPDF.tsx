import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import AsyncButton from '/src/components/AsyncButton';
import NotificationIcon, { notify } from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import api from '/src/services/useAxios';
import { sanitizeString } from '/src/helpers/InputHelpers';
import { useModalSendPDFStore } from '../hooks/modals/ModalSendPDFStore';
import { useParams } from 'react-router-dom';

const ModalSendPDF = () => {
  const showModal = useModalSendPDFStore((state) => state.showModal);
  const { id } = useParams<{ id: string }>();

  const toastId = useRef<React.ReactText>();

  const [textObservation, setTextObservation] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const { setShowModalSendPdfEmail } = useModalSendPDFStore();

  const handleChangeTextObservation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextObservation(sanitizeString(event.target.value));
  };

  const onSubmit = async () => {
    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsSaving(true);

    try {
      const payload = {
        textObservation,
      };

      await api.post('/formula-manipulada-prescricao-email/' + id, payload);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'E-mail enviado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      setShowModalSendPdfEmail(false);
      setIsSaving(false);
      setTextObservation('');
    } catch (error) {
      setIsSaving(false);
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao enviar e-mails!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModalSendPdfEmail(false)} backdrop="static" size="lg" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Enviar PDF para o e-mail do paciente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <label>Observações</label>
        <Form.Control as="textarea" rows={3} name="emailTextObservation" value={textObservation} onChange={handleChangeTextObservation} />
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton loadingText="Enviando..." className="btn-icon btn-icon-start" isSaving={isSaving} onClickHandler={onSubmit}>
          <CsLineIcons icon="send" /> <span>Enviar</span>
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSendPDF;
