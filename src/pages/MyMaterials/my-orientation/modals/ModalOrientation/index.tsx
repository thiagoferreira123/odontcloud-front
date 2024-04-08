import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AsyncButton from '/src/components/AsyncButton';
import api from '/src/services/useAxios';
import { OrientationTemplate } from '/src/types/PlanoAlimentarClassico';
import { useMyOrientationStore } from '../../hooks/MyOrientationStore';
import { htmlToPlainText } from '/src/helpers/InputHelpers';
import { notify } from '../../../../../components/toast/NotificationIcon';
import { Editor } from '@tinymce/tinymce-react';

interface FormValues {
  nome: string;
  orientacao: string;
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

const ModalOrientation: React.FC = () => {
  const selectedOrientation = useMyOrientationStore((state) => state.selectedOrientation);
  const showModal = useMyOrientationStore((state) => state.showModal);

  const [isSaving, setIsSaving] = useState(false);
  const initialValues = { nome: '', orientacao: '' };

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Insira um nome válido'),
    orientacao: Yup.string().required('Insira uma observação válida'),
  });

  const { updateOrientation, addOrientation, setShowModal } = useMyOrientationStore();

  const onSubmit = async (values: FormValues) => {
    if (!selectedOrientation) return;

    setIsSaving(true);

    try {
      const payload: OrientationTemplate = {
        ...values,
      };

      if (!selectedOrientation.id) {
        const { data } = await api.post('/orientacao-nutricional/', payload);
        addOrientation(data);
      } else {
        await api.patch('/orientacao-nutricional/' + selectedOrientation.id, payload);
        updateOrientation({ ...selectedOrientation, ...payload });
      }

      setIsSaving(false);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      notify('Erro ao salvar orientação', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, values, touched, errors } = formik;

  useEffect(() => {
    if (selectedOrientation) {
      setFieldValue('orientacao', selectedOrientation.orientacao);
      setFieldValue('nome', htmlToPlainText(selectedOrientation.nome));
    }
  }, [selectedOrientation, setFieldValue]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Insira uma orientação</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <Form.Label>Nome da orientação</Form.Label>
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
              value={values.orientacao}
              onEditorChange={(orientacao) => formik.setFieldValue('orientacao', orientacao)}
            />
            {errors.orientacao && touched.orientacao && <LabelEndTooltip>{errors.orientacao}</LabelEndTooltip>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton isSaving={isSaving} type="submit" className="mb-1 btn btn-primary">
            Salvar orientação
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalOrientation;
