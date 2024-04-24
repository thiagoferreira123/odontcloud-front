import { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateAndAnamnesisEditModalStore } from '../hooks/CreateAndProcedureEditModalStore';
import useClinicAnamnesisStore from '../hooks/ClinicAnamnesisStore';
import AsyncButton from '../../../../components/AsyncButton';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../Auth/Login/hook';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/link';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/models/dom/model';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/content/default/content.min.css';
import { Editor } from '@tinymce/tinymce-react';

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
              licenseKey='gpl'
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar:
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                table: {
                  title: 'Table',
                  items: 'inserttable | cell row column | advtablesort | tableprops deletetable',
                },
                language_url : '/langs/pt_BR.js',
                font_family_formats:
                  'Mulish=mulish; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
                content_style:
                  "@import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap'); * { font-family: Mulish; }",
                promotion: false,
                init_instance_callback: function (editor) {
                  editor.on('init', function () {
                    editor.execCommand('fontName', false, 'Mulish');
                    editor.execCommand('fontSize', false, '12');
                  });
                },
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
