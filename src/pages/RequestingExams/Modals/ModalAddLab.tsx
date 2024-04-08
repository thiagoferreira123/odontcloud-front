import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useLabPartnersStore } from '../hooks/LabPartnersStore';
import AsyncButton from '/src/components/AsyncButton';
import { notify } from '/src/components/toast/NotificationIcon';

interface Values {
  nome: string;
  email: string;
}

const ModalAddLab = () => {
  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Insira um nome válido'),
    email: Yup.string().required('Insira um email válido').email('Insira um email válido'),
  });

  const queryClient = useQueryClient();

  const showModal = useLabPartnersStore((state) => state.showModal);
  const selectedPartner = useLabPartnersStore((state) => state.selectedPartner);

  const initialValues: Values = { nome: '', email: '' };
  const [isSaving, setIsSaving] = useState(false);

  const { handleCloseModal, updatePartner } = useLabPartnersStore();
  const { addPartner } = useLabPartnersStore();

  const onSubmit = async (values: Values) => {
    try {
      setIsSaving(true);

      if(selectedPartner) {
        const response = await updatePartner({...selectedPartner, ...values}, queryClient);

        if (response === false) throw new Error('Erro ao adicionar laboratório');
      } else {
        const response = await addPartner(values, queryClient);

        if (response === false) throw new Error('Erro ao adicionar laboratório');
      }


      notify('Laboratório adicionado com sucesso', 'Sucesso', 'check', 'success');

      setIsSaving(false);
      handleCloseModal();
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      notify('Erro ao adicionar laboratório', 'Erro', 'close', 'danger');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setValues, resetForm, values, touched, errors } = formik;

  useEffect(() => {
    if(selectedPartner) {
      setValues({
        nome: selectedPartner.nome,
        email: selectedPartner.email,
      });
    } else {
      resetForm();
    }

  }, [resetForm, selectedPartner, setValues]);

  return (
    <Modal className="modal-close-out" show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastre um laboratório parceiro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="mb-3 filled">
            <CsLineIcons icon="vaccine" />
            <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Nome do laboratório" />
            {errors.nome && touched.nome && <div className="error">{errors.nome}</div>}
          </div>
          <div className="mb-3 filled">
            <CsLineIcons icon="email" />
            <Form.Control type="text" name="email" value={values.email} onChange={handleChange} placeholder="Email do laboratório" />
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

export default ModalAddLab;
