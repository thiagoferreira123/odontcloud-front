import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRequestingExamStore } from '../hooks/RequestingExamStore';
import api from '/src/services/useAxios';
import { useExamsSelectStore } from '../hooks/ExamsSelectStore';
import AsyncButton from '/src/components/AsyncButton';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';

interface ModalSaveExamesSelectedTemplateProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
  examsBloodTemplateName: string;
}

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

const ModalSaveExamesSelectedTemplate = ({ showModal, setShowModal }: ModalSaveExamesSelectedTemplateProps) => {
  const validationSchema = Yup.object().shape({
    examsBloodTemplateName: Yup.string().required('Insira um nome válido'),
  });

  const initialValues: FormValues = { examsBloodTemplateName: '' };
  const [isSaving, setIsSaving] = useState(false);

  const selectedExams = useRequestingExamStore((state) => state.selectedExams);

  const { addTemplate } = useExamsSelectStore();

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    try {
      const { data } = await api.post('/exames-de-sangue-modelo', {
        ...values,
        selectedExams: selectedExams.map((selectedExam) => ({ ...selectedExam, examesBloodInfo: selectedExam.exam, id: undefined, exam: undefined })),
      });

      addTemplate(data);

      notify('Modelo de exame salvo com sucesso', 'Sucesso', 'check', 'success');

      setIsSaving(false);
    } catch (error) {
      notify('Erro ao salvar modelo de exame', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  return (
    <Modal className="modal-close-out" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Salvar seleção de exames como modelo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="mb-3 filled">
            <CsLineIcons icon="star" />
            <Form.Control
              type="text"
              name="examsBloodTemplateName"
              value={values.examsBloodTemplateName}
              onChange={handleChange}
              placeholder="Nome do modelo de solicitação"
            />
            {errors.examsBloodTemplateName && touched.examsBloodTemplateName && <div className="error">{errors.examsBloodTemplateName}</div>}
          </div>
          <div className="text-center">
            <AsyncButton isSaving={isSaving} variant="primary" size="lg" className="mt-2 hover-scale-down" type="submit">
              Salvar seleção
            </AsyncButton>{' '}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSaveExamesSelectedTemplate;
