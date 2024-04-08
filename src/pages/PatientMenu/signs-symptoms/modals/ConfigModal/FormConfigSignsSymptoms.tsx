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
import useSignsSymptomsStore from '../../hooks/SignsSymptomsStore';
import { SignsSymptoms } from '../../hooks/SignsSymptomsStore/types';

interface FormValues {
  data: Date;
}

const FormConfigSignsSymptoms = (
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const { id } = useParams();

  const queryClient = useQueryClient();
  const history = useNavigate();

  const selectedSignsSymptoms = useConfigModalStore((state) => state.selectedSignsSymptoms);

  const validationSchema = Yup.object().shape({
    data: Yup.date().required('A data de registro é obrigatória'),
  });

  const initialValues: FormValues = {
    data: new Date(),
  };

  const { hideConfigModal } = useConfigModalStore();
  const { updateSignsSymptom, addSignsSymptom } = useSignsSymptomsStore();

  const onSubmit = async (values: FormValues) => {
    props.setIsLoading(true);

    try {
      if (!id) throw new Error('patient_id (id) is not defined');

      const payload: Partial<SignsSymptoms> = {
        data: values.data.toISOString(),
      };

      if (selectedSignsSymptoms?.id) {
        const result = await updateSignsSymptom({ ...selectedSignsSymptoms, ...payload }, queryClient);

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addSignsSymptom({ ...payload, patient_id: +id }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        history('/app/sinais-sintomas/' + result);
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
  const { handleSubmit, resetForm, setValues, setFieldValue, values, touched, errors } = formik;

  useEffect(() => {
    if (!selectedSignsSymptoms) return resetForm();

    setValues({ data: new Date(selectedSignsSymptoms.data) });
  }, [resetForm, selectedSignsSymptoms, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled mt-2">
        <label>Data de cadastro</label>
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Datepicker name="data" value={values.data} setFieldValue={setFieldValue} />
          {errors.data && touched.data && <div className="error">{errors.data as string}</div>}
        </div>
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigSignsSymptoms);
