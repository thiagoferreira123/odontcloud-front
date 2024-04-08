import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Editor } from '@tinymce/tinymce-react';
import { CommentTemplate, useMyCommentStore } from '../../hooks/MyCommentStore';
import { htmlToPlainText } from '../../../../../helpers/InputHelpers';
import { useQueryClient } from '@tanstack/react-query';
import AsyncButton from '../../../../../components/AsyncButton';

interface FormValues {
  nome: string;
  comentario: string;
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

const ModalComment: React.FC = () => {
  const queryClient = useQueryClient();
  const selectedComment = useMyCommentStore((state) => state.selectedComment);
  const showModal = useMyCommentStore((state) => state.showModal);

  const [isSaving, setIsSaving] = useState(false);
  const initialValues = { nome: '', comentario: '' };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Insira um nome válido'),
    comentario: Yup.string().required('Insira uma observação válida'),
  });

  const { updateComment, addComment, setShowModal } = useMyCommentStore();

  const onSubmit = async (values: FormValues) => {
    if (!selectedComment) return;

    setIsSaving(true);

    try {
      const payload: Partial<CommentTemplate> = {
        ...values,
      };

      if (!selectedComment.id) {
        const response = await addComment(payload, queryClient);
        if (!response) throw new Error('Erro ao salvar comentário');
      } else {
        const response = await updateComment({ ...selectedComment, ...payload }, queryClient);
        if (!response) throw new Error('Erro ao atualizar comentário');
      }

      setIsSaving(false);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, values, touched, errors } = formik;

  useEffect(() => {
    if (selectedComment) {
      setFieldValue('comentario', selectedComment.comentario);
      setFieldValue('nome', htmlToPlainText(selectedComment.nome));
    }
  }, [selectedComment, setFieldValue]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Insira uma comentário</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <Form.Label>Nome da comentário</Form.Label>
            <Form.Control name="nome" onChange={handleChange} value={values.nome} />
            {errors.nome && touched.nome && <LabelEndTooltip>{errors.nome}</LabelEndTooltip>}
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
              value={values.comentario}
              onEditorChange={(comentario) => formik.setFieldValue('comentario', comentario)}
            />
            {errors.comentario && touched.comentario && <LabelEndTooltip>{errors.comentario}</LabelEndTooltip>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton isSaving={isSaving} type="submit" className="mb-1 btn btn-primary">
            Salvar comentário
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalComment;
