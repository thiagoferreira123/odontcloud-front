import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Form as BootstrapForm, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSendFormToEmailModalStore } from '../Hooks/modals/SendFormToEmailModalStore';

type FormValues = {
  email: string;
  obs: string;
};

const SendFormToEmailModal = () => {

  const showModal = useSendFormToEmailModalStore((state) => state.showModal);
  const selectedFormKey = useSendFormToEmailModalStore((state) => state.selectedFormKey);

  const { hideModal } = useSendFormToEmailModalStore();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Insira um email válido').required('Insira um e-mail'),
    obs: Yup.string().required('Observações é obrigatório'),
  });
  const initialValues = {
    email: '',
    obs: `Antes da sua primeira consulta, queremos garantir que estamos bem preparados para oferecer o melhor atendimento. Por favor, clique no link abaixo para preencher um breve formulário de pré-consulta. Isso nos ajudará a tornar a sua experiência o mais suave e personalizada possível. Estamos ansiosos para cuidar de você!

Preencha o formulário através do link: ${window.location.origin}/formulario-pre-consulta-preencher/${selectedFormKey}
  `,
  };
  const onSubmit = (values: FormValues) => {
    //TODO: Verificar serviço de envio de email
    console.log('submit form', values);
  };

  const formik = useFormik({ initialValues, validationSchema, enableReinitialize: true, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Enviar formulário por e-mail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BootstrapForm onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="mb-3 filled">
            <CsLineIcons icon="user" />
            <BootstrapForm.Control type="text" name="email" value={values.email} onChange={handleChange} placeholder="Email" />
            {errors.email && touched.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="mb-3 filled">
            <CsLineIcons icon="notebook-1" />
            <BootstrapForm.Control name="obs" as="textarea" rows={8} value={values.obs} onChange={handleChange} placeholder="Digite uma observação" />
            {errors.obs && touched.obs && <div className="error">{errors.obs}</div>}
          </div>
          <div className="text-center">
            <Button type="submit" size="lg" variant="primary" className="mt-2 hover-scale-down">
              Enviar
            </Button>
          </div>
        </BootstrapForm>
      </Modal.Body>
    </Modal>
  );
};

export default SendFormToEmailModal;
