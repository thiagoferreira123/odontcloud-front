import { Row, Col, Card } from 'react-bootstrap';
import ListPatient from './patients/ListPatient.tsx';
import ListCalendar from './ListCalendar/index.tsx';
import ListFoodDiary from './FoodDiary/index.tsx';
import { CtaIntrodutionVideo } from './CtaIntrodutionVideo.tsx';
import PatientListFilter from './patients/PatientListFilter.tsx';
import PatientsAnalysis from './PatientsAnalysis/index.tsx';
import { useQuery } from '@tanstack/react-query';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuth } from '../Auth/Login/hook/index.ts';
import * as Icon from 'react-bootstrap-icons';
import ForumPreview from './ForumPreview/index.tsx';
import useTransactionStore from '../FinancialControl/hooks/TransactionStore/index.ts';
import { monthOptions } from '../../helpers/DateHelper.ts';
import { AppException } from '../../helpers/ErrorHelpers.ts';
import { notify } from '../../components/toast/NotificationIcon.tsx';

const actualDate = new Date();
const actualYear = actualDate.getFullYear();

const Dashboard = () => {
  const user = useAuth((state) => state.user);

  const { getTransactions } = useTransactionStore();

  const getTransactions_ = async () => {
    try {
      const response = await getTransactions(monthOptions[actualDate.getMonth()].value, actualYear.toString());

      if (response === false) throw new Error('Error');

      return response;
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      throw error;
    }
  };

  const financialResult = useQuery({
    queryKey: ['my-transactions', monthOptions[actualDate.getMonth()].value, actualYear.toString()],
    queryFn: getTransactions_,
  });

  const totalEntrance =
    financialResult.data?.reduce((acc, transaction) => {
      return transaction.transaction_type === 'entrada' ? acc + Number(transaction.value) : acc;
    }, 0) ?? 0;
  const totalExpense =
    financialResult.data?.reduce((acc, transaction) => {
      return transaction.transaction_type === 'saida' ? acc + Number(transaction.value) : acc;
    }, 0) ?? 0;

  return (
    <>
      <Col xs="12" sm={20} className="text-center mb-3">
        <img src={user?.clinic_logo_link ? user?.clinic_logo_link : '/img/logo/logo.webp'} className="img-fluid sh-12" alt="Fluid image" />
      </Col>

      <Row>
        <Col lg="7">
          <PatientListFilter />
          <div className="mb-5">
            <Row className="g-2">
              <Col sm="12">
                <ListPatient />
              </Col>
            </Row>
          </div>

          <PatientsAnalysis />

          <Row className="mt-4">
            <Col xl="6">
              <Card>
                <Card.Body className="py-4">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto">
                      <div className="bg-gradient-light sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                        <Icon.GraphUpArrow className="text-white" />
                      </div>
                    </Col>
                    <Col>
                      <div className="heading mb-0 sh-8 d-flex align-items-center lh-1-25 ps-3">Entrada do mês</div>
                    </Col>
                    <Col xs="auto" className="ps-3">
                      <div className="display-5 text-primary">{totalEntrance?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xl="6">
              <Card>
                <Card.Body className="py-4">
                  <Row className="g-0 align-items-center">
                    <Col xs="auto">
                      <div className="bg-gradient-danger sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center ">
                        <Icon.GraphDownArrow className="text-white" />
                      </div>
                    </Col>
                    <Col>
                      <div className="heading mb-0 sh-8 d-flex align-items-center lh-1-25 ps-3">Saída do mês</div>
                    </Col>
                    <Col xs="auto" className="ps-3">
                      <div className="display-5 text-danger">{totalExpense?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col lg="5" className="mb-5">
          <div className="mb-2">{!user?.subscriptionStatus?.status || user.subscriptionStatus.status !== 'approved' ? <CtaIntrodutionVideo /> : null}</div>

          <div className="mb-n2">
            <ListCalendar />
          </div>

          <div className="mb-n2 mt-4">
            <ListFoodDiary />
          </div>

          <div className="mb-n2 mt-4">
            <ForumPreview />
          </div>
        </Col>
      </Row>

      <a
        href="https://api.whatsapp.com/send?phone=5567981490781"
        style={{
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          backgroundColor: '#25D366',
          color: 'white',
          borderRadius: '50%',
          padding: '10px',
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 2px 3px rgba(0,0,0,0.3)',
        }}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon.Whatsapp />
      </a>
    </>
  );
};

export default Dashboard;
