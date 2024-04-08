import { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useForumTopicStore from '../hooks/ForumTopicStore';
import { useParams } from 'react-router-dom';
import { useCommentAnswerModalStore } from '../hooks/modals/CommentAnswerModalStore';
import { ForumTopicAnswerComment } from '../hooks/ForumTopicStore/types';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../Auth/Login/hook';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';
import { htmlToPlainText } from '../../../helpers/InputHelpers';
import AsyncButton from '../../../components/AsyncButton';

interface FormValues {
  mensagem: string;
}

const CommentAnswerModal = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const user = useAuth((state) => state.user);

  const [isSaving, setIsSaving] = useState(false);
  const initialValues = { mensagem: '' };
  const selectedCommentAnswer = useCommentAnswerModalStore((state) => state.selectedCommentAnswer);
  const selectedComment = useCommentAnswerModalStore((state) => state.selectedComment);
  const showModal = useCommentAnswerModalStore((state) => state.showModal);

  const validationSchema = Yup.object().shape({
    mensagem: Yup.string().required('Insira uma resposta válida'),
  });

  const onSubmit = async (values: FormValues) => {
    if (!id) throw new AppException('ID do tópico não informado');

    setIsSaving(true);

    try {
      if(!selectedComment) throw new AppException('Comentário não encontrado');

      const payload: Partial<ForumTopicAnswerComment> = {
        mensagem: values.mensagem.replace(/\n/g, '<br>'),
        data_criacao: new Date().toISOString(),
        resposta_id: selectedComment.id,
        pergunta_id: +id,
        comentario_id: null,
        data_modificacao: new Date().toISOString(),
      };

      if (selectedCommentAnswer?.id) {
        const response = await updateCommentAnswer({...payload, id: selectedCommentAnswer.id}, queryClient);

        if(response === false) throw new Error('Erro ao atualizar resposta');
      } else {
        if (!user) throw new AppException('Usuário não encontrado');
        const response = await addCommentAnswer(payload, queryClient, user);
        if(response === false) throw new Error('Erro ao adicionar resposta');
      }

      setIsSaving(false);
      hideModal();
      resetForm();
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify('Erro ao salvar resposta', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, resetForm, values, touched, errors } = formik;
  const { addCommentAnswer, updateCommentAnswer } = useForumTopicStore();
  const { hideModal } = useCommentAnswerModalStore();

  useEffect(() => {
    if (selectedCommentAnswer) {
      formik.setValues({ mensagem: htmlToPlainText(selectedCommentAnswer.mensagem) });
    } else {
      formik.setValues({ mensagem: '' });
    }
  }, [selectedCommentAnswer]);

  return (
    <Modal show={showModal} onHide={hideModal} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Insira uma resposta</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3 position-relative">
            <Form.Control as="textarea" rows={8} name="mensagem" onChange={handleChange} value={htmlToPlainText(values.mensagem)} />
            {errors.mensagem && touched.mensagem && <div className="error">{errors.mensagem}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton isSaving={isSaving} type="submit" className="mb-1 btn btn-primary">
            Salvar resposta
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CommentAnswerModal;
