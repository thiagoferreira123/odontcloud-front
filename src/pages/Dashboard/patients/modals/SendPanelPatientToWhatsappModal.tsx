import { useFormik } from 'formik';
import { Button, Form as BootstrapForm, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import usePatientMenuStore from '../../../PatientMenu/hooks/patientMenuStore';
import { useSendPanelPatientToWhatsappModalStore } from '../hooks/SendPanelPatientToWhatsappModalStore';
import { DEFAULT_PATHS } from '../../../../config';
import { encodeURL } from '../../../../helpers/StringHelpers';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { useEffect } from 'react';

type FormValues = {
  whatsapp: string;
  obs: string;
};

const SendPanelPatientToWhatsappModal = () => {
  const { patient } = usePatientMenuStore((state) => state);

  const showModal = useSendPanelPatientToWhatsappModalStore((state) => state.showModal);
  const selectedPatient = useSendPanelPatientToWhatsappModalStore((state) => state.selectedPatient);

  const { hideModal } = useSendPanelPatientToWhatsappModalStore();

  const initialValues = {
    whatsapp: patient?.phone?.replace(/\D/g, '') || '',
    obs: `
Olá, tudo bem? Para ter acesso aos materiais em PDF da nossa consulta e/ou responder aos questionários, você precisa acessar o link ${window.location.origin}${DEFAULT_PATHS.PATIENT_LOGIN} e inserir a senha ${selectedPatient?.passwordMobileAndWeb}. Fico a disposição em caso de dúvidas.
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

  const { values, errors, touched, handleSubmit, handleChange, setFieldValue } = useFormik({ initialValues, validationSchema, enableReinitialize: true, onSubmit });

  useEffect(() => {
    if (selectedPatient) {
      setFieldValue('whatsapp', '55' + selectedPatient.phone?.replace(/\D/g, '') || '');
    } else{
      setFieldValue('whatsapp', '55' + patient?.phone?.replace(/\D/g, '') || '');
    }
  }, [selectedPatient]);

  return (
    <Modal className="modal-close-out" backdrop="static" size="lg" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Enviar acesso ao painel por WhatsApp</Modal.Title>
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

export default SendPanelPatientToWhatsappModal;
