import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useModalStore } from './hooks/ModalStore';
import { useMyCommentStore } from './hooks/MyCommentStore';
import { useQueryClient } from '@tanstack/react-query';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { notify } from '../../../components/toast/NotificationIcon';

const DeleteConfirm = () => {
  const queryClient = useQueryClient();
  const selectedComment = useModalStore((state) => state.selectedComment);
  const showDeleteConfirmation = useModalStore((state) => state.showDeleteConfirmation);

  const [isLoading, setIsLoading] = useState(false);

  const { removeComment } = useMyCommentStore();
  const { setShowDeleteConfirmation, setSelectedComment } = useModalStore();

  const validationSchema = Yup.object().shape({
    confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
  });

  const initialValues = { confirm: '' };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      if (!selectedComment || !selectedComment.id) throw new Error('Orientação não encontrado');

      await removeComment(selectedComment, queryClient);

      resetForm();
      setIsLoading(false);
      setSelectedComment(null);
      notify('Orientação removida com sucesso', 'Sucesso', 'bin');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      notify('Erro ao remover orientação', 'Erro', 'error-hexagon');
    }

    setShowDeleteConfirmation(false);
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, values, touched, errors } = formik;

  return (
    <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Você realmente deseja excluir a orientação? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="filled mt-4">
            <CsLineIcons icon="bin" />
            <Form.Control type="text" name="confirm" value={values.confirm} onChange={handleChange} placeholder="Digite excluir para confirmar" />
            {errors.confirm && touched.confirm && <div className="error">{errors.confirm}</div>}
          </div>
          <div className="d-flex justify-content-center mt-3">
            {isLoading ? (
              <Button type="button" variant="primary" className="mb-1 btn btn-primary" disabled>
                <span className="spinner-border spinner-border-sm"></span> Excluindo...
              </Button>
            ) : (
              <Button type="submit" variant="primary" className="mb-1 btn btn-primary">
                Confirmar e excluir
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteConfirm;
