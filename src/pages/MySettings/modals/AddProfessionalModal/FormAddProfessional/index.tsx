import React, { useEffect, useImperativeHandle } from 'react';
import { Form, Nav, Tab } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RequiredData from './RequiredData.tsx';
import OptionalValues from './OptionalValues.tsx';
import Avatar from './Avatar.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateAndEditModalStore } from '../../../hooks/CreateAndEditModalStore.tsx';
import { Professional } from '../../../hooks/ProfessionalStore/types.ts';
import useProfessionalStore from '../../../hooks/ProfessionalStore/index.ts';

export interface FormAddProfessionalFormValues {
  professional_email: string;
  professional_full_name: string;
  professional_specialty: string;
  professional_phone: string;
  professional_cro_state: string;
  professional_cro_number: string;
  professional_photo_link?: string;
}

interface FormAddProfessionalProps {
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
  hideModal: () => void;
}

const FormAddProfessional = (props: FormAddProfessionalProps, ref: React.Ref<unknown> | undefined) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const queryClient = useQueryClient();
  const selectedProfessional = useCreateAndEditModalStore((professional_state) => professional_state.selectedProfessional);

  const validationSchema = Yup.object().shape({
    professional_full_name: Yup.string().required('Digite um nome valido.'),
    professional_cro_state: Yup.string().required('Digite um estado valido.'),
    professional_cro_number: Yup.string().required('Digite um número de CRO valido.'),
    professional_specialty: Yup.string().required('Digite uma especialidade valida.'),
    professional_email: Yup.string(),
    professional_phone: Yup.string(),
  });

  const initialValues: FormAddProfessionalFormValues = {
    professional_full_name: '',
    professional_cro_state: '',
    professional_specialty: '',
    professional_cro_number: '',
    professional_email: '',
    professional_phone: '',
    professional_photo_link: '',
  };

  const onSubmit = async (values: FormAddProfessionalFormValues) => {
    try {
      props.setIsSaving(true);

      if (selectedProfessional && selectedProfessional.professional_id) {
        const response = await updateProfessional(
          { ...values, professional_id: selectedProfessional.professional_id } as Professional & { professional_id: number },
          queryClient
        );

        if (!response) throw new Error('Erro ao atualizar profissional');
      } else {
        const response = await addProfessional(values, queryClient);

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
  const { addProfessional, updateProfessional } = useProfessionalStore();

  useEffect(() => {
    if (!selectedProfessional) return resetForm();

    const payload: FormAddProfessionalFormValues = {
      professional_email: selectedProfessional.professional_email,
      professional_full_name: selectedProfessional.professional_full_name,
      professional_specialty: selectedProfessional.professional_specialty,
      professional_phone: selectedProfessional.professional_phone,
      professional_cro_state: selectedProfessional.professional_cro_state,
      professional_cro_number: selectedProfessional.professional_cro_number,
      professional_photo_link: selectedProfessional.professional_photo_link,
    };

    setValues(payload);
  }, [resetForm, selectedProfessional, setValues]);

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
            <Nav.Link eventKey="Three">Foto do profissional</Nav.Link>
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

export default React.forwardRef(FormAddProfessional);
