import React, { useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useModalSendPDFPatientStore } from '../hooks/ModalSendPDFPatientStore';
import { sanitizeString } from '../../../helpers/InputHelpers';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import { useRequestingExamStore } from '../hooks/RequestingExamStore';
import api from '../../../services/useAxios';
import AsyncButton from '../../../components/AsyncButton';

const ModalSendPDFPatient = () => {
  const showModal = useModalSendPDFPatientStore((state) => state.showModal);
  const { id } = useParams<{ id: string }>();

  const toastId = useRef<React.ReactText>();

  const [textObservation, setTextObservation] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const selectedExams = useRequestingExamStore((state) => state.selectedExams);
  const patient = useRequestingExamStore((state) => state.patient);

  const { setShowModalSendPDFPatient } = useModalSendPDFPatientStore();

  const handleChangeTextObservation = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextObservation(sanitizeString(event.target.value));
  };

  const onSubmit = async () => {
    toastId.current = notify('Gerando pdf da solicitação de exame, por favor aguarde...', 'Sucesso', 'check', 'success', true);
    setIsSaving(true);

    try {
      await api.patch('/exames-de-sangue-historico/' + id, {
        patient,
        examsSelected: selectedExams.map((exam) => ({
          exam: exam.exam,
          examsBloodSelectedValueObtained: exam.examsBloodSelectedValueObtained,
          id: undefined,
        })),
      });

      const payload = {
        textObservation,
      };

      await api.post('/solicitacoes-de-exame-email/' + id, payload);

      updateNotify(toastId.current, 'E-mail enviado com sucesso!', 'Sucesso', 'check', 'success');

      setShowModalSendPDFPatient(false);
      setIsSaving(false);
      setTextObservation('');
    } catch (error) {
      setIsSaving(false);
      updateNotify(toastId.current, 'Erro ao enviar e-mails!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModalSendPDFPatient(false)} backdrop="static" size="lg" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Enviar solicitação para o e-mail do paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="top-label">
          <Form.Control as="textarea" rows={3} name="emailTextObservation" value={textObservation} onChange={handleChangeTextObservation} />
          <Form.Label>Insira uma observação</Form.Label>
        </div>
        <div className="text-center">
          <AsyncButton isSaving={isSaving} onClickHandler={onSubmit} loadingText="Enviando..." variant="primary" size="lg" className="mt-2 hover-scale-down">
            Enviar PDF da solicitação
          </AsyncButton>{' '}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSendPDFPatient;
