import { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { formatTimeAgo } from '../../../helpers/DateHelper';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';
import { ForumTopicAnswer, ForumTopicAnswerComment } from '../hooks/ForumTopicStore/types';
import { useQueryClient } from '@tanstack/react-query';
import { AppException } from '../../../helpers/ErrorHelpers';
import { useAuth } from '../../Auth/Login/hook';
import useForumTopicStore from '../hooks/ForumTopicStore';
import { notify } from '../../../components/toast/NotificationIcon';
import CommentAnswerModal from './CommentAnswerModal';
import { useCommentAnswerModalStore } from '../hooks/modals/CommentAnswerModalStore';
import EditAnswerModal from './EditAnswerModal';
import { useEditAnswerModalStore } from '../hooks/modals/EditAnswerModalStore';
import * as Yup from 'yup';
import { useFormik } from 'formik';

type AnswersProps = {
  answers: ForumTopicAnswer[];
};

interface FormValues {
  corpo: string;
}

export default function Answers({ answers }: AnswersProps) {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const user = useAuth((state) => state.user);

  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [answerIdsDeleting, setAnswerIdsDeleting] = useState<number[]>([]);
  const [commentIdsDeleting, setCommentIdsDeleting] = useState<number[]>([]);
  const [commentIdsLiking, setCommentIdsLiking] = useState<number[]>([]);

  const validationSchema = Yup.object().shape({
    corpo: Yup.string().required('Insira um comentário válido'),
  });

  const initialValues = { corpo: '' };

  const { addAnswer, removeAnswer, removeCommentAnswer, addCommentLike, removeCommentLike } = useForumTopicStore();
  const { handleSelectComment, handleSelectCommentAnswer } = useCommentAnswerModalStore();
  const { handleSelectCommentToEdit } = useEditAnswerModalStore();

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id) throw new AppException('ID do tópico não informado');
      if (!user) throw new AppException('Usuário não encontrado');

      setIsSavingAnswer(true);

      const response = await addAnswer(
        {
          corpo: values.corpo.replace(/\n/g, '<br>'),
          data_criacao: new Date().toISOString(),
          data_modificacao: new Date().toISOString(),
          pergunta_id: +id,
          curtidas: [],
          comentarios: [],
        },
        queryClient,
        user
      );

      if (response === false) throw new Error('Erro ao adicionar resposta');

      resetForm();
      setIsSavingAnswer(false);
    } catch (error) {
      setIsSavingAnswer(false);
      console.error(error);
      error instanceof AppException && notify('Erro ao adicionar resposta', 'Erro', 'close', 'danger');
    }
  };

  const handleRemoveAnswer = async (answer: ForumTopicAnswer) => {
    try {
      if (!id) throw new AppException('ID do tópico não informado');
      if (!user) throw new AppException('Usuário não encontrado');

      setAnswerIdsDeleting([...answerIdsDeleting, answer.id]);

      const response = await removeAnswer(answer, queryClient);

      if (response === false) throw new Error('Erro ao remover resposta');

      setAnswerIdsDeleting(answerIdsDeleting.filter((id) => id !== answer.id));
    } catch (error) {
      console.error(error);
      error instanceof AppException && alert('Erro ao remover resposta');
    }
  };

  const handleRemoveCommentAnswer = async (comment: ForumTopicAnswerComment) => {
    try {
      if (!id) throw new AppException('ID do tópico não informado');
      if (!user) throw new AppException('Usuário não encontrado');

      setCommentIdsDeleting([...commentIdsDeleting, comment.id]);

      const response = await removeCommentAnswer(comment, queryClient);

      if (response === false) throw new Error('Erro ao remover resposta');

      setCommentIdsDeleting(commentIdsDeleting.filter((id) => id !== comment.id));
    } catch (error) {
      console.error(error);
      error instanceof AppException && alert('Erro ao remover resposta');
    }
  };

  const handleToggleLike = async (answer: ForumTopicAnswer) => {
    try {
      if (!id) throw new AppException('ID do tópico não informado');
      if (!user) throw new AppException('Usuário não encontrado');

      setCommentIdsLiking([...commentIdsLiking, answer.id]);

      const like = {
        pergunta_id: +id,
        resposta_id: answer.id,
        tipo: 'resposta',
      };

      const existingLike = answer.curtidas.find((c) => c.profissional_id === user.id);

      if (existingLike) {
        const response = await removeCommentLike(existingLike, queryClient);

        if (response === false) throw new Error('Erro ao remover curtida');
      } else {
        const response = await addCommentLike(like, queryClient, user);

        if (response === false) throw new Error('Erro ao adicionar curtida');
      }

      setCommentIdsLiking(commentIdsLiking.filter((id) => id !== answer.id));
    } catch (error) {
      setCommentIdsLiking(commentIdsLiking.filter((id) => id !== answer.id));
      console.error(error);
      error instanceof AppException && alert('Erro ao adicionar curtida');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, resetForm, values, touched, errors } = formik;

  return (
    <Card>
      <Card.Body>
        {answers.map((answer) => (
          <div className='border-bottom border-separator-light mb-4' key={answer.id}>
            <div className="d-flex align-items-center mt-3 ">
              <Row className="g-0 w-100">
                <Col xs="auto">
                  <div className="sw-5 me-3">
                    <img
                      src={answer.professional?.image ? answer.professional.image : '/img/profile/profile-11.webp'}
                      className="img-fluid rounded-xl sw-5 sh-5"
                      alt="thumb"
                    />
                  </div>
                </Col>
                <Col className="pe-3">
                  <div>{answer.professional?.nome_completo}</div>
                  <div className="text-muted text-small mb-2">{formatTimeAgo(answer.data_criacao)}</div>
                  <div className="text-alternate lh-1-25 fade alert alert-light show" dangerouslySetInnerHTML={{ __html: answer.corpo ?? '' }}></div>
                </Col>
                <Col xs="auto" className="justify-self-end">
                  <div>
                    <span className="text-muted me-2">{answer.curtidas.length ?? 0}</span>
                    <AsyncButton
                      isSaving={commentIdsLiking.includes(answer.id)}
                      variant="foreground"
                      size="sm"
                      loadingText=" "
                      className="btn-icon btn-icon-only hover-outline mb-1"
                      onClickHandler={() => handleToggleLike(answer)}
                    >
                      <CsLineIcons icon="heart" fill={answer.curtidas.find((c) => c.profissional_id === user?.id) ? 'currentColor' : 'none'} />
                    </AsyncButton>
                    <Button variant="foreground" size="sm" className="btn-icon btn-icon-only hover-outline mb-1" onClick={() => handleSelectComment(answer)}>
                      <CsLineIcons icon="message" />
                    </Button>
                    {answer.profissional_id === user?.id ? (
                      <>
                        <Button
                          variant="foreground"
                          size="sm"
                          className="btn-icon btn-icon-only hover-outline mb-1"
                          onClick={() => handleSelectCommentToEdit(answer)}
                        >
                          <CsLineIcons icon="edit" />
                        </Button>

                        <AsyncButton
                          isSaving={answerIdsDeleting.includes(answer.id)}
                          variant="foreground"
                          size="sm"
                          loadingText=" "
                          className="btn-icon btn-icon-only hover-outline mb-1"
                          onClickHandler={() => handleRemoveAnswer(answer)}
                        >
                          <CsLineIcons icon="bin" />
                        </AsyncButton>
                      </>
                    ) : null}
                  </div>
                </Col>
              </Row>
            </div>

            {/* Comments End */}
            {answer.comentarios.map((comment) => (
              <Row key={comment.id} className="ms-5 mb-3 border-separator-light">
                <Col xs="auto">
                  <div className="sw-5">
                    <img
                      src={comment.professional?.image ? comment.professional.image : '/img/profile/profile-11.webp'}
                      className="img-fluid rounded-xl sw-5 sh-5"
                      alt="thumb"
                    />
                  </div>
                </Col>
                <Col className="pe-3">
                  <div>{comment.professional?.nome_completo}</div>
                  <div className="text-muted text-small mb-2">{formatTimeAgo(comment.data_criacao)}</div>
                  <div className="text-medium text-alternate lh-1-25 fade alert alert-light show" dangerouslySetInnerHTML={{ __html: comment.mensagem ?? '' }}></div>
                </Col>
                <Col xs="auto" className="justify-self-end">
                  <div>
                    {comment.profissional_id === user?.id ? (
                      <>
                        <Button
                          variant="foreground"
                          size="sm"
                          className="btn-icon btn-icon-only hover-outline mb-1"
                          onClick={() => handleSelectCommentAnswer(comment, answer)}
                        >
                          <CsLineIcons icon="edit" />
                        </Button>
                        <AsyncButton
                          isSaving={commentIdsDeleting.includes(comment.id)}
                          variant="foreground"
                          size="sm"
                          loadingText=" "
                          className="btn-icon btn-icon-only hover-outline mb-1"
                          onClickHandler={() => handleRemoveCommentAnswer(comment)}
                        >
                          <CsLineIcons icon="bin" />
                        </AsyncButton>
                      </>
                    ) : null}
                  </div>
                </Col>
              </Row>
            ))}
            {/* Comments End */}
          </div>
        ))}

        <form onSubmit={handleSubmit}>
          <Row className="align-items-start">
            <Col md={12}>
              <Form.Control
                as="textarea"
                rows={5}
                value={values.corpo}
                onChange={handleChange}
                name="corpo"
                className="mt-3"
                placeholder="Digite um comentário..."
              />
              {errors.corpo && touched.corpo && <div className="error">{errors.corpo}</div>}
            </Col>
          </Row>
          <Row className="text-center">
            <Col md={12}>
              <AsyncButton isSaving={isSavingAnswer} type='submit' variant="outline-primary" size="sm" className="mt-2">
                Enviar comentário
              </AsyncButton>{' '}
            </Col>
          </Row>
        </form>

        <EditAnswerModal />
        <CommentAnswerModal />
      </Card.Body>
    </Card>
  );
}
