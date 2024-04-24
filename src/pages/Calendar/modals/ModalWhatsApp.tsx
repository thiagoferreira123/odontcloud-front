import { useEffect, useState } from 'react';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useModalWhatsAppStore } from '../hooks/modals/ModalWhatsAppStore';
import StaticLoading from '../../../components/loading/StaticLoading';
import * as Icon from 'react-bootstrap-icons';
import { useAuth } from '../../Auth/Login/hook';
import { useQuery } from '@tanstack/react-query';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';

const ModalWhatsApp = () => {
  const user = useAuth((state) => state.user);
  const [termsAreAccepted, setTermsAreAccepted] = useState(false);

  const showModal = useModalWhatsAppStore((state) => state.showModal);

  const { hideModal, getQrCode, checkSession, createSession } = useModalWhatsAppStore();

  const getQrCode_ = async () => {
    try {
      if (!user?.clinic_id) throw new Error('Clinic id not found');

      if (user && 'subscriptionStatus' in user && user.subscription?.subscription_status !== 'active') return false;

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = await getQrCode(user?.clinic_id);

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const checkSession_ = async () => {
    try {
      if (!user?.clinic_id) throw new Error('Clinic id not found');

      if (user && 'subscriptionStatus' in user && user.subscription?.subscription_status !== 'active') return 'disabled';

      const result = await checkSession(user?.clinic_id);

      return (result && result.instance_data?.phone_connected) || false;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const createSession_ = async () => {
    try {
      if (!user?.clinic_id) throw new Error('Clinic id not found');

      if (user && 'subscriptionStatus' in user && user.subscription?.subscription_status !== 'active') return false;

      const result = await createSession(user?.clinic_id);

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const resultQrCode = useQuery({ queryKey: ['whatsapp-qrcode'], queryFn: getQrCode_, enabled: !!user?.clinic_id && !!showModal && !!termsAreAccepted });
  const resultWhatsApp = useQuery({ queryKey: ['whatsapp-session'], queryFn: checkSession_, enabled: !!user?.clinic_id });
  const createSessionQuery = useQuery({
    queryKey: ['whatsapp-create-session'],
    queryFn: createSession_,
    enabled: !!user?.clinic_id && !!showModal && !resultWhatsApp.data && !resultQrCode.data,
  });

  useEffect(() => {
    if (!showModal) return;
    if (!resultQrCode.data) return;

    const interval = setInterval(() => {
      resultWhatsApp.refetch();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [resultQrCode, resultWhatsApp, createSessionQuery]);

  if (!showModal) return null;

  return (
    <Modal className="modal-close-out" size="lg" show={showModal} onHide={hideModal} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Área para conectar o seu WhatsApp</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        {!termsAreAccepted ? (
          <Alert variant="light" className="text-start">
            <h5 className="text-center mb-3">
              <strong>Para prosseguir, aceite os termo de Uso para Conexão com WhatsApp</strong>
            </h5>
            <p>Ao optar pela conexão do seu WhatsApp ao nosso serviço, você, usuário, concorda e reconhece os seguintes termos:</p>
            <ul>
              <li>
                <strong>Independência:</strong> Este serviço é independente e não possui vínculos oficiais com o WhatsApp Inc. ou suas empresas afiliadas. Não
                somos representantes nem parceiros do WhatsApp e não temos autorizações especiais para operar com o aplicativo.
              </li>
              <li>
                <strong>Não responsabilidade:</strong> Não nos responsabilizamos por quaisquer inconvenientes, problemas ou danos que possam surgir a partir da
                utilização do seu WhatsApp conectado ao nosso serviço. A responsabilidade pelo uso da plataforma WhatsApp continua sendo inteiramente sua.
              </li>
              <li>
                <strong>Falhas técnicas:</strong> Estamos atualmente em fase de testes (beta) e, por isso, podem ocorrer falhas técnicas que impactem o
                desempenho e a funcionalidade do serviço, incluindo a possibilidade de não envio de lembretes. Embora trabalhemos para minimizar tais falhas,
                não podemos garantir a entrega constante e ininterrupta do serviço durante esta fase.
              </li>
            </ul>
            <p>
              Ao conectar seu WhatsApp ao nosso serviço, você declara que leu e concordou com todos os termos apresentados acima. Certifique-se de entender
              completamente os riscos envolvidos e considere sua decisão cuidadosamente.
            </p>
            <div className="text-center">
              <Button onClick={() => setTermsAreAccepted(true)}>Aceito os termos</Button>
            </div>
          </Alert>
        ) : resultWhatsApp.data ? (
          <div className="sh-30 d-flex flex-column align-items-center justify-content-center text-primary">
            <Icon.Check2Circle size={28} /> WhatsApp conectado com sucesso
          </div>
        ) : resultQrCode.isLoading ? (
          <div className="sh-30 d-flex flex-column align-items-center justify-content-center">
            <h5>Gerando QRCode</h5>
            <p> Aguarde, essa operação pode levar alguns minutos..</p>
            <StaticLoading />
          </div>
        ) : resultQrCode.data ? (
          <>
            <Alert variant="light">
              Você deve efetuar a leitura do QRCode com o seu aplicativo do WhatsApp, da mesma forma que você se conecta no WhatsAppWeb.
            </Alert>
            <img className="sh-50" src={resultQrCode.data} alt="QR Code" />
          </>
        ) : resultQrCode.isError ? (
          <Alert variant="danger">Ocorreu um erro ao tentar gerar o QRCode. Tente novamente mais tarde.</Alert>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default ModalWhatsApp;
