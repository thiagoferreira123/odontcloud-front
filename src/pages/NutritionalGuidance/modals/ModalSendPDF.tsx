import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import AsyncButton from '/src/components/AsyncButton';
import api from '/src/services/useAxios';
import { sanitizeString } from '/src/helpers/InputHelpers';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import { useNutritionalGuidanceModalStore } from '../hooks';
import { useSendPdfModalStore } from '../hooks/SendPdfModalStore';

const SendPdfModal = () => {
  const showModal = useSendPdfModalStore((state) => state.showModal);
  const selectedNutritionalGuidanceSelectedPatient = useNutritionalGuidanceModalStore((state) => state.selectedNutritionalGuidanceSelectedPatient);

  const toastId = useRef<React.ReactText>();

  const [showAssign, setShowAssign] = useState(true);
  const [textObservation, setTextObservation] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const { hideModal } = useSendPdfModalStore();

  const handleChangeTextObservation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextObservation(sanitizeString(event.target.value));
  };

  const onSubmit = async () => {
    if (!selectedNutritionalGuidanceSelectedPatient?.nutritionalGuidance?.id) return;

    toastId.current = notify("Gerando pdf da orientação, por favor aguarde...", 'Sucesso', 'check', 'success', true);
    setIsSaving(true);

    try {
      const payload = {
        showAssign,

        textObservation,
      };

      await api.post('/orientacao-nutricional-email/' + selectedNutritionalGuidanceSelectedPatient.nutritionalGuidance.id, payload);

      updateNotify(toastId.current, 'E-mail enviado com sucesso!', 'Sucesso', 'check', 'success');

      hideModal();
      setIsSaving(false);
      setTextObservation('');
    } catch (error) {
      setIsSaving(false);
      updateNotify(toastId.current, 'Erro ao enviar e-mails!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <Modal show={showModal} onHide={hideModal} backdrop="static" size="lg" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Enviar PDF's para o e-mail do paciente</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <Form.Check
            type="checkbox"
            value={1}
            onChange={() => setShowAssign(!showAssign)}
            label="Incluir ssinatura"
            id="show_assinatura"
            name="show_assinatura"
            checked={showAssign}
          />
        </div>

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

export default SendPdfModal;
