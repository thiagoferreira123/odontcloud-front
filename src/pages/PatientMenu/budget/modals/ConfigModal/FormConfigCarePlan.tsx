import React, { useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import Datepicker from './Datepicker';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';
import { useQueryClient } from '@tanstack/react-query';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import { appRoot } from '../../../../../routes';
import useCarePlanBudgetStore from '../../hooks/CarePlanBudgetStore';
import { CarePlanBudget } from '../../hooks/CarePlanBudgetStore/types';

interface FormValues {
  date: Date;
  name: string;
}

const FormConfigCarePlanBudget = (
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const { id } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const selectedCarePlanBudget = useConfigModalStore((state) => state.selectedCarePlanBudget);

  const validationSchema = Yup.object().shape({
    date: Yup.date().required('A data de registro é obrigatória'),
    name: Yup.string().required('A identificação é obrigatória'),
  });

  const initialValues: FormValues = {
    date: new Date(),
    name: '',
  };

  const { hideConfigModal } = useConfigModalStore();
  const { updateCarePlanBudget, addCarePlanBudget } = useCarePlanBudgetStore();

  const onSubmit = async (values: FormValues) => {
    props.setIsLoading(true);

    try {
      if (!id) throw new Error('budget_care_plan_patient_id (id) is not defined');

      const payload: Partial<CarePlanBudget> = {
        budget_date_creation: values.date.toISOString(),
        budget_name: values.name,
      };

      if (selectedCarePlanBudget?.budget_id) {
        const result = await updateCarePlanBudget({ ...selectedCarePlanBudget, ...payload }, queryClient);

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addCarePlanBudget({ ...payload, budget_care_plan_patient_id: id }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        navigate(`${appRoot}/orcamento/${result.budget_id}`);
      }

      hideConfigModal();
      resetForm();

      props.setIsLoading(false);
      props.handleCloseModal();
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, resetForm, setValues, setFieldValue, handleChange, values, touched, errors } = formik;

  useEffect(() => {
    if (!selectedCarePlanBudget) return resetForm();

    setValues({ date: new Date(selectedCarePlanBudget.budget_date_creation), name: selectedCarePlanBudget.budget_name });
  }, [resetForm, selectedCarePlanBudget, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled mt-2">
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Nome do orçamento" />
          {errors.name && touched.name && <div className="error">{errors.name as string}</div>}
        </div>
        <label>Data de cadastro</label>
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Datepicker name="date" value={values.date} setFieldValue={setFieldValue} />
          {errors.date && touched.date && <div className="error">{errors.date as string}</div>}
        </div>
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigCarePlanBudget);
