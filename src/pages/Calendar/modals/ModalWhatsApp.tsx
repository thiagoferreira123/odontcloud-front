import { useEffect, useState } from 'react';
import { Alert, Modal } from 'react-bootstrap';
import { useModalWhatsAppStore } from '../hooks/modals/ModalWhatsAppStore';
import useWebSocket from '../../../services/useWebSocket';
import StaticLoading from '../../../components/loading/StaticLoading';
import * as Icon from 'react-bootstrap-icons';
import { useAuth } from '../../Auth/Login/hook';
import { useQueryClient } from '@tanstack/react-query';

const webSocketStatus = [
  'success', 'error', 'qrReadSuccess'
]

const ModalWhatsApp = () => {
  const queryClient = useQueryClient();
  const user = useAuth((state) => state.user);
  const { messages, isOpen, sendMessage, setShouldReconnect } = useWebSocket('wss://calendar-alert.dietsystem.com.br');
  const [base64Qr, setBase64Qr] = useState('' as string | null);
  const [status, setStatus] = useState('' as string | null);

  const showModal = useModalWhatsAppStore((state) => state.showModal);

  const { hideModal } = useModalWhatsAppStore();

  useEffect(() => {
    if (showModal) {
      setShouldReconnect(true);
      setBase64Qr('');
      setStatus('');
    }
  }, [showModal]);

  useEffect(() => {
    if (isOpen && user?.clinic_id) {
      sendMessage(
        JSON.stringify({
          type: 'createSession',
          userId: user?.clinic_id,
        })
      );
    }
  }, [isOpen, user?.clinic_id]);

  useEffect(() => {
    messages.forEach((message) => {
      const content = JSON.parse(message);

      if ('base64Qr' in content) {
        setBase64Qr(content.base64Qr);
      } else if ('status' in content) {
        content.status === 'success' &&queryClient.invalidateQueries({queryKey: ['whatsapp-session']});
        webSocketStatus.includes(content.status) && setStatus(content.status);
      }
    });
  }, [messages]);

  if (!showModal) return null;

  return (
    <Modal className="modal-close-out" size="lg" show={showModal} onHide={hideModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Aponte a câmera</Modal.Title>
      </Modal.Header>
      <Modal.Body className='text-center'>
        {!base64Qr && !status && (
          <div className="sh-30 d-flex flex-column align-items-center justify-content-center">
            <h5>Gerando QRCode</h5>
            <p> Aguarde, essa operação pode levar alguns minutos..</p>
            <StaticLoading />
          </div>
        )}
        {(status === 'qrReadSuccess') && ( // Loading após a leitura do qrCode
          <div className="sh-30 d-flex flex-column align-items-center justify-content-center">
            <h5>Conectando...</h5>
            <p> Aguarde, essa operação pode levar alguns minutos..</p>
            <StaticLoading />
          </div>
        )}
        {base64Qr && !status &&(
          <>
            <Alert variant="light">
              Você deve efetuar a leitura do QRCode com o seu aplicativo do WhatsApp, da mesma forma que você se conecta no WhatsAppWeb.
            </Alert>
            <img src={base64Qr} alt="QR Code" />
          </>
        )}
        {status === 'success' && (
          <div className="sh-30 d-flex flex-column align-items-center justify-content-center text-primary">
            <Icon.Check2Circle size={28} /> WhatsApp conectado com sucesso
          </div>
        )}
        {status === 'error' && (
          <div className="sh-30 d-flex flex-column align-items-center justify-content-center text-danger">
            <Icon.ExclamationCircle size={28} /> Erro ao conectar WhatsApp
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ModalWhatsApp;
