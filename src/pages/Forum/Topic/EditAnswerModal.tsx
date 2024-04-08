import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useForumTopicStore from '../hooks/ForumTopicStore';
import { useParams } from 'react-router-dom';
import { useEditAnswerModalStore } from '../hooks/modals/EditAnswerModalStore';
import { ForumTopicAnswer } from '../hooks/ForumTopicStore/types';
import { useQueryClient } from '@tanstack/react-query';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';
import { htmlToPlainText } from '../../../helpers/InputHelpers';
import AsyncButton from '../../../components/AsyncButton';

interface FormValues {
  corpo: string;
}

const EditAnswerModal = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [isSaving, setIsSaving] = useState(false);
  const initialValues = { corpo: '' };
  const selectedComment = useEditAnswerModalStore((state) => state.selectedComment);
  const showModal = useEditAnswerModalStore((state) => state.showModal);

  const validationSchema = Yup.object().shape({
    corpo: Yup.string().required('Insira um comentário válido'),
  });

  const onSubmit = async (values: FormValues) => {
    if (!id) throw new AppException('ID do tópico não informado');

    setIsSaving(true);

    try {
      if (!selectedComment) throw new AppException('Comentário não encontrado');

      const payload: Partial<ForumTopicAnswer> = {
        corpo: values.corpo.replace(/\n/g, '<br>'),
        data_criacao: new Date().toISOString(),
        pergunta_id: +id,
        data_modificacao: new Date().toISOString(),
      };

      const response = await updateAnswer({ ...payload, id: selectedComment.id }, queryClient);

      if (response === false) throw new Error('Erro ao atualizar comentário');

      setIsSaving(false);
      hideModal();
      resetForm();
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify('Erro ao salvar comentário', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, resetForm, values, touched, errors } = formik;
  const { updateAnswer } = useForumTopicStore();
  const { hideModal } = useEditAnswerModalStore();

  useEffect(() => {
    if (selectedComment) {
      formik.setValues({ corpo: htmlToPlainText(selectedComment.corpo) });
    } else {
      formik.setValues({ corpo: '' });
    }
  }, [selectedComment]);

  return (
    <Modal show={showModal} onHide={hideModal} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Editar comentário</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3 position-relative">
            <Form.Control as="textarea" rows={8} name="corpo" onChange={handleChange} value={htmlToPlainText(values.corpo)} />
            {errors.corpo && touched.corpo && <div className="error">{errors.corpo}</div>}
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

export default EditAnswerModal;
