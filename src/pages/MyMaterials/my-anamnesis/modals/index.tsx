import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AsyncButton from '/src/components/AsyncButton';
import { htmlToPlainText } from '/src/helpers/InputHelpers';
import { useMyAnamnesisStore } from '../hooks/MyAnamnesis';
import { useAnamnesisModalStore } from '../hooks/modals/AnamnesisModalStore';
import { useQueryClient } from '@tanstack/react-query';
import { AnamnesisTemplate } from '../../../Anamnesis/hooks/AnamnesisTemplateStore';
import { Editor } from '@tinymce/tinymce-react';

interface FormValues {
  titulo: string;
  modelo: string;
}

const LabelEndTooltip = ({ children }: { children: React.ReactNode }) => {
  const refError = useRef(null);
  const [left, setLeft] = useState(10);

  useEffect(() => {
    if (refError.current) {
      try {
        const parentElement = refError.current as HTMLElement | null;
        if (parentElement) {
          const labelElement = parentElement.querySelector('label');
          if (labelElement) {
            setLeft(labelElement.clientWidth + 10);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    return () => {};
  }, []);

  return (
    <div ref={refError} className="error" style={{ left }}>
      {children}
    </div>
  );
};

const AnamnesisModal: React.FC = () => {
  const queryClient = useQueryClient();

  const selectedAnamnesis = useAnamnesisModalStore((state) => state.selectedAnamnesis);
  const showModal = useAnamnesisModalStore((state) => state.showModal);

  const [isSaving, setIsSaving] = useState(false);
  const initialValues = { titulo: '', modelo: '' };

  const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('Insira um titulo válido'),
    modelo: Yup.string().required('Insira uma observação válida'),
  });

  const { updateAnamnesisTemplate, createAnamnesisTemplate } = useMyAnamnesisStore();
  const { hideModal } = useAnamnesisModalStore();

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);

    try {
      const payload: Partial<AnamnesisTemplate> = {
        ...values,
        data: new Date(),
      };

      if (!selectedAnamnesis?.id) {
        await createAnamnesisTemplate(payload, queryClient);
      } else {
        await updateAnamnesisTemplate({ ...selectedAnamnesis, ...payload }, queryClient);
      }

      setIsSaving(false);
      hideModal();
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, resetForm, values, touched, errors } = formik;

  useEffect(() => {
    if (selectedAnamnesis) {
      setFieldValue('modelo', selectedAnamnesis.modelo);
      setFieldValue('titulo', htmlToPlainText(selectedAnamnesis.titulo));
    } else {
      resetForm();
    }
  }, [resetForm, selectedAnamnesis, setFieldValue]);

  return (
    <Modal show={showModal} onHide={hideModal} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Insira uma anamnese</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <Form.Label>Título da anamnese</Form.Label>
            <Form.Control name="titulo" onChange={handleChange} value={values.titulo} />
            {errors.titulo && touched.titulo && <LabelEndTooltip>{errors.titulo}</LabelEndTooltip>}
          </div>

          <div className="mb-3 position-relative">
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
              value={values.modelo}
              onEditorChange={newValue => setFieldValue('modelo', newValue)}
            />
            {errors.modelo && touched.modelo && <LabelEndTooltip>{errors.modelo}</LabelEndTooltip>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton isSaving={isSaving} type="submit" className="mb-1 btn btn-primary">
            Salvar anamnese
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AnamnesisModal;
