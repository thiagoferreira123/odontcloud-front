import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { useDeleteGoalTemplateConfirmationModalStore } from '../hooks/DeleteGoalTemplateConfirmationModalStore';
import useGoalTemplateStore from '../../../PatientMenu/goals/hooks/GoalTemplateStore';

const DeleteGoalTemplateConfirmationModal = () => {
  const selectedTemplate = useDeleteGoalTemplateConfirmationModalStore((state) => state.selectedTemplate);
  const showModal = useDeleteGoalTemplateConfirmationModalStore((state) => state.showModal);

  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const { removeGoalTemplate } = useGoalTemplateStore();
  const { closeModal } = useDeleteGoalTemplateConfirmationModalStore();

  const validationSchema = Yup.object().shape({
    confirm: Yup.string().required('Digite "excluir".').oneOf(['excluir'], 'Digite "excluir" para confirmar.'),
  });

  const initialValues = { confirm: '' };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      if (!selectedTemplate || !selectedTemplate.id) throw new Error('Modelo de meta não encontrado');

      await removeGoalTemplate(selectedTemplate, queryClient);

      resetForm();
      setIsLoading(false);
      closeModal();
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, values, touched, errors } = formik;

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Você realmente deseja excluir a meta? Se sim, digite 'excluir'. Atenção: esta ação é irreversível.
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

export default DeleteGoalTemplateConfirmationModal;
