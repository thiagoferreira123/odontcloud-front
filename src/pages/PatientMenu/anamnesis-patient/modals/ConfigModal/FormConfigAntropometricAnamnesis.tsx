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
  anamnesis_date_creation: Date;
  anamnesis_identification: string;
}

const FormConfigAntropometricAnamnesis = (
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
    anamnesis_date_creation: Yup.date().required('A data de registro é obrigatória'),
    anamnesis_identification: Yup.string().required('A identificação é obrigatória'),
  });

  const initialValues: FormValues = {
    anamnesis_date_creation: new Date(),
    anamnesis_identification: '',
  };

  const { hideConfigModal } = useConfigModalStore();
  const { updateAnamnesis, addAnamnesis } = useAnamnesisStore();
  const { handleSelectAnamnesisToEdit } = useEditModalStore();

  const onSubmit = async (values: FormValues) => {
    props.setIsLoading(true);

    try {
      if (!id) throw new Error('patient_id (id) is not defined');

      const payload: Partial<Anamnesis> = {
        anamnesis_date_creation: values.anamnesis_date_creation.toISOString(),
        anamnesis_identification: values.anamnesis_identification,
      };

      if (selectedAnamnesis?.anamnesis_id) {
        const result = await updateAnamnesis({ ...selectedAnamnesis, ...payload }, queryClient);

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addAnamnesis({ ...payload, anamnesis_patient_id: id }, queryClient);

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

    setValues({ anamnesis_date_creation: new Date(selectedAnamnesis.anamnesis_date_creation), anamnesis_identification: selectedAnamnesis.anamnesis_identification });
  }, [resetForm, selectedAnamnesis, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled mt-2">
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Form.Control type="text" name="anamnesis_identification" value={values.anamnesis_identification} onChange={handleChange} placeholder="Nome da anamnese" />
          {errors.anamnesis_identification && touched.anamnesis_identification && <div className="error">{errors.anamnesis_identification as string}</div>}
        </div>
        <label>Data de cadastro</label>
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Datepicker name="anamnesis_date_creation" value={values.anamnesis_date_creation} setFieldValue={setFieldValue} />
          {errors.anamnesis_date_creation && touched.anamnesis_date_creation && <div className="error">{errors.anamnesis_date_creation as string}</div>}
        </div>
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfigAntropometricAnamnesis);
