import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteConfirmationModalStore } from '../hooks/DeleteConfirmationModalStore';
import useProfessionalStore from '../hooks/ProfessionalStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

const DeleteConfirmation = () => {
  const showModal = useDeleteConfirmationModalStore((state) => state.showModal);

  const selectedProfessional = useDeleteConfirmationModalStore((state) => state.selectedProfessional);
  const { removeProfessional } = useProfessionalStore();
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
  });

  const initialValues = { confirm: '' };

  const { hideModal } = useDeleteConfirmationModalStore();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      if (!selectedProfessional) throw new Error('selectedProfessional is not defined');

      const response = await removeProfessional(selectedProfessional, queryClient);

      if (response === false) throw new Error('Erro ao remover profissional');

      resetForm();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
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
        Você realmente deseja excluir o profissional? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
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
