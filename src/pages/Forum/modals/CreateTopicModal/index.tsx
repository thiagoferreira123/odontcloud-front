import { useFormik } from 'formik';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import * as Yup from 'yup';
import { useCreateTopicModalStore } from '../../hooks/modals/CreateTopicModalStore';
import TagSelect from './TagSelect';
import CategorySelect from './CategorySelect';
import useForumTopicStore from '../../hooks/ForumTopicStore';
import { useQueryClient } from '@tanstack/react-query';
import AsyncButton from '../../../../components/AsyncButton';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../Auth/Login/hook';
import { htmlToPlainText } from '../../../../helpers/InputHelpers';

export interface CreateTopicModalFormValues {
  titulo: string;
  mensagem: string;
  tags: {
    id: number;
    nome: string;
  }[];
  categories: {
    id: number;
    nome: string;
  }[];
}

const CreateTopicModal = () => {
  const queryClient = useQueryClient();
  const showModal = useCreateTopicModalStore((state) => state.showModal);
  const selectedTopic = useCreateTopicModalStore((state) => state.selectedTopic);

  const user = useAuth((state) => state.user);

  const [isSaving, setIsSaving] = useState(false);

  const validationSchema = Yup.object().shape({
    titulo: Yup.string().required('O título é obrigatório'),
    mensagem: Yup.string().required('A mensagem é obrigatória'),
  });

  const initialValues: CreateTopicModalFormValues = {
    titulo: '',
    mensagem: '',
    tags: [],
    categories: [],
  };

  const onSubmit = async (values: CreateTopicModalFormValues) => {
    try {
      setIsSaving(true);

      if(!user) throw new Error('Usuário não encontrado');

      if(selectedTopic?.id) {

        if(selectedTopic.profissional_id !== user.id) throw new Error('Usuário não autorizado');

        const response = await updateForum({
          ...values,
          id: selectedTopic.id,
          mensagem: values.mensagem.replace(/\n/g, '<br />'),
          data_criacao: new Date().toISOString(),
          data_modificacao: new Date().toISOString(),
        }, queryClient);

        if (response === false) throw new Error('Erro ao adicionar tópico');
      }else {
        const response = await addForum({
          ...values,
          mensagem: values.mensagem.replace(/\n/g, '<br />'),
          data_criacao: new Date().toISOString(),
          data_modificacao: new Date().toISOString(),
        }, queryClient, user);

        if (response === false) throw new Error('Erro ao adicionar tópico');
      }

      resetForm();
      hideModal();
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, resetForm, values, touched, errors } = formik;
  const { hideModal } = useCreateTopicModalStore();
  const { addForum, updateForum } = useForumTopicStore();

  useEffect(() => {
    if (selectedTopic) {
      formik.setValues({
        titulo: selectedTopic.titulo,
        mensagem: htmlToPlainText(selectedTopic.mensagem),
        tags: selectedTopic.tags,
        categories: selectedTopic.categories,
      });
    } else resetForm();
  }, [selectedTopic]);

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        {' '}
        <Modal.Title>Crie um novo tópico</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="d-flex">
            <Col className="mb-3 top-label me-2">
              <Form.Control type="text" name="titulo" value={values.titulo} onChange={handleChange} />
              <Form.Label>NOME DO TÓPICO</Form.Label>
              {errors.titulo && touched.titulo && <div className="error">{errors.titulo}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col className="mb-3 top-label me-2">
              <Form.Control type="text" as="textarea" rows={5} name="mensagem" value={values.mensagem} onChange={handleChange} />
              <Form.Label>DESCRIÇÃO DO TÓPICO</Form.Label>
              {errors.mensagem && touched.mensagem && <div className="error">{errors.mensagem}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col className="mb-3 top-label me-2">
              <TagSelect setFieldValue={setFieldValue} values={values} />
              <Form.Label>TAG DO TÓPICO</Form.Label>
              {errors.tags && touched.tags && <div className="error">{errors.tags.toString()}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col className="mb-3 top-label me-2">
              <CategorySelect setFieldValue={setFieldValue} values={values} />
              <Form.Label>CATEGORIA TÓPICO</Form.Label>
              {errors.categories && touched.categories && <div className="error">{errors.categories.toString()}</div>}
            </Col>
          </div>

          <div className="text-center mt-3">
            <AsyncButton isSaving={isSaving} type="submit" variant="primary" className="me-2">
              Salvar tópico
            </AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTopicModal;
