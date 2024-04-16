import React from 'react';
import { Badge, Card } from 'react-bootstrap';
import useLayout from '../../hooks/useLayout';
import { Col } from 'react-bootstrap';
import api from '../../services/useAxios';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify } from '../../components/toast/NotificationIcon';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/Login/hook';
import { appRoot } from '../../routes';

interface BlockReason {
  statusCode: number;
  error: string;
  fullName: string;
  subscriptionStatus: string;
  message: string;
  subscription_level: string;
}

const queryClient = new QueryClient();

const paymentStatus = ['canceled', 'refunded', 'chargeback', 'expired', 'dispute'];

const translatedPaymentStatus = ['Cancelada', 'Reembolsada', 'Solicitação de reembolso pela operadora', 'Pagamento em atraso', 'Em disputa'];

const SignatureStatus = () => {
  useLayout();

  const user = useAuth((state) => state.user);

  const blockReason: BlockReason = JSON.parse(localStorage.getItem('block') || '{}');

  const getBillingPortal = async () => {
    try {
      const response = await api.get('/payments/get-portal-link'); // Add this line

      return response.data.url; // Add this line
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      throw error;
    }
  };

  const result = useQuery({
    queryKey: ['portal-link'],
    queryFn: getBillingPortal,
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
