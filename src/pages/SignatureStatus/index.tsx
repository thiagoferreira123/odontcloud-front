import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import useLayout from '../../hooks/useLayout';
import { Col } from 'react-bootstrap';
import api from '../../services/useAxios';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify } from '../../components/toast/NotificationIcon';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

interface BlockReason {
  statusCode: number;
  error: string;
  fullName: string;
  subscriptionStatus: string;
  message: string;
}

const queryClient = new QueryClient();

const paymentStatus = ['canceled', 'refunded', 'chargeback', 'expired', 'dispute'];

const translatedPaymentStatus = ['Cancelada', 'Reembolsada', 'Solicitação de reembolso pela operadora', 'Pagamento em atraso', 'Em disputa'];

const SignatureStatus = () => {
  useLayout();

  const blockReason: BlockReason = JSON.parse(localStorage.getItem('block') || '{}');

  const getCheckoutUrl = async () => {
    try {
      const response = await api.post('/payments/subscribe'); // Add this line

      console.log(response.data); // Add this line

      return response.data.url; // Add this line
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      throw error;
    }
  };

  const result = useQuery({
    queryKey: ['checkout-url'],
    queryFn: getCheckoutUrl,
  });

  return (
    <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
      <Col md={6}>
        <Card>
          <Card.Body>
            <h3 className="text-center mb-4">Identificamos um problema com o pagamento da sua assinatura 😕</h3>
            <div>
              <p>Olá, {blockReason.fullName}</p>

              <p>
                O status da sua assinatura é:{' '}
                <Badge bg="danger" pill>
                  {translatedPaymentStatus[paymentStatus.indexOf(blockReason.subscriptionStatus)]}
                </Badge>
              </p>

              <p>{blockReason.message}</p>

              <p>Para manter seu acesso às funcionalidades do OdontCloud, por favor, atualize sua assinatura clicando no botão abaixo.</p>

              <p className="text-center">
                {/* <a href="https://purchase.hotmart.com/" target="_blank" className="mb-1 btn btn-primary" role="button" rel="noreferrer">
                  Regularizar
                </a> */}
                <Link to={result.data} className="mb-1 btn btn-primary">
                  Regularizar
                </Link>{' '}
              </p>

              <p>Instruções:</p>
              <ol>
                <li>
                  <p>Digite o e-mail utilizado na compra. </p>
                </li>
                <li>
                  <p>Digite sua senha (se esqueceu, selecione "esqueci minha senha").</p>
                </li>
                <li>
                  <p>Acesse suas compras e selecione o OdontCloud.</p>
                </li>
                <li>
                  <p>Verifique suas faturas pendentes e realize o pagamento.</p>
                </li>
              </ol>

              <p>
                <p>
                  Tutorial completo:{' '}
                  <a
                    href="https://help.hotmart.com/pt-br/article/como-gerir-os-meus-pagamentos-pela-area-do-comprador-da-plataforma-beta-/19424127593741"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Como emitir um novo boleto para uma assinatura atrasada
                  </a>
                  .
                </p>
              </p>
              <p>
                Se tiver dúvidas, consulte nossa{' '}
                <a href="https://OdontCloud.com.br/politica-de-pagamentos" target="_blank" rel="noreferrer">
                  política de pagamentos
                </a>
                .
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
};

const Main = () => {
  useLayout();

  return (
    <QueryClientProvider client={queryClient}>
      <SignatureStatus />
    </QueryClientProvider>
  );
};

export default Main;
