import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import * as Yup from 'yup';
import { useMedicalRecordModalStore } from './hooks/MedicalRecordModalStore';
import { Editor } from '@tinymce/tinymce-react';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import AsyncButton from '../../components/AsyncButton';
import useMedicalRecordStore from '../PatientMenu/medical-record/hooks';
import TemplateSelect from './TemplateSelect';
import MedicalRecordTemplates from './constants/MedicalRecordTemplates';

interface FormValues {
  text: string;
}

const MedicalRecordModal = () => {
  const showModal = useMedicalRecordModalStore((state) => state.showModal);
  const selectedMedicalRecord = useMedicalRecordModalStore((state) => state.selectedMedicalRecord);
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const validationSchema = Yup.object().shape({
    text: Yup.string().typeError('Insira um texto válido').required('Insira um texto'),
  });
  const initialValues: FormValues = { text: '' };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);

      if (!selectedMedicalRecord) return;

      const response = await updateMedicalRecord({ ...selectedMedicalRecord, ...values }, queryClient);

      if (!response) throw new Error('Erro ao atualizar formulação');

      resetForm();
      hideModal();
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(error);
    }
  };

  const handleSelectDefaultTemplates = (id: number) => {
    const template = MedicalRecordTemplates.find((prontuario) => prontuario.id === id);
    setFieldValue('text', template?.modelo ?? '');
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const { handleSubmit, setValues, resetForm, setFieldValue, values, touched, errors } = formik;
  const { hideModal } = useMedicalRecordModalStore();
  const { updateMedicalRecord } = useMedicalRecordStore();

  useEffect(() => {
    if (!selectedMedicalRecord) return resetForm();

    setValues({
      text: selectedMedicalRecord.text ?? '',
    });
  }, [resetForm, selectedMedicalRecord, setValues]);

  return (
    <Modal className="modal-close-out" size="xl" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Prontuário do paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <Row className="mb-3 d-flex">
            <div>
              <TemplateSelect setFieldValue={setFieldValue} />
            </div>
          </Row>
          <Col>
            <Button variant="primary" className="btn-icon btn-icon-start mb-2 me-1" onClick={() => handleSelectDefaultTemplates(1)}>
              Modelo: Primeiro atendimento
            </Button>
            <Button variant="primary" className="btn-icon btn-icon-start mb-2 me-1 " onClick={() => handleSelectDefaultTemplates(2)}>
              Modelo: Segundo atendimento
            </Button>
            <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => handleSelectDefaultTemplates(3)}>
              Modelo: Atendimentos subsequentes
            </Button>
          </Col>
          <div>
            <Editor
              apiKey="bef3ulc00yrfvjjiawm3xjxj41r1k2kl33t9zlo8ek3s1rpg"
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar:
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                table: {
                  title: 'Table',
                  items: 'inserttable | cell row column | advtablesort | tableprops deletetable',
                },
                language: 'pt_BR',
              }}
              value={values.text}
              onEditorChange={(content) => setFieldValue('text', content)}
            />
            {errors.text && touched.text && <div className="error">{errors.text}</div>}
          </div>
          <div className="text-center mt-2">
            <AsyncButton isSaving={isSaving} size="lg" type="submit">
              Salvar prontuário
            </AsyncButton>{' '}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MedicalRecordModal;
