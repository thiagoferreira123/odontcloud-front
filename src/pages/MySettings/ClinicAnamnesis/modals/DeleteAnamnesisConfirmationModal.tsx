import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import useClinicAnamnesisStore from '../hooks/ClinicAnamnesisStore';
import { useDeleteAnamnesisConfirmationModalStore } from '../hooks/DeleteProcedureConfirmationModalStore';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

const DeleteAnamnesisConfirmationModal = () => {
  const showModal = useDeleteAnamnesisConfirmationModalStore((state) => state.showModal);

  const selectedClinicAnamnesis = useDeleteAnamnesisConfirmationModalStore((state) => state.selectedClinicAnamnesis);
  const { removeClinicAnamnesis } = useClinicAnamnesisStore();
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const validationSchema = Yup.object().shape({
    confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
  });

  const initialValues = { confirm: '' };

  const { hideModal } = useDeleteAnamnesisConfirmationModalStore();

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      if (!selectedClinicAnamnesis) throw new Error('selectedClinicAnamnesis is not defined');

      const response = await removeClinicAnamnesis(selectedClinicAnamnesis, queryClient);

      if (response === false) throw new Error('Erro ao remover anamnese');

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
        Você realmente deseja excluir a anamnese? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
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

export default DeleteAnamnesisConfirmationModal;
