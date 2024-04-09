import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import SelectPaymentMethod from './SelectPaymentMethod';
import { CarePlanBudget } from '../../PatientMenu/budget/hooks/CarePlanBudgetStore/types';
import { useEffect, useState } from 'react';
import AsyncButton from '../../../components/AsyncButton';
import * as Yup from 'yup';
import { ptBR } from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
registerLocale('pt-BR', ptBR);
import { useFormik } from 'formik';
import useCarePlanBudgetStore from '../hooks/CarePlanBudgetStore';
import { useQueryClient } from '@tanstack/react-query';
import { CarePlanBudgetHistoryItem } from '../hooks/CarePlanBudgetHistoryItem/types';
import { parseToBrValue } from '../../../helpers/StringHelpers';
import useCarePlanBudgetHistoryItemStore from '../hooks/CarePlanBudgetHistoryItem';
import { parseDateToIso } from '../../../helpers/DateHelper';

interface ModalPaymentConditionsProps {
  showModal: boolean;
  onHide: () => void;
  carePlanBudget: CarePlanBudget;
}

export interface ModalPaymentConditionsFormValues {
  budget_payment_method: string;
  budget_discount_value: string;
  budget_discount_type: string;
  budget_number_installments: string;
  budget_due_first_installment: Date;
  budget_entry_payment: Date;
  budget_pay_day: string;
}

