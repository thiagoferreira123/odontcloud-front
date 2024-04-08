import React, { useState } from 'react';
import { Button, Modal, Form as BootstrapForm } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useConfirmDeleteFormModalStore } from '../Hooks/modals/ConfirmDeleteFormModalStore';
import { useQueryClient } from '@tanstack/react-query';
import { useFormStore } from '../../FormPatientRegistered/hooks/FormStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

const validationSchema = Yup.object().shape({
  confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
});

const initialValues = { confirm: '' };

const ConfirmDeleteFormModal = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const showModal = useConfirmDeleteFormModalStore((state) => state.showModal);
  const selectedForm = useConfirmDeleteFormModalStore((state) => state.selectedForm);

  const { hideModal } = useConfirmDeleteFormModalStore();
  const { deleteForm } = useFormStore();

  const onSubmit = () => {
    setIsLoading(true);

    try {
      if (!selectedForm) throw new Error('Formulário não encontrado');

      deleteForm(selectedForm, queryClient);
      hideModal();
      resetForm();
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
        <BootstrapForm onSubmit={handleSubmit} className="tooltip-end-top">
          Tem certeza que deseja excluir o formulário <b>{selectedForm?.nome}</b>? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
          <div className="filled mt-4">
            <CsLineIcons icon="bin" />
            <BootstrapForm.Control type="text" name="confirm" value={values.confirm} onChange={handleChange} placeholder="Digite excluir para confirmar" />
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
        </BootstrapForm>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteFormModal;
