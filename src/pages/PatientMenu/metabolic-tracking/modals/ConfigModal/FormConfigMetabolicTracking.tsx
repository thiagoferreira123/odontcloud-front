import React, { useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import Datepicker from './Datepicker';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';
import useMetabolicTrackingStore from '../../hooks/MetabolicTracking';
import { MetabolicTracking } from '../../hooks/MetabolicTracking/types';
import { useQueryClient } from '@tanstack/react-query';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';

interface FormValues {
  data: Date;
}

const FormConfigMetabolicTracking = (
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const selectedMetabolicTracking = useConfigModalStore((state) => state.selectedMetabolicTracking);

  const validationSchema = Yup.object().shape({
    data: Yup.date().required('A data de registro é obrigatória'),
  });

  const initialValues: FormValues = {
    data: new Date(),
  };

  const { hideConfigModal } = useConfigModalStore();
  const { updateMetabolicTracking, addMetabolicTracking } = useMetabolicTrackingStore();

  const onSubmit = async (values: FormValues) => {
    props.setIsLoading(true);

    try {
      if (!id) throw new Error('patient_id (id) is not defined');

      const payload: Partial<MetabolicTracking> = {
        data: values.data,
        punctuation: undefined,
      };

      if (selectedMetabolicTracking?.id) {
        const result = await updateMetabolicTracking({ ...selectedMetabolicTracking, ...payload }, queryClient);

        if (result === false) throw new Error('Error updating metabolic tracking');
      } else {

        const aditionalPayload: Partial<MetabolicTracking> = {
          patient_id: +id,
          data: new Date(),
          punctuation: 0,
          description: '',
        };

        const result = await addMetabolicTracking({ ...payload, ...aditionalPayload }, queryClient);

        if (!result) throw new Error('Error adding metabolic tracking');

        navigate('/app/rastreamento-metabolico/' + result.id);
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
    if (!selectedMetabolicTracking) return resetForm();

    setValues({ data: new Date(selectedMetabolicTracking.data) });
  }, [resetForm, selectedMetabolicTracking, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled mt-2">
        {/* <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Form.Control type="text" name="identification" value={values.identification} onChange={handleChange} placeholder="Nome da anamnese" />
          {errors.identification && touched.identification && <div className="error">{errors.identification as string}</div>}
        </div> */}
        <label>Data de cadastro</label>
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Datepicker name="date" value={values.data} setFieldValue={setFieldValue} />
          {errors.data && touched.data && <div className="error">{errors.data as string}</div>}
        </div>
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigMetabolicTracking);
