import { useFormik } from 'formik';
import { Button, Form as BootstrapForm, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { useSendTrackingToWhatsAppModalStore } from '../hooks/SendTrackingToWhatsAppModalStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { encodeURL } from '../../../helpers/StringHelpers';


type FormValues = {
  whatsapp: string;
  obs: string;
};

const SendTrackingToWhatsAppModal = () => {
  const showModal = useSendTrackingToWhatsAppModalStore((state) => state.showModal);
  const selectedTrackingKey = useSendTrackingToWhatsAppModalStore((state) => state.selectedTrackingKey);

  const { hideModal } = useSendTrackingToWhatsAppModalStore();

  const initialValues = {
    whatsapp: '',
    obs: `
Antes da sua primeira consulta, queremos garantir que estamos bem preparados para oferecer o melhor atendimento. Por favor, clique no link abaixo para preencher um breve rastreamento metabólico. Isso nos ajudará a tornar a sua experiência o mais suave e personalizada possível. Estamos ansiosos para cuidar de você!
Preencha o formulário através do link: ${location.origin}/rastreamento-metabolico/${selectedTrackingKey}
`,
  };
  const validationSchema = Yup.object().shape({
    whatsapp: Yup.string().matches(/^\d+$/, 'Digite apenas números no telefone').required('Whastapp é obrigatório'),
    obs: Yup.string().required('Observações é obrigatório'),
  });
  const onSubmit = (values: FormValues) => {
    const { obs, whatsapp } = values;
    window.open(`https://api.whatsapp.com/send?phone=${whatsapp}&text=${encodeURL(obs)}`);
  };

  const { values, errors, touched, handleSubmit, handleChange } = useFormik({ initialValues, validationSchema, enableReinitialize: true, onSubmit });

  return (
    <Modal className="modal-close-out" backdrop="static" size="lg" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Enviar rastreamento por WhatsApp</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BootstrapForm onSubmit={handleSubmit}>
          <div className="mb-3 filled">
            <CsLineIcons icon="phone" />
            <BootstrapForm.Control value={values.whatsapp} onChange={handleChange} type="text" name="whatsapp" placeholder="Whatsapp (DDI+DD)" />
            {errors.whatsapp && touched.whatsapp && <div className="error">{errors.whatsapp}</div>}
          </div>
          <div className="mb-3 filled">
            <CsLineIcons icon="notebook-1" />
            <BootstrapForm.Control value={values.obs} onChange={handleChange} name="obs" as="textarea" rows={8} placeholder="Digite uma observação" />
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

export default SendTrackingToWhatsAppModal;