const ModalPaymentConditions = ({ showModal, onHide, carePlanBudget }: ModalPaymentConditionsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const { updateCarePlanBudget } = useCarePlanBudgetStore();
  const { createMenyCarePlanBudgetHistoryItems } = useCarePlanBudgetHistoryItemStore();

  const onSubmit = async (values: any) => {
    try {
      setIsSaving(true);

      const payload = {
        ...carePlanBudget,
        budget_payment_method: values.budget_payment_method,
        budget_discount_value: values.budget_discount_value,
        budget_discount_type: values.budget_discount_type,
        budget_number_installments: values.budget_number_installments,
        budget_due_first_installment: new Date(values.budget_due_first_installment).toISOString(),
        budget_entry_payment: new Date(values.budget_entry_payment).toISOString(),
        budget_pay_day: values.budget_pay_day,
      };

      const response = await updateCarePlanBudget(payload, queryClient);

      const installments = values.budget_number_installments ? Number(values.budget_number_installments) : 1;

      const parsedDiscountValue = values.budget_discount_value ? values.budget_discount_value.replace('.', '').replace(',', '.') : '0';
      const valueWithDiscount =
        values.budget_discount_type === 'percentage'
          ? parseFloat(carePlanBudget.budget_value.replace('.', '').replace(',', '.')) -
            (parseFloat(carePlanBudget.budget_value.replace('.', '').replace(',', '.')) * parseFloat(parsedDiscountValue)) / 100
          : parseFloat(carePlanBudget.budget_value.replace('.', '').replace(',', '.')) - parseFloat(parsedDiscountValue);

      console.log('valueWithDiscount', valueWithDiscount)

      const responseItems = await createMenyCarePlanBudgetHistoryItems(
        {
          paymentBudgetId: carePlanBudget.budget_id,
          totalAmount: Number(valueWithDiscount),
          installments: installments,
          firstPaymentDate: parseDateToIso(values.budget_due_first_installment),
        },
        queryClient
      );

      setIsSaving(false);

      onHide();
    } catch (error) {
      setIsSaving(false);
      console.error(error);
    }
  };

  const handleChangeDiscountType = (type: string) => {
    setFieldValue('budget_discount_type', type);

    if (!values.budget_discount_value) {
      setFieldValue('budget_discount_value', '');
      return;
    }

    const inputValue =
      type === 'real'
        ? (parseInt(values.budget_discount_value.replace(/\D/g, ''), 10) / 100)
            .toFixed(2)
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : values.budget_discount_value.replace(/\D/g, '');

    setFieldValue('budget_discount_value', inputValue);
  };

  const handleChangeMaskMoney = (event: { target: { value: string; name: string } }) => {
    if (!event.target.value) {
      setFieldValue('budget_discount_value', '');
      return;
    }

    const inputValue =
      values.budget_discount_type === 'real'
        ? (parseInt(event.target.value.replace(/\D/g, ''), 10) / 100)
            .toFixed(2)
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : event.target.value.replace(/\D/g, '');

    setFieldValue(event.target.name, inputValue);
  };

  const initialValues = {
    budget_discount_value: '',
    budget_discount_type: 'percentage',
    budget_number_installments: '1',
    budget_due_first_installment: new Date(),
    budget_payment_method: '',
    budget_entry_payment: new Date(),
    budget_pay_day: '',
  };

  const validationSchema = Yup.object().shape({
    budget_discount_value: Yup.string(),
    budget_discount_type: Yup.string(),
    budget_number_installments: Yup.string(),
    budget_payment_method: Yup.string(),
    budget_pay_day: Yup.string(),
    budget_due_first_installment: Yup.date(),
    budget_entry_payment: Yup.date(),
  });

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, setValues, values, touched, errors } = formik;

  const parsedDiscountValue = values.budget_discount_value ? values.budget_discount_value.replace('.', '').replace(',', '.') : '0';
  const valueWithDiscount =
    values.budget_discount_type === 'percentage'
      ? (
          parseFloat(carePlanBudget.budget_value.replace('.', '').replace(',', '.')) -
          (parseFloat(carePlanBudget.budget_value.replace('.', '').replace(',', '.')) * parseFloat(parsedDiscountValue)) / 100
        ).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : (parseFloat(carePlanBudget.budget_value.replace('.', '').replace(',', '.')) - parseFloat(parsedDiscountValue)).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

  useEffect(() => {
    setValues({
      ...carePlanBudget,
      budget_due_first_installment: new Date(carePlanBudget.budget_due_first_installment),
      budget_entry_payment: new Date(carePlanBudget.budget_entry_payment),
    });
  }, [carePlanBudget]);

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Condições de pagamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col xs="12" className="mb-3">
              <Form.Label className="d-block">
                <strong>Forma de pagamento</strong>
              </Form.Label>
              <SelectPaymentMethod formik={formik} />
            </Col>
          </Row>
          <Row>
            <Form.Label className="d-flex">
              <strong>Desconto </strong>
              <Form.Check
                type="radio"
                label="Porcentagem (%)"
                id="budget_discount_type1"
                name="budget_discount_type"
                className="ms-3"
                onChange={(e) => handleChangeDiscountType('percentage')}
                checked={values.budget_discount_type == 'percentage'}
              />
              <Form.Check
                type="radio"
                label="Real (R$)"
                id="budget_discount_type2"
                name="budget_discount_type"
                className="ms-3"
                onChange={(e) => handleChangeDiscountType('real')}
                checked={values.budget_discount_type == 'real'}
              />
            </Form.Label>
            {errors.budget_discount_type && touched.budget_discount_type && <div className="error">{errors.budget_discount_type.toString()}</div>}
          </Row>
          <Row>
            <Form.Label className="d-block">
              <strong>Valor</strong>
            </Form.Label>
            <Col xs="12" className="mb-3 d-flex">
              <Form.Control type="text" name="budget_discount_value" value={values.budget_discount_value} onChange={handleChangeMaskMoney} />
              {errors.budget_discount_value && touched.budget_discount_value && <div className="error">{errors.budget_discount_value}</div>}
            </Col>
          </Row>
          <Alert variant="light">
            Valor total do orçamento:{' '}
            {Number(carePlanBudget.budget_value.replace('.', '').replace(',', '.')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <br />{' '}
            <br />
            Valor com desconto: {valueWithDiscount}
          </Alert>
          <Row>
            <Col xs="6" className="mb-3">
              <Form.Label className="d-block">
                <strong>Quantidade de parcelas</strong>
              </Form.Label>
              <Col xs="12" className="mb-3 d-flex">
                <Form.Control type="text" name="budget_number_installments" value={values.budget_number_installments} onChange={handleChange} />
                {errors.budget_number_installments && touched.budget_number_installments && <div className="error">{errors.budget_number_installments}</div>}
              </Col>
            </Col>

            <Col xs="6" className="mb-3">
              <Form.Label>
                <strong>Data do vencimento da primeira parcela</strong>
              </Form.Label>
              <DatePicker
                className="form-control"
                placeholderText="Data"
                selected={values.budget_due_first_installment}
                onChange={(date) => setFieldValue('budget_due_first_installment', date)}
                locale="pt-BR"
                dateFormat="dd/MM/yyyy"
              />
            </Col>
          </Row>

          <Row>
            <Col xs="6" className="mb-3">
              <Form.Label className="d-block">
                <strong>Entrada</strong>
              </Form.Label>
              <Col xs="12" className="mb-3 d-flex">
                <Form.Control type="text" name="budget_pay_day" value={values.budget_pay_day} onChange={handleChange} />
                {errors.budget_pay_day && touched.budget_pay_day && <div className="error">{errors.budget_pay_day}</div>}
              </Col>
            </Col>

            <Col xs="6" className="mb-3">
              <Form.Label>
                <strong>Data da entrada</strong>
              </Form.Label>
              <DatePicker
                className="form-control"
                placeholderText="Data"
                selected={values.budget_entry_payment}
                onChange={(date) => setFieldValue('budget_entry_payment', date)}
                locale="pt-BR"
                dateFormat="dd/MM/yyyy"
              />
            </Col>
          </Row>
          <div className="text-center">
            <AsyncButton isSaving={isSaving} type="submit">
              Salvar
            </AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalPaymentConditions;
