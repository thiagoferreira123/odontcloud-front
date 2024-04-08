import { useState } from 'react';
import { Modal, Form as BootstrapForm, Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AnswerTypes, useConfirmDeleteAnswerModalStore } from '../Hooks/modals/ConfirmDeleteAnswerModal';
import { useAnsweredByPatiendFormStore } from '../../PatientMenu/form-patient-registered/hooks/AnsweredByPatiendFormStore';
import { useQueryClient } from '@tanstack/react-query';
import { useNotSignedAnswerStoreStore } from '../Hooks/NotSignedAnswerStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

const validationSchema = Yup.object().shape({
  confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
});

const initialValues = { confirm: '' };

const ConfirmDeleteAnswerModal = () => {
  const queryClient = useQueryClient();

  const selectedAnsweredForm = useConfirmDeleteAnswerModalStore((state) => state.selectedAnsweredForm);
  const showModal = useConfirmDeleteAnswerModalStore((state) => state.showModal);
  const type = useConfirmDeleteAnswerModalStore((state) => state.type);

  const [isPending, setIsLoading] = useState(false);
  const { hideModal } = useConfirmDeleteAnswerModalStore();
  const { deletePatientAnswer } = useAnsweredByPatiendFormStore();
  const { deleteNotSignedAnswerStore } = useNotSignedAnswerStoreStore();

  const onSubmit = async () => {
    try {
      if (!selectedAnsweredForm) throw new Error('selectedAnsweredForm is not defined');

      setIsLoading(true);

      const response =
        type === AnswerTypes.NAO_CADASTRADO
          ? await deleteNotSignedAnswerStore(selectedAnsweredForm, queryClient)
          : await deletePatientAnswer(selectedAnsweredForm, queryClient);

      if (response === false) throw new Error('Erro ao remover predição de resposta');

      resetForm();
      hideModal();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, values, touched, errors } = formik;

  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          Tem certeza que deseja excluir a resposta do <b>{selectedAnsweredForm && selectedAnsweredForm.nome}</b>? Se sim, digite 'excluir'. Atenção: esta ação
          é irreversível.
          <div className="filled mt-4">
            <CsLineIcons icon="bin" />
            <BootstrapForm.Control type="text" name="confirm" value={values.confirm} onChange={handleChange} placeholder="Digite excluir para confirmar" />
            {errors.confirm && touched.confirm && <div className="error">{errors.confirm}</div>}
          </div>
          <div className="d-flex justify-content-center mt-3">
            {isPending ? (
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

export default ConfirmDeleteAnswerModal;
