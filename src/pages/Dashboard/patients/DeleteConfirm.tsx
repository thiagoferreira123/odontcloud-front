import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import usePatients from '../../../hooks/usePatients';
import { useDeleteConfirmStore } from './hooks/DeleteConfirm';
import { useQueryClient } from '@tanstack/react-query';

const DeleteConfirm = () => {
  const selectedPatient = useDeleteConfirmStore((state) => state.selectedPatient);
  const showModal = useDeleteConfirmStore(state => state.showModal);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
  });

  const initialValues = { confirm: '' };

  const { removePatient } = usePatients();
  const { handleCloseModal } = useDeleteConfirmStore();

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      if (!selectedPatient) throw new Error('Paciente não selecionado');

      const result = await removePatient(selectedPatient, queryClient);

      if(!result) throw new Error('Erro ao remover paciente');

      resetForm();
      setIsLoading(false);
      notify('Paciente removido com sucesso', 'Sucesso', 'bin');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      notify('Erro ao remover paciente', 'Erro', 'error-hexagon');
    }

    handleCloseModal();
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, values, touched, errors } = formik;

  const notify = (message: string, title: string, icon: string, status?: string) =>
    toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Você realmente deseja excluir o paciente? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
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
