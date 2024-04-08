import { Alert, Button, Col, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { usePanelPatientModalStore } from '../hooks/PanelPatientModalStore';
import { usePatientAuthStore } from '../../../Auth/PatientLogin/hook/PatientAuthStore';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../../../../types/Patient';
import SendPanelPatientToWhatsappModal from './SendPanelPatientToWhatsappModal';
import { useSendPanelPatientToWhatsappModalStore } from '../hooks/SendPanelPatientToWhatsappModalStore';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
interface SelectedPatient {
  passwordMobileAndWeb: string;
}

interface Props {
  selectedPatient?: SelectedPatient;
}

const PanelPatientModal = () => {
  const showModal = usePanelPatientModalStore((state) => state.showModal);
  const selectedPatient = usePanelPatientModalStore((state) => state.selectedPatient);
  const navigate = useNavigate();

  const { hideModal } = usePanelPatientModalStore();
  const { setPatient } = usePatientAuthStore();
  const { handleSelectPatientForPanelPatientModal } = useSendPanelPatientToWhatsappModalStore();

  const handleNavigateToPatientPane = () => {
    setPatient(selectedPatient as Patient);
    navigate(`/painel-paciente/`);
  };

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Esconde a mensagem após 2 segundos
  };

  return (
    <Modal className="modal-close-out" backdrop="static" size="lg" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Disponibilizar acesso ao painel do paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert className="text-center">
          O painel do paciente, é um local onde o paciente pode realizar o download dos PDF’s e responder aos questionários pré-consulta. Para que o paciente
          tenha acesso ao painel, ele deve acessar o link www.dietsystem.com.br/paciente e inserir a senha. Você pode ativar ou desativar o acesso aos PDF’s
          através do menu do paciente.
        </Alert>

        <div className="d-flex justify-content-center align-items-center">
            <Col xl={4}>
            <Alert className="text-center">
              Senha do painel: <strong>{selectedPatient?.passwordMobileAndWeb}</strong>
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-copy">Copiar senha.</Tooltip>}>
                <CopyToClipboard text={selectedPatient?.passwordMobileAndWeb || ''} onCopy={handleCopy}>
                  <span>
                    <Icon.Copy className="cursor-pointer ms-2" />
                  </span>
                </CopyToClipboard>
              </OverlayTrigger>
              {isCopied && <div>Senha copiada!</div>}
            </Alert>
          </Col>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <Button onClick={() => selectedPatient && handleSelectPatientForPanelPatientModal(selectedPatient)}>
            Enviar link por WhatsApp
            <Icon.Whatsapp className="ms-2" />
          </Button>
        </div>

        <div className="d-flex justify-content-center align-items-center mt-2">
          <Button variant="outline-primary" onClick={handleNavigateToPatientPane}>
            Acessar painel do paciente como profissional
          </Button>
        </div>

        <SendPanelPatientToWhatsappModal />
      </Modal.Body>
    </Modal>
  );
};

export default PanelPatientModal;
