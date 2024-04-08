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
import useCarePlanStore from '../../hooks/CarePlanStore';
import { CarePlan } from '../../hooks/CarePlanStore/types';
import { appRoot } from '../../../../../routes';

interface FormValues {
  date: Date;
  identification: string;
}

const FormConfigCarePlan = (
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const { id } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const selectedCarePlan = useConfigModalStore((state) => state.selectedCarePlan);

  const validationSchema = Yup.object().shape({
    date: Yup.date().required('A data de registro é obrigatória'),
    identification: Yup.string().required('A identificação é obrigatória'),
  });

  const initialValues: FormValues = {
    date: new Date(),
    identification: '',
  };

  const { hideConfigModal } = useConfigModalStore();
  const { updateCarePlan, addCarePlan } = useCarePlanStore();

  const onSubmit = async (values: FormValues) => {
    props.setIsLoading(true);

    try {
      if (!id) throw new Error('patient_id (id) is not defined');

      const payload: Partial<CarePlan> = {
        care_plan_date_creation: values.date.toISOString(),
        care_plan_identification: values.identification,
      };

      if (selectedCarePlan?.care_plan_id) {
        const result = await updateCarePlan({ ...selectedCarePlan, ...payload }, queryClient);

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addCarePlan({ ...payload, care_plan_patient_id: id }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        navigate(`${appRoot}/plano-de-tratamento/${result.care_plan_id}`);
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
    if (!selectedCarePlan) return resetForm();

    setValues({ date: new Date(selectedCarePlan.care_plan_date_creation), identification: selectedCarePlan.care_plan_identification });
  }, [resetForm, selectedCarePlan, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled mt-2">
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Form.Control type="text" name="identification" value={values.identification} onChange={handleChange} placeholder="Nome do plano de tratamento" />
          {errors.identification && touched.identification && <div className="error">{errors.identification as string}</div>}
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

export default React.forwardRef(FormConfigCarePlan);
