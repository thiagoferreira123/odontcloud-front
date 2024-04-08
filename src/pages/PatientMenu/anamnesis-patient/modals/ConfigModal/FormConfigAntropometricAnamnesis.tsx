import React, { useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import Datepicker from './Datepicker';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';
import useAnamnesisStore from '../../hooks/AnamnesisStore';
import { Anamnesis } from '../../hooks/AnamnesisStore/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEditModalStore } from '../../../../Anamnesis/hooks/EditModalStore';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';

interface FormValues {
  date: Date;
  identification: string;
}

const FormConfigAntropometricAnamnesis = (
  // eslint-disable-next-line no-unused-vars
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const { id } = useParams();

  const queryClient = useQueryClient();

  const selectedAnamnesis = useConfigModalStore((state) => state.selectedAnamnesis);

  const validationSchema = Yup.object().shape({
    date: Yup.date().required('A data de registro é obrigatória'),
    identification: Yup.string().required('A identificação é obrigatória'),
  });

  const initialValues: FormValues = {
    date: new Date(),
    identification: '',
  };

  const { hideConfigModal } = useConfigModalStore();
  const { updateAnamnesis, addAnamnesis } = useAnamnesisStore();
  const { handleSelectAnamnesisToEdit } = useEditModalStore();

  const onSubmit = async (values: FormValues) => {
    props.setIsLoading(true);

    try {
      if (!id) throw new Error('patient_id (id) is not defined');

      const payload: Partial<Anamnesis> = {
        date: values.date.toISOString(),
        identification: values.identification,
      };

      if (selectedAnamnesis?.id) {
        const result = await updateAnamnesis({ ...selectedAnamnesis, ...payload }, queryClient);

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addAnamnesis({ ...payload, patient_id: +id }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        handleSelectAnamnesisToEdit(result);
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
    if (!selectedAnamnesis) return resetForm();

    setValues({ date: new Date(selectedAnamnesis.date), identification: selectedAnamnesis.identification });
  }, [resetForm, selectedAnamnesis, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled mt-2">
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Form.Control type="text" name="identification" value={values.identification} onChange={handleChange} placeholder="Nome da anamnese" />
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

export default React.forwardRef(FormConfigAntropometricAnamnesis);
