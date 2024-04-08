import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { usePharmacyPartnersStore } from '../hooks/PharmacyPartnersStore';
import AsyncButton from '/src/components/AsyncButton';
import { notify } from '/src/components/toast/NotificationIcon';

interface Values {
  name: string;
  email: string;
}

const ModalAddPharmacy = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Insira um nome válido'),
    email: Yup.string().required('Insira um email válido').email('Insira um email válido'),
  });

  const queryClient = useQueryClient();

  const showModal = usePharmacyPartnersStore((state) => state.showModal);
  const selectedPartner = usePharmacyPartnersStore((state) => state.selectedPartner);

  const initialValues: Values = { name: '', email: '' };
  const [isSaving, setIsSaving] = useState(false);

  const { handleCloseModal, updatePartner } = usePharmacyPartnersStore();
  const { addPartner } = usePharmacyPartnersStore();

  const onSubmit = async (values: Values) => {
    try {
      setIsSaving(true);

      if(selectedPartner) {
        const response = await updatePartner({...selectedPartner, ...values}, queryClient);

        if (response === false) throw new Error('Erro ao adicionar farmácia');
      } else {
        const response = await addPartner(values, queryClient);

        if (response === false) throw new Error('Erro ao adicionar farmácia');
      }      

      setIsSaving(false);
      handleCloseModal();
      resetForm();
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      notify('Erro ao adicionar farmácia', 'Erro', 'close', 'danger');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setValues, resetForm, values, touched, errors } = formik;

  useEffect(() => {
    if(selectedPartner) {
      setValues({
        name: selectedPartner.name,
        email: selectedPartner.email,
      });
    } else {
      resetForm();
    }

  }, [resetForm, selectedPartner, setValues]);

  return (
    <Modal className="modal-close-out" show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastre uma farmácia parceira</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="mb-3 filled">
            <CsLineIcons icon="vaccine" />
            <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Nome do farmácia" />
            {errors.name && touched.name && <div className="error">{errors.name}</div>}
          </div>
          <div className="mb-3 filled">
            <CsLineIcons icon="email" />
            <Form.Control type="text" name="email" value={values.email} onChange={handleChange} placeholder="Email do farmácia" />
            {errors.email && touched.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="text-center">
            <AsyncButton isSaving={isSaving} variant="primary" size="lg" className="mt-2 hover-scale-down" type="submit">
              Salvar seleção
            </AsyncButton>{' '}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddPharmacy;
