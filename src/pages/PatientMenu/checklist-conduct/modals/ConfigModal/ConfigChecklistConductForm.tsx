import React, { useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useParams } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import Datepicker from './Datepicker';
import { useQueryClient } from '@tanstack/react-query';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';
import useChecklistConductsStore from '../../hooks/ChecklistConductsStore';
import { useChecklistConductModalStore } from '../../hooks/ChecklistConductModalStore';
import { ChecklistConduct } from '../../hooks/ChecklistConductsStore/types';

interface FormValues {
  creation_data: Date;
  identification: string;
}

const ConfigChecklistConductForm = (
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const { id } = useParams();

  const queryClient = useQueryClient();

  const selectedChecklistConduct = useConfigModalStore((state) => state.selectedChecklistConduct);

  const validationSchema = Yup.object().shape({
    creation_data: Yup.date().required('A data de registro é obrigatória'),
    identification: Yup.string().required('A identificação é obrigatória'),
  });

  const initialValues: FormValues = {
    creation_data: new Date(),
    identification: '',
  };

  const { hideConfigModal } = useConfigModalStore();
  const { updateChecklistConduct, addChecklistConduct } = useChecklistConductsStore();
  const { handleSelectChecklistConductToEdit } = useChecklistConductModalStore();

  const onSubmit = async (values: FormValues) => {
    props.setIsLoading(true);

    try {
      if (!id) throw new Error('patient_id (id) is not defined');

      const payload: Partial<ChecklistConduct> = {
        creation_data: values.creation_data,
        identification: values.identification,
      };

      if (selectedChecklistConduct?.id) {
        const result = await updateChecklistConduct({ ...selectedChecklistConduct, ...payload }, queryClient);

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addChecklistConduct({ ...payload, patient_id: +id, items: [] }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        handleSelectChecklistConductToEdit(result);
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
    if (!selectedChecklistConduct) return resetForm();

    setValues({ creation_data: new Date(selectedChecklistConduct.creation_data), identification: selectedChecklistConduct.identification });
  }, [resetForm, selectedChecklistConduct, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled mt-2">
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Form.Control type="text" name="identification" value={values.identification} onChange={handleChange} placeholder="Nome da checklist" />
          {errors.identification && touched.identification && <div className="error">{errors.identification as string}</div>}
        </div>
        <label>Data de cadastro</label>
        <div className="mb-3 filled mt-2">
          <CsLineIcons icon="cupcake" />
          <Datepicker name="creation_data" value={values.creation_data} setFieldValue={setFieldValue} />
          {errors.creation_data && touched.creation_data && <div className="error">{errors.creation_data as string}</div>}
        </div>
      </div>
    </Form>
  );
};

export default React.forwardRef(ConfigChecklistConductForm);
