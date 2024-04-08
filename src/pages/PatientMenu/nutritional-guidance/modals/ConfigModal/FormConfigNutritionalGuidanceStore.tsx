import React, { useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useParams } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import Datepicker from './Datepicker';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';
import useNutritionalGuidanceStoreStore from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useNutritionalGuidanceModalStore } from '../../../../NutritionalGuidance/hooks';
import { NutritionalGuidanceSelectedPatient } from '../../hooks/types';

interface FormValues {
  date: Date;
  identification: string;
}

const FormConfigNutritionalGuidanceStore = (
  // eslint-disable-next-line no-unused-vars
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const { id } = useParams();

  const queryClient = useQueryClient();

  const selectedNutritionalGuidanceSelectedPatient = useConfigModalStore((state) => state.selectedNutritionalGuidanceSelectedPatient);

  const validationSchema = Yup.object().shape({
    date: Yup.date().required('A data de registro é obrigatória'),
    identification: Yup.string().required('A identificação é obrigatória'),
  });

  const initialValues: FormValues = {
    date: new Date(),
    identification: '',
  };

  const { hideConfigModal } = useConfigModalStore();
  const { updateNutritionalGuidanceSelectedPatient, addNutritionalGuidanceSelectedPatient } = useNutritionalGuidanceStoreStore();
  const { handleSelectNutritionalGuidanceToEdit } = useNutritionalGuidanceModalStore();

  const onSubmit = async (values: FormValues) => {
    props.setIsLoading(true);

    try {
      if (!id) throw new Error('patient_id (id) is not defined');

      const payload: Partial<NutritionalGuidanceSelectedPatient> = {
        date: values.date.toISOString(),
        identification: values.identification,
      };

      if (selectedNutritionalGuidanceSelectedPatient?.id) {
        const result = await updateNutritionalGuidanceSelectedPatient({ ...selectedNutritionalGuidanceSelectedPatient, ...payload }, queryClient);

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addNutritionalGuidanceSelectedPatient({ ...payload, patient_id: +id }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        handleSelectNutritionalGuidanceToEdit(result);
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
    if (!selectedNutritionalGuidanceSelectedPatient) return resetForm();

    setValues({ date: new Date(selectedNutritionalGuidanceSelectedPatient.date), identification: selectedNutritionalGuidanceSelectedPatient.identification });
  }, [resetForm, selectedNutritionalGuidanceSelectedPatient, setValues]);

  return (
    <Form as={'form'} onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />
        <Form.Control type="text" name="identification" value={values.identification} onChange={handleChange} placeholder="Identificação da orientação" />
        {errors.identification && touched.identification && <div className="error">{errors.identification as string}</div>}
      </div>
      <label>Data de cadastro</label>
      <div className="mb-3 filled mt-2">
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Datepicker name="date" value={values.date} setFieldValue={setFieldValue} />
          {errors.date && touched.date && <div className="error">{errors.date as string}</div>}
        </div>
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigNutritionalGuidanceStore);
