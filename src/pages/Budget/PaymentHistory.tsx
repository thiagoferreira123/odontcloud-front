import { Badge, Card, Col, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { CarePlanBudget } from './hooks/CarePlanBudgetStore/types';
import { parseToBrValue } from '../../helpers/StringHelpers';
import { parseFloatNumber } from '../../helpers/MathHelpers';

type PaymentHistoryProps = {
  carePlanBudget: CarePlanBudget;
};

const todayWithNoTime = new Date().setHours(0, 0, 0, 0);

export default function PaymentHistory({ carePlanBudget }: PaymentHistoryProps) {
  const latePayments = carePlanBudget.paymentHistorics.filter(
    (payment) => payment.payment_status === 'pending' && new Date(payment.payment_due_date + 'T00:00:00').getTime() < todayWithNoTime
  );

  const paymentsExpiringToday = carePlanBudget.paymentHistorics.filter(
    (payment) => payment.payment_status === 'pending' && new Date(payment.payment_due_date + 'T00:00:00').getTime() === todayWithNoTime
  );

  const pendingPayments = carePlanBudget.paymentHistorics.filter((payment) => payment.payment_status === 'pending');

  const receivedPayments = carePlanBudget.paymentHistorics.filter((payment) => payment.payment_status === 'received');

  const totalLatePayments = latePayments.reduce(
    (acc: number, payment) => (Number(payment.payment_installments_value) ? acc + Number(payment.payment_installments_value) : acc),
    0
  );

  const totalPaymentsExpiringToday = paymentsExpiringToday.reduce(
    (acc: number, payment) => (Number(payment.payment_installments_value) ? acc + Number(payment.payment_installments_value) : acc),
    0
  );

  const totalPendingPayments = pendingPayments.reduce(
    (acc: number, payment) => (Number(payment.payment_installments_value) ? acc + Number(payment.payment_installments_value) : acc),
    0
  );

  const totalReceivedPayments = receivedPayments.reduce(
    (acc: number, payment) => (Number(payment.payment_installments_value) ? acc + Number(payment.payment_installments_value) : acc),
    0
  );

  const receivedPaymentsPercentage = (totalReceivedPayments / (totalPendingPayments + totalReceivedPayments)) * 100;

  return (
    <>
      <div>
        <Row className="g-2">
          <Col lg="6" xxl="3">
            <Card>
              <Card.Body>
                <Row className="g-0 align-items-center">
                  <Col xs="auto">
                    <div className="bg-gradient-danger sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                      <Icon.Clock className="text-white" size={20} />
                    </div>
                  </Col>
                  <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                    <div className="heading mb-0 d-flex align-items-center lh-1-25">Total atrasado</div>
                    <Row className="g-0">
                      <Col xs="auto">
                        <div className="cta-3 text-primary">{parseToBrValue(totalLatePayments)}</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6" xxl="3">
            <Card>
              <Card.Body>
                <Row className="g-0 align-items-center">
                  <Col xs="auto">
                    <div className="bg-gradient-warning sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                      <Icon.Calendar className="text-white" size={20} />
                    </div>
                  </Col>
                  <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                    <div className="heading mb-0 d-flex align-items-center lh-1-25">Total a vencer hoje</div>
                    <Row className="g-0">
                      <Col xs="auto">
                        <div className="cta-3 text-primary">{parseToBrValue(totalPaymentsExpiringToday)}</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6" xxl="3">
            <Card>
              <Card.Body>
                <Row className="g-0 align-items-center">
                  <Col xs="auto">
                    <div className="bg-gradient-light    sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                      <Icon.ClockHistory className="text-white" size={20} />
                    </div>
                  </Col>
                  <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                    <div className="heading mb-0 d-flex align-items-center lh-1-25">Total em aberto</div>
                    <Row className="g-0">
                      <Col xs="auto">
                        <div className="cta-3 text-primary">{parseToBrValue(totalPendingPayments)}</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6" xxl="3">
            <Card>
              <Card.Body>
                <Row className="g-0 align-items-center">
                  <Col xs="auto">
                    <div className="bg-gradient-light sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                      <Icon.Check className="text-white" size={20} />
                    </div>
                  </Col>
                  <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                    <div className="heading mb-0 d-flex align-items-center lh-1-25">Total pago</div>
                    <Row className="g-0">
                      <Col xs="auto">
                        <div className="cta-3 text-primary">{parseToBrValue(totalReceivedPayments)}</div>
                      </Col>
                      <Col className="d-flex align-items-center justify-content-end">
                        <Badge bg="primary">{parseFloatNumber(receivedPaymentsPercentage)}%</Badge>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
