import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGoalModalStore } from '../hooks/GoalModalStore';
import { useQueryClient } from '@tanstack/react-query';
import useGoalTemplateStore from '../../../PatientMenu/goals/hooks/GoalTemplateStore';
import { GoalTemplate } from '../../../PatientMenu/goals/hooks/GoalTemplateStore/types';
import AsyncButton from '../../../../components/AsyncButton';

interface FormValues {
  name: string;
  description: string;
}

const GoalModal: React.FC = () => {
  const queryClient = useQueryClient();

  const selectedGoal = useGoalModalStore((state) => state.selectedGoal);
  const showModal = useGoalModalStore((state) => state.showModal);

  const [isSaving, setIsSaving] = useState(false);
  const initialValues: FormValues = { name: '', description: '' };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Insira um nome válido'),
    description: Yup.string().required('Insira uma descrição válida'),
  });

  const { updateGoalTemplate, addGoalTemplate } = useGoalTemplateStore();
  const { hideModal } = useGoalModalStore();

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);

    try {
      const payload: Partial<GoalTemplate> = {
        ...values,
      };

      if (!selectedGoal?.id) {
        await addGoalTemplate(payload, queryClient);
      } else {
        await updateGoalTemplate({ ...selectedGoal, ...payload }, queryClient);
      }

      setIsSaving(false);
      hideModal();
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, resetForm, values, touched, errors } = formik;

  useEffect(() => {
    if (selectedGoal) {
      setFieldValue('name', selectedGoal.name);
      setFieldValue('description', selectedGoal.description);
    } else {
      resetForm();
    }
  }, [resetForm, selectedGoal, setFieldValue]);

  return (
    <Modal show={showModal} onHide={hideModal} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Insira uma anamnese</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3 top-label">
            <Form.Control type="text" name="name" value={values.name} onChange={handleChange} />
            <Form.Label>NOME DA META</Form.Label>
            {errors.name && touched.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="mb-3 top-label">
            <Form.Control name="description" as="textarea" rows={3} value={values.description} onChange={handleChange} />
            <Form.Label>OBSERVAÇÃO</Form.Label>
            {errors.description && touched.description && <div className="error">{errors.description}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton isSaving={isSaving} type="submit" className="mb-1 btn btn-primary">
            Salvar meta
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default GoalModal;
