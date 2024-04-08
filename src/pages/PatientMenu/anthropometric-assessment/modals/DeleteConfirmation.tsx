import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import { useDeletConfirmationModalStore } from '../hooks/DeletConfirmationModalStore';
import { useAntropometricAssessmentStore } from '../hooks/AntropometricAssessmentStore';

const DeleteConfirmation = () => {

  const showModal = useDeletConfirmationModalStore((state) => state.showModal);

  const selectedAssessment = useDeletConfirmationModalStore((state) => state.selectedAssessment);
  const {removeAssessment} = useAntropometricAssessmentStore();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
  });

  const initialValues = { confirm: '' };

  const { hideModal } = useDeletConfirmationModalStore();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      if(!selectedAssessment) throw new Error('selectedAssessment is not defined');

      const response = await removeAssessment(selectedAssessment);

      if(response === false) throw new Error('Erro ao remover avaliação antropométrica');

      resetForm();
      setIsLoading(false);
      notify('Avaliação antropométrica removida com sucesso', 'Sucesso', 'bin')
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      notify('Erro ao remover avaliação antropométrica', 'Erro', 'error-hexagon')
    }

    hideModal();
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, values, touched, errors } = formik;

  const notify = (message: string, title: string, icon: string, status?: string) => toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Você realmente deseja excluir a avaliação antropométrica? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
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

export default DeleteConfirmation;
