import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteConfirmationModalStore } from '../hooks/DeleteConfirmationModalStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import useToothStore from '../hooks/ToothStore';
import { useParams } from 'react-router-dom';
import { AppException } from '../../../helpers/ErrorHelpers';

const DeleteConfirmationModal = () => {
  const { id } = useParams();
  const showModal = useDeleteConfirmationModalStore((state) => state.showModal);

  const selectedTooth = useDeleteConfirmationModalStore((state) => state.selectedTooth);
  const { removeTooth } = useToothStore();
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
      if (!selectedTooth) throw new AppException('selectedTooth is not defined');
      if(!id) throw new AppException('id is not defined');

      const response = await removeTooth(selectedTooth, id, queryClient);

      if (response === false) throw new Error('Erro ao remover dente');

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
        Você realmente deseja excluir o dente? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
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

export default DeleteConfirmationModal;
