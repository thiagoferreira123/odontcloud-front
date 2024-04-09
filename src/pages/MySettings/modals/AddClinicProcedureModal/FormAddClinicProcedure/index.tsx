import React, { useEffect, useImperativeHandle } from 'react';
import { Form, Nav, Tab } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RequiredData from './RequiredData.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { ClinicProcedure } from '../../../hooks/ClinicProcedureStore/types.ts';
import useClinicProcedureStore from '../../../hooks/ClinicProcedureStore/index.ts';
import { useCreateAndProcedureEditModalStore } from '../../../hooks/CreateAndProcedureEditModalStore.tsx';

export interface FormAddClinicProcedureFormValues {
  clinic_procedure_description: string;
  clinic_procedure_value: string;
}

interface FormAddClinicProcedureProps {
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  hideModal: () => void;
}

const FormAddClinicProcedure = (props: FormAddClinicProcedureProps, ref: React.Ref<unknown> | undefined) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const queryClient = useQueryClient();
  const selectedClinicProcedure = useCreateAndProcedureEditModalStore((clinic_procedure_state) => clinic_procedure_state.selectedClinicProcedure);

  const validationSchema = Yup.object().shape({
    clinic_procedure_description: Yup.string().required('Descrição é obrigatória'),
    clinic_procedure_value: Yup.string().required('Valor é obrigatório'),
  });

  const initialValues: FormAddClinicProcedureFormValues = {
    clinic_procedure_description: '',
    clinic_procedure_value: '',
  };

  const onSubmit = async (values: FormAddClinicProcedureFormValues) => {
    try {
      props.setIsSaving(true);

      if (selectedClinicProcedure && selectedClinicProcedure.clinic_procedure_id) {
        const response = await updateClinicProcedure(
          { ...values, clinic_procedure_id: selectedClinicProcedure.clinic_procedure_id } as ClinicProcedure & { clinic_procedure_id: number },
          queryClient
        );

        if (!response) throw new Error('Erro ao atualizar profissional');
      } else {
        const response = await addClinicProcedure(values, queryClient);

        if (!response) throw new Error('Erro ao cadastrar profissional');
      }
      props.setIsSaving(false);
      props.hideModal();
    } catch (error) {
      console.error('Erro:', error);
      props.setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, resetForm, setValues } = formik;
  const { addClinicProcedure, updateClinicProcedure } = useClinicProcedureStore();

  useEffect(() => {
    if (!selectedClinicProcedure) return resetForm();

    const payload: FormAddClinicProcedureFormValues = {
      clinic_procedure_description: selectedClinicProcedure.clinic_procedure_description,
      clinic_procedure_value: selectedClinicProcedure.clinic_procedure_value,
    };

    setValues(payload);
  }, [resetForm, selectedClinicProcedure, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <Tab.Container defaultActiveKey="First">
        <Nav variant="tabs" className="nav-tabs-title nav-tabs-line-title mb-3" activeKey="First">
          <Nav.Item>
            <Nav.Link eventKey="First">Dados obrigatórios</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="First">
            <RequiredData formik={formik} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Form>
  );
};

export default React.forwardRef(FormAddClinicProcedure);
