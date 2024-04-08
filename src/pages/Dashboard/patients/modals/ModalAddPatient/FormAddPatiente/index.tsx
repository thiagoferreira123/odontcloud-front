import React, { useEffect, useImperativeHandle } from 'react';
import { Form, Nav, Tab } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RequiredData from './RequiredData.tsx';
import OptionalValues from './OptionalValues.tsx';
import Avatar from './Avatar.tsx';
import usePatientStore from '../../../hooks/PatientStore.ts';
import { Patient } from '../../../../../../types/Patient.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useModalAddPatientStore } from '../../../hooks/ModalAddPatientStore.ts';
import { parseBrDateToIso, parseDateToIso } from '../../../../../../helpers/DateHelper.ts';

export interface FormikValues {
  patient_last_interaction: string;
  patient_full_name: string;
  patient_photo?: string;
  patient_birth_date: string;
  patient_cpf: string;
  patient_rg?: string;
  patient_rg_issuer?: string;
  patient_sex: number;
  patient_marital_status: string;
  patient_health_insurance?: string;
  patient_health_insurance_number?: string;
  patient_medical_record_number?: string;
  patient_reference?: string;
  patient_phone?: string;
  patient_email?: string;
  patient_extra_contact_full_name?: string;
  patient_extra_contact_cpf?: string;
  patient_extra_contact_phone?: string;
  patient_extra_contact_relationship: string;
  patient_zip_code?: string;
  patient_number?: string;
  patient_street?: string;
  patient_complement?: string;
  patient_neighborhood?: string;
  patient_city?: string;
  patient_state?: string;
  patient_observation?: string;
}

interface FormAddPatienteProps {
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseModal: () => void;
}

const FormAddPatiente = (props: FormAddPatienteProps, ref: React.Ref<unknown> | undefined) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const queryClient = useQueryClient();
  const selectedPatient = useModalAddPatientStore((patient_state) => patient_state.selectedPatient);

  const validationSchema = Yup.object().shape({
    patient_email: Yup.string(),
    patient_full_name: Yup.string().required('Digite um nome valido.'),
    patient_birth_date: Yup.string().typeError('A data deve estar no formato ##/##/####').nullable().required('Digite uma data de nascimento valida.'),
    patient_sex: Yup.string().required('Selecione um sexo valido'),
  });

  const initialValues: FormikValues = {
    patient_last_interaction: '',
    patient_full_name: '',
    patient_photo: '',
    patient_birth_date: '',
    patient_cpf: '',
    patient_rg: '',
    patient_rg_issuer: '',
    patient_sex: 0,
    patient_marital_status: '',
    patient_health_insurance: '',
    patient_health_insurance_number: '',
    patient_medical_record_number: '',
    patient_reference: '',
    patient_phone: '',
    patient_email: '',
    patient_extra_contact_full_name: '',
    patient_extra_contact_cpf: '',
    patient_extra_contact_phone: '',
    patient_extra_contact_relationship: '',
    patient_zip_code: '',
    patient_number: '',
    patient_street: '',
    patient_complement: '',
    patient_neighborhood: '',
    patient_city: '',
    patient_state: '',
  };
  const onSubmit = async (values: FormikValues) => {
    try {
      props.setIsSaving(true);

      const payload: Partial<Patient> = {
        ...values,
        patient_sex: Number(values.patient_sex),
        patient_birth_date: parseBrDateToIso(values.patient_birth_date),
        patient_register_date: parseDateToIso(new Date()),
        patient_last_interaction: parseDateToIso(new Date()),
      };

      if (selectedPatient && selectedPatient.patient_id) {
        payload.patient_id = selectedPatient.patient_id;

        const response = await updatePatient(payload as Partial<Patient> & { patient_id: number }, queryClient);

        if (!response) throw new Error('Erro ao atualizar paciente');
      } else {
        const response = await addPatient(payload, queryClient);

        if (!response) throw new Error('Erro ao cadastrar paciente');
      }
      props.setIsSaving(false);
      props.handleCloseModal();
    } catch (error) {
      console.error('Erro:', error);
      props.setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, resetForm, setValues } = formik;
  const { addPatient, updatePatient } = usePatientStore();

  useEffect(() => {
    if (!selectedPatient) return resetForm();

    const payload: FormikValues = {
      patient_last_interaction: selectedPatient.patient_last_interaction ?? '',
      patient_full_name: selectedPatient.patient_full_name ?? '',
      patient_photo: selectedPatient.patient_photo ?? '',
      patient_birth_date: selectedPatient.patient_birth_date ?? '',
      patient_cpf: selectedPatient.patient_cpf ?? '',
      patient_rg: selectedPatient.patient_rg ?? '',
      patient_rg_issuer: selectedPatient.patient_rg_issuer ?? '',
      patient_sex: selectedPatient.patient_sex ?? 0,
      patient_marital_status: selectedPatient.patient_marital_status ?? '',
      patient_health_insurance: selectedPatient.patient_health_insurance ?? '',
      patient_health_insurance_number: selectedPatient.patient_health_insurance_number ?? '',
      patient_medical_record_number: selectedPatient.patient_medical_record_number ?? '',
      patient_reference: selectedPatient.patient_reference ?? '',
      patient_phone: selectedPatient.patient_phone ?? '',
      patient_email: selectedPatient.patient_email ?? '',
      patient_extra_contact_full_name: selectedPatient.patient_extra_contact_full_name ?? '',
      patient_extra_contact_cpf: selectedPatient.patient_extra_contact_cpf ?? '',
      patient_extra_contact_phone: selectedPatient.patient_extra_contact_phone ?? '',
      patient_extra_contact_relationship: selectedPatient.patient_extra_contact_relationship ?? '',
      patient_zip_code: selectedPatient.patient_zip_code ?? '',
      patient_number: selectedPatient.patient_number ?? '',
      patient_street: selectedPatient.patient_street ?? '',
      patient_complement: selectedPatient.patient_complement ?? '',
      patient_neighborhood: selectedPatient.patient_neighborhood ?? '',
      patient_city: selectedPatient.patient_city ?? '',
      patient_state: selectedPatient.patient_state ?? '',
      patient_observation: selectedPatient.patient_observation ?? '',
    };

    setValues(payload);
  }, [resetForm, selectedPatient, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <Tab.Container defaultActiveKey="First">
        <Nav variant="tabs" className="nav-tabs-title nav-tabs-line-title mb-3" activeKey="First">
          <Nav.Item>
            <Nav.Link eventKey="First">Dados obrigatórios</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Second">Dados opcionais</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Three">Foto do paciente</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="First">
            <RequiredData formik={formik} />
          </Tab.Pane>

          <Tab.Pane eventKey="Second">
            <OptionalValues formik={formik} />
          </Tab.Pane>

          <Tab.Pane eventKey="Three">
            <Avatar formik={formik} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Form>
  );
};

export default React.forwardRef(FormAddPatiente);
