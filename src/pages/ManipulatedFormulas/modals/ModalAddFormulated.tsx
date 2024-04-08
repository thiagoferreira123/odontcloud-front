import React, { useEffect, useState } from 'react';
import { Col, Form, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useModalAddFormulatedStore } from '../hooks/modals/ModalAddFormulatedStore';
import CategorySelect from './CategorySelect';
import AsyncButton from '../../../components/AsyncButton';
import { ITemplate, useTemplateStore } from '../hooks/TemplateStore';
import { useQueryClient } from '@tanstack/react-query';
import { sanitizeHtml } from '../../../helpers/StringHelpers';
import { Editor } from '@tinymce/tinymce-react';

interface FormValues {
  name: string;
  category: string;
  text: string;
}

const ModalAddFormulated = () => {
  const showModal = useModalAddFormulatedStore((state) => state.showModal);
  const selectedTemplate = useModalAddFormulatedStore((state) => state.selectedTemplate);
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().typeError('Insira um nome válido').required('Insira um nome'),
    category: Yup.string().typeError('Selecione uma categoria válida').required('Selecione uma categoria'),
    text: Yup.string()
      .typeError('Insira um texto válido')
      .required('Insira um texto')
      .transform((value) => sanitizeHtml(value ?? '')),
  });
  const initialValues: FormValues = { name: '', category: '', text: '' };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);

      if (selectedTemplate) {
        const payload: Partial<ITemplate> = {
          nome: values.name,
          texto: values.text,
          categoria: values.category,
        };

        const response = await updateTemplate({ ...selectedTemplate, ...payload }, queryClient);

        if (!response) throw new Error('Erro ao atualizar formulação');
      } else {
        const payload: Partial<ITemplate> = {
          nome: values.name,
          texto: values.text,
          categoria: values.category,
        };

        const response = await addTemplate(payload, queryClient);

        if (!response) throw new Error('Erro ao adicionar formulação');
      }

      resetForm();
      hideModal();
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(error);
    }
  };

  const changeText = (content: string) => {
    formik.setFieldValue('text', content);
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const { handleSubmit, handleChange, setValues, resetForm, values, touched, errors } = formik;
  const { hideModal } = useModalAddFormulatedStore();
  const { addTemplate, updateTemplate } = useTemplateStore();

  useEffect(() => {
    if(!selectedTemplate) return resetForm();

    setValues({
      name: selectedTemplate.nome,
      category: selectedTemplate.categoria,
      text: selectedTemplate.texto,
    });
  }, [resetForm, selectedTemplate, setValues]);

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Digite uma formulação para usar com outros pacientes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <Col className="d-flex">
            <div className="mb-3 top-label flex-grow-1 me-2">
              <Form.Control type="text" name="name" value={values.name} onChange={handleChange} />
              <Form.Label>DIGITE UM NOME PARA A FORMULAÇÃO</Form.Label>
              {errors.name && touched.name && <div className="error">{errors.name}</div>}
            </div>

            <div className="mb-3 top-label flex-grow-1" style={{ zIndex: 9999 }}>
              <CategorySelect
                touched={formik.touched}
                errors={formik.errors}
                value={formik.values.category}
                values={formik.values}
                handleChange={formik.handleChange}
                setFieldValue={formik.setFieldValue}
              />
              <Form.Label>SELECIONE UMA CATEGORIA</Form.Label>
              {errors.category && touched.category && <div className="error">{errors.category}</div>}
            </div>
          </Col>

          <Col className="d-flex position-relative">
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
              onEditorChange={(content) => changeText(content)}
            />
            {errors.text && touched.text && <div className="error">{errors.text}</div>}
          </Col>

          <div className="mt-3 text-center">
            <AsyncButton isSaving={isSaving} size="lg" type="submit">
              Salvar formulação
            </AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddFormulated;
