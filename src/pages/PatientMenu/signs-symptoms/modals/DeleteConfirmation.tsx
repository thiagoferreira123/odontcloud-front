import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDeleteConfirmationStore } from '../hooks/DeleteConfirmationStore';
import useSignsSymptomsStore from '../hooks/SignsSymptomsStore';
import { useQueryClient } from '@tanstack/react-query';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { notify } from '../../../../components/toast/NotificationIcon';

const DeleteConfirmation = () => {
  const queryClient = useQueryClient();
  const showModal = useDeleteConfirmationStore((state) => state.showModal);

  const selectedSignsSymptom = useDeleteConfirmationStore((state) => state.selectedSignsSymptom);
  const { removeSignsSymptom } = useSignsSymptomsStore();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
  });

  const initialValues = { confirm: '' };

  const { hideModal } = useDeleteConfirmationStore();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      if (!selectedSignsSymptom) throw new Error('selectedSignsSymptom is not defined');

      const response = await removeSignsSymptom(selectedSignsSymptom, queryClient);

      if (response === false) throw new Error('Erro ao remover registro de sinais e sintomas');

      resetForm();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      notify('Erro ao remover registro de sinais e sintomas', 'Erro', 'error-hexagon');
    }

    hideModal();
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, values, touched, errors } = formik;

  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Você realmente deseja excluir o registro de sinais e sintomas? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
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
