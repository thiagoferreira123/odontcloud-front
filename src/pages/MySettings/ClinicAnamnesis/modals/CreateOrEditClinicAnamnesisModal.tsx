import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateAndAnamnesisEditModalStore } from '../hooks/CreateAndProcedureEditModalStore';
import useClinicAnamnesisStore from '../hooks/ClinicAnamnesisStore';
import AsyncButton from '../../../../components/AsyncButton';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../Auth/Login/hook';

interface CreateOrEditClinicAnamnesisModalFormValues {
  clinic_anamnesi_text: string;
  clinic_identification: string;
}

const validationSchema = Yup.object().shape({
  clinic_identification: Yup.string().required('Insira uma identificação'),
  clinic_anamnesi_text: Yup.string().required('Insira um texto'),
});

const initialValues: CreateOrEditClinicAnamnesisModalFormValues = { clinic_identification: '', clinic_anamnesi_text: '' };

const CreateOrEditClinicAnamnesisModal = () => {
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);

  const [isSaving, setIsSaving] = useState(false);

  const showModal = useCreateAndAnamnesisEditModalStore((state) => state.showModal);
  const selectedClinicAnamnesis = useCreateAndAnamnesisEditModalStore((state) => state.selectedClinicAnamnesis);

  const { hideModal } = useCreateAndAnamnesisEditModalStore();
  const { updateClinicAnamnesis, addClinicAnamnesis } = useClinicAnamnesisStore();

  const onSubmit = async (values: CreateOrEditClinicAnamnesisModalFormValues) => {
    try {
      setIsSaving(true);

      if (!user?.clinic_id) throw new Error('Usuário não encontrado');

      if (selectedClinicAnamnesis) {
        const response = await updateClinicAnamnesis({ ...selectedClinicAnamnesis, ...values }, queryClient);

        if (response === false) throw new Error('Erro ao adicionar laboratório');
      } else {
        const response = await addClinicAnamnesis({...values, clinic_anamnesi_clinic_id: user.clinic_id}, queryClient);

        if (response === false) throw new Error('Erro ao adicionar laboratório');
      }

      setIsSaving(false);
      hideModal();
    } catch (error) {
      setIsSaving(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, resetForm, values, touched, errors } = formik;

  useEffect(() => {
    if (selectedClinicAnamnesis) {
      setFieldValue('clinic_identification', selectedClinicAnamnesis.clinic_identification);
      setFieldValue('clinic_anamnesi_text', selectedClinicAnamnesis.clinic_anamnesi_text);
    } else {
      resetForm();
    }
  }, [selectedClinicAnamnesis, resetForm, setFieldValue]);

  return (
    <Modal className="modal-close-out" size="xl" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Anamnese do paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <Col>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="acorn" />
              <Form.Control type="text" name="clinic_identification" placeholder="Identificação" value={values.clinic_identification} onChange={handleChange} />
              {errors.clinic_identification && touched.clinic_identification && <div className="d-block invalid-tooltip">{errors.clinic_identification}</div>}
            </div>
          </Col>

          <div className="mb-3 filled form-group tooltip-end-top">
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
              value={values.clinic_anamnesi_text}
              onEditorChange={(clinic_anamnesi_text) => setFieldValue('clinic_anamnesi_text', clinic_anamnesi_text)}
            />
            {errors.clinic_anamnesi_text && touched.clinic_anamnesi_text && <div className="d-block invalid-tooltip">{errors.clinic_anamnesi_text}</div>}
          </div>

          <div className="text-center mt-2">
            <AsyncButton isSaving={isSaving} variant="primary" size="lg" className="hover-scale-down mt-3" type="submit">
              <CsLineIcons icon="save" /> <span>Salvar anamnese</span>
            </AsyncButton>{' '}
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateOrEditClinicAnamnesisModal;
