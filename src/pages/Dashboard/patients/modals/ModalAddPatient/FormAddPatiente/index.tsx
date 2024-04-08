import React, { useEffect, useImperativeHandle } from 'react';
import { Form, Nav, Tab } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RequiredData from './RequiredData.tsx';
import OptionalValues from './OptionalValues.tsx';
import Avatar from './Avatar.tsx';
import usePatients from '../../../../../../hooks/usePatients.ts';
import { Patient } from '../../../../../../types/Patient.ts';
import { useQueryClient } from '@tanstack/react-query';
import { useModalAddPatientStore } from '../../../hooks/ModalAddPatientStore.ts';
import { convertIsoToBrDate, parseBrDateToIso } from '../../../../../../helpers/DateHelper.ts';

export interface FormikValues {
  email: string;
  name: string;
  consultationLocation: string;
  reasonForConsultation: string;
  gender: string;
  dateOfBirth: string;
  cep: string;
  phone: string;

  cpf: string;
  state: string;
  neighborhood: string;
  street: string;
  houseNumber: string;
  observation: string;
  photoLink: string;
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
  const selectedPatient = useModalAddPatientStore((state) => state.selectedPatient);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Digite um e-mail valido. Se o paciente não possui, insira algo como: nome@dietsystem.com'),
    name: Yup.string().required('Digite um nome valido.'),
    dateOfBirth: Yup.string().typeError('A data deve estar no formato ##/##/####').nullable().required('Digite uma data de nascimento valida.'),
    gender: Yup.string().required('Selecione um sexo valido'),
    reasonForConsultation: Yup.string().required('Selecione um motivo de consulta valido'),
  });

  const initialValues: FormikValues = {
    email: '',
    name: '',
    consultationLocation: '',
    reasonForConsultation: '',
    gender: '',
    dateOfBirth: '',
    cep: '',
    cpf: '',
    state: '',
    phone: '',
    neighborhood: '',
    street: '',
    houseNumber: '',
    observation: '',
    photoLink: '',
  };
  const onSubmit = async (values: FormikValues) => {
    try {
      props.setIsSaving(true);

      const payload: Partial<Patient> = {
        ...values,
        gender: Number(values.gender),
        consultationLocation: Number(values.consultationLocation),
        dateOfBirth: parseBrDateToIso(values.dateOfBirth),
        dateOfFirstConsultation: new Date(),
        dateOfLastConsultation: new Date(),
        patientActiveOrInactive: 1,
        ddiCountry: '',
        ddiCountryNumber: '',
        city: '',
        appPlansOnOrOff: 1,
        appAnthropometryOnOrOff: 1,
        appGoalsOnOrOff: 1,
        appRecipesOnOrOff: 1,
        appSuplementationOnOrOff: 1,
        appDialyOnOrOff: 1,
        inactivateAppDate: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate()).toISOString(),
        deviceToken: null,
      };

      if (selectedPatient && selectedPatient.id) {
        payload.id = selectedPatient.id;

        const response = await updatePatient(payload as Partial<Patient> & { id: number }, queryClient);

        if(!response) throw new Error('Erro ao atualizar paciente');
      } else {
        const response = await addPatient(payload, queryClient);

        if(!response) throw new Error('Erro ao cadastrar paciente');
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
  const { addPatient, updatePatient } = usePatients();

  useEffect(() => {
    if (!selectedPatient) return resetForm();

    const payload: FormikValues = {
      email: selectedPatient.email,
      name: selectedPatient.name,

      consultationLocation: String(selectedPatient.consultationLocation),
      reasonForConsultation: selectedPatient.reasonForConsultation,
      gender: String(selectedPatient.gender),
      phone: selectedPatient.phone ?? '',

      dateOfBirth: convertIsoToBrDate(selectedPatient.dateOfBirth),
      cep: String(selectedPatient.cep),
      cpf: String(selectedPatient.cpf),
      state: String(selectedPatient.state),
      neighborhood: String(selectedPatient.neighborhood),
      street: String(selectedPatient.street),
      houseNumber: String(selectedPatient.houseNumber),
      observation: String(selectedPatient.observation),
      photoLink: selectedPatient.photoLink
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
