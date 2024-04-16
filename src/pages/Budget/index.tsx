import { useRef, useState } from 'react';
import { Button, Card, Form, OverlayTrigger, Table, Tooltip, Col, Tab, Nav } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalPaymentConditions from './modals/ModalPaymentConditions';
import useCarePlanBudgetStore from './hooks/CarePlanBudgetStore';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import useProfessionalStore from '../MySettings/hooks/ProfessionalStore';
import { useAuth } from '../Auth/Login/hook';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify, updateNotify } from '../../components/toast/NotificationIcon';
import { parseBrValueToNumber, parseToBrValue } from '../../helpers/StringHelpers';
import PaymentHistory from './PaymentHistory';
import Installments from './Installments';
import api from '../../services/useAxios';
import { downloadPDF } from '../../helpers/PdfHelpers';
import AsyncButton from '../../components/AsyncButton';
import PatientMenuRow from '../../components/PatientMenuRow';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';
import { getTotalValueWithDiscount } from './helpers';
import ResponsiveNav from '../../components/ResponsiveNav';
import TransactionConfirmationModal from './modals/TransactionConfirmationModal';
import ProfessionalSelect from './ProfessionalSelect';

export default function Budget() {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const { id } = useParams();

  const toastId = useRef<React.ReactText>();
  const [budget_value, setBudgetValue] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const user = useAuth((state) => state.user);

  const { getCarePlanBudget } = useCarePlanBudgetStore();
  const { getProfessionals } = useProfessionalStore();
  const { setPatientId } = usePatientMenuStore();

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

      response.budget_care_plan_patient_id && setPatientId(response.budget_care_plan_patient_id);

      !budget_value && response.budget_value && setBudgetValue(response.budget_value);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);

    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.get('/budget-pdf/' + id, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      downloadPDF(data, 'orcamento-' + id);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const result = useQuery({ queryKey: ['carePlanBudget', id], queryFn: getCarePlanBudget_, enabled: !!id });

  const resultProfessionals = useQuery({ queryKey: ['professionals'], queryFn: getProfessionals_, enabled: !!user?.clinic_id });

  if (result.isLoading || resultProfessionals.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  const professional = resultProfessionals.data?.find((professional: any) => professional.professional_id === result.data?.budget_care_plan_professional_id);

  const valueWithDiscount = getTotalValueWithDiscount(
    budget_value,
    result.data?.budget_discount_value ?? '0',
    result.data?.budget_discount_type ?? 'percentage'
  );
  const discountValue = result.data?.budget_discount_value
    ? result.data?.budget_discount_type === 'percentage'
      ? `${result.data?.budget_discount_value}%`
      : parseToBrValue(result.data?.budget_discount_value ?? '0')
    : null;
  const installments = result.data?.budget_number_installments ? Number(result.data?.budget_number_installments) : 1;
  const installmentValue = (valueWithDiscount - parseBrValueToNumber(result.data?.budget_pay_day ?? '0')) / installments;

  return (
    <>
      <PatientMenuRow />

      <Tab.Container defaultActiveKey="budget">
        <Nav variant="tabs" className="nav-tabs-title nav-tabs-line-title mt-3" activeKey="budget" as={ResponsiveNav}>
          <Nav.Item>
            <Nav.Link eventKey="budget">Orçamento</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="paymentHistory">Histórico de pagamentos</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="budget">
            <Card body className="mb-2 mt-3">
              <div>
                <Col xs="4" className="mb-3">
                  <Form.Label className="d-block">
                    <strong>Profissional</strong>
                  </Form.Label>
                  {result.data && <ProfessionalSelect carePlanBudget={result.data} />}
                </Col>
              </div>
              <Table striped>
                <thead>
                  <tr>
                    <th scope="col">Data</th>
                    <th scope="col">Plano de tratamento</th>
                    <th scope="col">Realizado por</th>
                    <th scope="col">Valor R$</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>{result.data?.budget_date_creation ? new Date(result.data?.budget_date_creation).toLocaleDateString() : '...'}</th>
                    <td>{result.data?.budget_name}</td>
                    <td>{professional?.professional_full_name}</td>
                    <td>
                      <Form.Control
                        type="text"
                        name="observation"
                        value={budget_value}
                        onChange={(event) => setBudgetValue(event.target.value)}
                        className="w-40"
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div className="text-center mt-5">
                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Crie condições de pagamento para o paciente</Tooltip>}>
                  <Button size="sm" className="me-1" variant="primary" onClick={() => setShowModal(true)}>
                    Criar condições <Icon.Cash />
                  </Button>
                </OverlayTrigger>{' '}
                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Download do Orçamento</Tooltip>}>
                  <span>
                    <AsyncButton
                      isSaving={isGeneratingPdf}
                      loadingText=" "
                      variant="outline-primary"
                      size="sm"
                      className="me-1"
                      onClickHandler={handleDownloadPdf}
                    >
                      <Icon.Printer />
                    </AsyncButton>
                  </span>
                </OverlayTrigger>{' '}
              </div>
              <h5 className="mt-4 text-center">
                {' '}
                O valor total do orçamento é de <strong>{parseToBrValue(valueWithDiscount)}</strong>
                {discountValue ? (
                  <span>
                    com um desconto de <strong>{discountValue}</strong> já aplicado.
                  </span>
                ) : null}{' '}
                Será parcelado em{' '}
                <strong>
                  {installments}x de {parseToBrValue(installmentValue)}
                </strong>
              </h5>
            </Card>
          </Tab.Pane>
          <Tab.Pane eventKey="paymentHistory">
            {result.data && <PaymentHistory carePlanBudget={result.data} />}

            {result.data && <Installments carePlanBudget={result.data} />}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      {result.data && <ModalPaymentConditions showModal={showModal} onHide={handleClose} carePlanBudget={result.data} />}
    </>
  );
}
