import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import SelectPaymentMethod from './SelectPaymentMethod';
import { CarePlanBudget } from '../../PatientMenu/budget/hooks/CarePlanBudgetStore/types';
import { useState } from 'react';
import AsyncButton from '../../../components/AsyncButton';
import * as Yup from 'yup';
import { useFormik } from 'formik';

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
  budget_due_first_installment: string;
  budget_entry_payment: string;
}

const ModalPaymentConditions = ({ showModal, onHide, carePlanBudget }: ModalPaymentConditionsProps) => {
  const onSubmit = async (values: any) => {
    console.log('values', values);

    // await api.post('url', values);

    onHide();
  };

  const initialValues = {
    budget_discount_value: '',
    budget_discount_type: 'percentage',
    budget_number_installments: '1',
    budget_due_first_installment: '',
    budget_payment_method: '',
    budget_entry_payment: '',
  };

  const validationSchema = Yup.object().shape({
    budget_discount_value: Yup.string().required('Required'),
    budget_discount_type: Yup.string().required('Required'),
    budget_number_installments: Yup.string().required('Required'),
    budget_due_first_installment: Yup.string().required('Required'),
    budget_payment_method: Yup.string().required('Required'),
    budget_entry_payment: Yup.string().required('Required'),
  });

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, values, touched, errors } = formik;

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Condições de pagamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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
              <Form.Check type="radio" label="Porcentagem (%)" id="stackedRadio1" name="stackedRadio" className="ms-3" defaultChecked />
              <Form.Check type="radio" label="Real (R$)" id="stackedRadio2" name="stackedRadio" className="ms-3" />
            </Form.Label>
          </Row>
          <Row>
            <Form.Label className="d-flex">
              <strong>Desconto </strong>
              <Field type="radio" name="budget_discount_type" value="percentage" className="ms-3" />
              <label htmlFor="budget_discount_type_percentage" className="ms-1">
                Porcentagem (%)
              </label>
              <Field type="radio" name="budget_discount_type" value="real" className="ms-3" />
              <label htmlFor="budget_discount_type_real" className="ms-1">
                Real (R$)
              </label>
            </Form.Label>
            <ErrorMessage name="budget_discount_type" component="div" className="text-danger" />
          </Row>
          <Row>
            <Form.Label className="d-block">
              <strong>Valor do desconto</strong>
            </Form.Label>
            <Col xs="2" className="mb-3 d-flex">
              <Field type="text" name="discount" />
              <ErrorMessage name="discount" component="div" className="text-danger" />
            </Col>
          </Row>
          <Alert variant="light">
            Valor total do orçamento: {carePlanBudget.budget_value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} <br /> <br />
            Valor com desconto: {/* calculate valueWithDiscount based on form values */}
          </Alert>
          <Row>
            <Col xs="6" className="mb-3">
              <Form.Label>
                <strong>Quantidade de parcelas</strong>
              </Form.Label>
              <Field type="text" name="budget_number_installments" />
              <ErrorMessage name="budget_number_installments" component="div" className="text-danger" />
            </Col>

            <Col xs="6" className="mb-3">
              <Form.Label>
                <strong>Data do vencimento da primeira parcela</strong>
              </Form.Label>
              <Field type="date" name="budget_due_first_installment" />
              <ErrorMessage name="budget_due_first_installment" component="div" className="text-danger" />
            </Col>
          </Row>

          <Row>
            <Col xs="6" className="mb-3">
              <Form.Label>
                <strong>Entrada</strong>
              </Form.Label>
              <Field type="text" name="budget_entry_payment" />
              <ErrorMessage name="budget_entry_payment" component="div" className="text-danger" />
            </Col>

            <Col xs="6" className="mb-3">
              <Form.Label>
                <strong>Data da entrada</strong>
              </Form.Label>
              <Field type="date" name="budget_entry_payment" />
              <ErrorMessage name="budget_entry_payment" component="div" className="text-danger" />
            </Col>
          </Row>
          <div className="text-center">
            <AsyncButton type="submit">Salvar</AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalPaymentConditions;