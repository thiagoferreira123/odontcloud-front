import React, { useState } from 'react';
import { Badge, Button, Card, Dropdown, DropdownButton, Form, OverlayTrigger, ButtonGroup, Table, Tooltip, Col, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalPaymentConditions from './modals/ModalPaymentConditions';
import useCarePlanBudgetStore from './hooks/CarePlanBudgetStore';
import { useParams } from 'react-router-dom';
import SelectMultiple from '../Recipe/RecipeList/SelectMultiple';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import useProfessionalStore from '../MySettings/hooks/ProfessionalStore';
import { useAuth } from '../Auth/Login/hook';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify } from '../../components/toast/NotificationIcon';
import { parseBrValueToNumber, parseToBrValue } from '../../helpers/StringHelpers';
import { CarePlanBudgetHistoryItem } from './hooks/CarePlanBudgetHistoryItem/types';
import useCarePlanBudgetHistoryItemStore from './hooks/CarePlanBudgetHistoryItem';

export default function Budget() {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const queryClient = useQueryClient();
  const { id } = useParams();

  const user = useAuth((state) => state.user);

  const { getCarePlanBudget } = useCarePlanBudgetStore();
  const { getProfessionals } = useProfessionalStore();
  const { removeCarePlanBudgetHistoryItem } = useCarePlanBudgetHistoryItemStore();

  const getProfessionals_ = async () => {
    try {
      if (!user) throw new AppException('Usuário não encontrado');

      const response = await getProfessionals(user.clinic_id);

      if (response === false) throw new Error('Erro ao buscar profissionais');

      return response;
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      throw error;
    }
  };

  const getCarePlanBudget_ = async () => {
    try {
      if (!id) throw new Error('Id is required');

      const response = await getCarePlanBudget(id);

      if (response === false) throw new Error('Erro ao buscar orcamento');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRemovePayment = async (payment: CarePlanBudgetHistoryItem) => {
    try {
      if(!payment.payment_id) throw new Error('Id do pagamento é obrigatório');
      const response = await removeCarePlanBudgetHistoryItem(payment, queryClient);
    } catch (error) {
      console.error(error);
    }
  }

  const result = useQuery({ queryKey: ['carePlanBudget', id], queryFn: getCarePlanBudget_, enabled: !!id });

  const resultProfessionals = useQuery({ queryKey: ['professionals'], queryFn: getProfessionals_, enabled: !!user?.clinic_id });

  if (result.isLoading || resultProfessionals.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  const professional = resultProfessionals.data?.find((professional: any) => professional.professional_id === result.data?.budget_care_plan_professional_id);

  const valueWithDiscount = parseBrValueToNumber(result.data?.budget_value ?? '0') - parseBrValueToNumber(result.data?.budget_discount_value ?? '0');
  const discountValue =
    result.data?.budget_discount_type === 'percentage' ? `${result.data?.budget_discount_value}%` : parseToBrValue(result.data?.budget_discount_value ?? '0');
  const installments = result.data?.budget_number_installments ? Number(result.data?.budget_number_installments) : 1;
  const installmentValue = parseToBrValue(valueWithDiscount / installments);

  return (
    <>
      <h3 className="medium-title">Orçamento</h3>
      <Icon.InfoCircleFill /> Não é feito nenhum tipo de cobrança ao gerar um orçamento; <br></br>
      <Icon.InfoCircleFill /> O orçamento será registrado em nosso sistema para sua consulta, orientação e controle a qualquer momento.
      <Card body className="mb-2 mt-3">
        <div>
          <Col xs="4" className="mb-3">
            <Form.Label className="d-block">
              <strong>Profissional</strong>
            </Form.Label>
            {/* <SelectMultiple /> */}
          </Col>
        </div>
        <Table striped>
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Plano de tratamento</th>
              <th scope="col">Realizado por</th>
              <th scope="col">Valor R$</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>{result.data?.budget_date_creation}</th>
              <td>{result.data?.budget_name}</td>
              <td>{professional?.professional_full_name}</td>
              <td>
                <td>
                  <Form.Control type="text" name="observation" value={result.data?.budget_value} className="w-40" />
                </td>
              </td>
              <td>
                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Remover procedimento</Tooltip>}>
                  <Button size="sm" className="me-1" variant="outline-primary">
                    <Icon.TrashFill />
                  </Button>
                </OverlayTrigger>{' '}
              </td>
            </tr>
          </tbody>
        </Table>
        <div className="text-end">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Adicionar procedimento</Tooltip>}>
            <Button size="sm" className="me-1" variant="outline-primary">
              <Icon.Plus />
            </Button>
          </OverlayTrigger>{' '}
        </div>
        <div className="text-center mt-5">
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Crie condições de pagamento para o paciente</Tooltip>}>
            <Button size="sm" className="me-1" variant="primary" onClick={() => setShowModal(true)}>
              Criar condições <Icon.Cash />
            </Button>
          </OverlayTrigger>{' '}
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Remover procedimento</Tooltip>}>
            <Button size="sm" className="me-1" variant="outline-primary">
              <Icon.TrashFill />
            </Button>
          </OverlayTrigger>{' '}
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Download do Orçamento</Tooltip>}>
            <Button size="sm" className="me-1" variant="outline-primary">
              <Icon.Printer />
            </Button>
          </OverlayTrigger>{' '}
        </div>
        <h5 className="mt-4 text-center">
          {' '}
          O valor total do orçamento é de <strong>{parseToBrValue(valueWithDiscount)}</strong> com um desconto de <strong>{discountValue}</strong> já aplicado.
          Será parcelado em{' '}
          <strong>
            {installments}x de {installmentValue} R${' '}
          </strong>
        </h5>
      </Card>
      <h3 className="medium-title mt-4">Histórico de pagamentos</h3>
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
                        <div className="cta-3 text-primary">R$ 350,0</div>
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
                        <div className="cta-3 text-primary">R$ 12,50</div>
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
                        <div className="cta-3 text-primary">R$ 66,0</div>
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
                        <div className="cta-3 text-primary">R$ 284,0</div>
                      </Col>
                      <Col className="d-flex align-items-center justify-content-end">
                        <Badge bg="primary">11.4%</Badge>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <Card body className="mb-2 mt-3">
        <Table striped>
          <thead>
            <tr>
              <th scope="col">Nº da parcela</th>
              <th scope="col">Vencimento</th>
              <th scope="col">Valor (R$)</th>
              <th scope="col">Data do recebimento</th>
              <th scope="col">Status</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            {result.data?.paymentHistorics.sort((a, b) => new Date(a.payment_due_date).getTime() - new Date(b.payment_due_date).getTime()).map((payment) => (
              <tr key={payment.payment_id}>
                <td>{payment.payment_description}</td>
                <td>{payment.payment_due_date}</td>
                <td>{payment.payment_installments_value} </td>
                <td>{payment.payment_installments_value_date_received ? new Date(payment.payment_installments_value_date_received).toLocaleString() : ''}</td>
                <td>
                  <Badge bg={payment.payment_status === 'pending' ? 'warning' : 'success'}>{payment.payment_status}</Badge>
                </td>
                <td>
                  <DropdownButton title="" as={ButtonGroup} variant="outline-primary" className="mb-1">
                    <Dropdown.Item href="#/action-1">Confirmar pagamento</Dropdown.Item>
                    <Dropdown.Item href="#/action-2" onClick={() => handleRemovePayment(payment)}>Remover pagamento</Dropdown.Item>
                  </DropdownButton>{' '}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      {result.data && <ModalPaymentConditions showModal={showModal} onHide={handleClose} carePlanBudget={result.data} />}
    </>
  );
}
