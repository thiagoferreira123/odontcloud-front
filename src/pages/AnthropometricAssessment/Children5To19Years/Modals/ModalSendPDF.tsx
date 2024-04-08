import React, { useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useModalSendPDFStore } from '../hooks/ModalSendPDFStore';
import { useParams } from 'react-router-dom';
import { sanitizeString } from '../../../../helpers/InputHelpers';
import { notify, updateNotify } from '../../../../components/toast/NotificationIcon';
import api from '../../../../services/useAxios';
import AsyncButton from '../../../../components/AsyncButton';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

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
      const charts = Array.from(document.querySelectorAll('canvas')).map((chart) => chart.toDataURL('image/png'));
      const chartTitles = Array.from(document.querySelectorAll('.chart-title')).map((chart) => chart.textContent);

      const payload = {
        textObservation,
        charts: charts.map((chart, index) => ({ chart, title: chartTitles[index] })),
      };

      await api.post('/antropometria-email/' + id, payload);

      updateNotify(toastId.current, 'E-mail enviado com sucesso!', 'Sucesso', 'check', 'success');

      setShowModalSendPdfEmail(false);
      setIsSaving(false);
      setTextObservation('');
    } catch (error) {
      setIsSaving(false);
      updateNotify(toastId.current, 'Erro ao enviar e-mails!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModalSendPdfEmail(false)} backdrop="static" size="lg" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Enviar PDF's para o e-mail do paciente</Modal.Title>
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
