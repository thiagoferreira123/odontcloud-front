import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Col, Form, Modal, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import * as Yup from 'yup';
import { PaymentMethod, Transaction, TransactionCategory, TransactionType } from '../../hooks/TransactionStore/types';
import useTransactionStore from '../../hooks/TransactionStore';
import { useCreateTransactionModalStore } from '../../hooks/EditModalStore';
import { useQueryClient } from '@tanstack/react-query';
import CategorySelect from './CategorySelect';
import PaymentMethodSelect from './PaymentMethodSelect';
import AsyncButton from '../../../../components/AsyncButton';
import { useFiltersStore } from '../../hooks/FiltersStore';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from 'date-fns/locale/pt-BR';
registerLocale('pt-BR', ptBR);

export interface CreateTransactionModalFormValues {
  description: string;
  value: string;
  observation: string;
  date: string;
  transaction_type: TransactionType | '';
  paymentMethod: PaymentMethod | null;
  category: TransactionCategory | null;
}

const CreateTransactionModal = () => {
  const queryClient = useQueryClient();

  const showModal = useCreateTransactionModalStore((state) => state.showModal);
  const selectedTransaction = useCreateTransactionModalStore((state) => state.selectedTransaction);

  const selectedMonth = useFiltersStore((state) => state.selectedMonth);
  const selectedYear = useFiltersStore((state) => state.selectedYear);

  const [isSaving, setIsSaving] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Insira uma descrição válida.'),
    value: Yup.string().required('Insira um valor válido.'),
    transaction_type: Yup.string().required('Selecione uma categoria válida.'),
    observation: Yup.string(),
    date: Yup.string().required('Insira uma data válida.'),
    paymentMethod: Yup.object()
      .shape({
        payment_form: Yup.string().required('Insira uma forma de pagamento válida.'),
      })
      .required('Insira uma forma de pagamento válida.'),
    category: Yup.object()
      .shape({
        category: Yup.string().required('Insira uma categoria válida.'),
      })
      .required('Insira uma categoria válida.'),
  });

  const initialValues: CreateTransactionModalFormValues = {
    description: '',
    value: '',
    transaction_type: '',
    observation: '',
    date: '',
    category: null,
    paymentMethod: null,
  };

  const onSubmit = async (values: CreateTransactionModalFormValues) => {
    try {
      if (!values.category) return console.error('Categoria inválida');

      setIsSaving(true);

      if (selectedTransaction?.id) {
        const response = await updateTransaction(
          { ...(values as Partial<Transaction>), id: selectedTransaction.id },
          selectedMonth?.value ?? '',
          selectedYear?.value ?? '',
          queryClient
        );

        if (response === false) throw new Error('Erro ao atualizar transação');
      } else {
        const response = await addTransaction(values as Partial<Transaction>, selectedMonth?.value ?? '', selectedYear?.value ?? '', queryClient);

        if (response === false) throw new Error('Erro ao adicionar transação');
      }

      setIsSaving(false);
      hideModal();
      resetForm();
    } catch (error) {
      setIsSaving(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, resetForm, values, touched, errors } = formik;
  const { addTransaction, updateTransaction } = useTransactionStore();
  const { hideModal } = useCreateTransactionModalStore();

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = event.target.value;
    inputVal = inputVal.replace(/\D/g, '').replace(/^0+/, '');
    if (inputVal) {
      inputVal = inputVal.length > 2 ? inputVal.slice(0, inputVal.length - 2) + ',' + inputVal.slice(inputVal.length - 2) : inputVal;
      inputVal = inputVal.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    formik.setFieldValue('value', inputVal);
  };

  useEffect(() => {
    if (selectedTransaction) {
      setStartDate(new Date(selectedTransaction.date));
      formik.setValues({
        description: selectedTransaction.description,
        value: Number(selectedTransaction.value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$ ', ''),
        transaction_type: selectedTransaction.transaction_type,
        observation: selectedTransaction.observation,
        date: selectedTransaction.date,
        category: selectedTransaction.category,
        paymentMethod: selectedTransaction.paymentMethod,
      });
    } else {
      resetForm();
      setStartDate(null);
    }
  }, [selectedTransaction]);

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Adicione uma transação ao seu controle financeiro</Modal.Title>
      </Modal.Header>

      <Modal.Body className="mt-4">
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="d-flex">
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control type="text" name="description" value={formik.values.description} onChange={handleChange} />
              <Form.Label>DESCRIÇÃO DA TRANSAÇÃO</Form.Label>
              {formik.errors.description && formik.touched.description && <div className="error">{formik.errors.description}</div>}
            </Col>

            <Col md={3} className="mb-3 top-label me-2">
              <Form.Control type="text" name="value" value={formik.values.value} onChange={handleCurrencyChange} onBlur={formik.handleBlur} />
              <Form.Label>VALOR</Form.Label>
              {formik.errors.value && formik.touched.value && <div className="error">{formik.errors.value}</div>}
            </Col>

            <Col md={3} className="mb-3 me-2">
              <div className="top-label transform-up-3">
                {formik.errors.transaction_type && formik.touched.transaction_type && <div className="error">{formik.errors.transaction_type}</div>}
              </div>
              <ToggleButtonGroup type="radio" className="d-block" name="buttonOptions2" value={values.transaction_type}>
                <ToggleButton
                  id="tbg-radio-3"
                  value={'entrada'}
                  variant="outline-primary"
                  onChange={() => setFieldValue('transaction_type', 'entrada')}
                >
                  Entrada
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-4"
                  value={'saida'}
                  variant="outline-secondary"
                  onChange={() => setFieldValue('transaction_type', 'saida')}
                >
                  Saída
                </ToggleButton>
              </ToggleButtonGroup>
            </Col>
          </div>

          <div className="d-flex">
            <Col md={4} className="mb-3 top-label me-2">
              <DatePicker
                className="form-control"
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setFieldValue('date', date ? date.toISOString() : '');
                }}
                locale="pt-BR"
                dateFormat="dd/MM/yyyy"
              />
              <Form.Label>DATA DA TRANSAÇÃO</Form.Label>
              {formik.errors.date && formik.touched.date && <div className="error">{formik.errors.date}</div>}
            </Col>

            <Col md={4} className="mb-3 top-label me-2">
              <CategorySelect formik={formik} />
              <Form.Label>CATEGORIA</Form.Label>
              {formik.errors.category && formik.touched.category && <div className="error">{formik.errors.category}</div>}
            </Col>

            <Col md={4} className="mb-3 top-label me-2">
              <PaymentMethodSelect formik={formik} />
              <Form.Label>FORMA DE PAGAMENTO</Form.Label>
              {formik.errors.paymentMethod && formik.touched.paymentMethod && <div className="error">{formik.errors.paymentMethod}</div>}
            </Col>
          </div>

          <div>
            <Col className="mb-3 top-label">
              <Form.Control type="text" as="textarea" rows={3} name="observation" value={formik.values.observation} onChange={handleChange} />
              <Form.Label>OBSERVAÇÃO</Form.Label>
              {formik.errors.observation && formik.touched.observation && <div className="error">{formik.errors.observation}</div>}
            </Col>
          </div>

          <div className="text-center mt-3">
            <AsyncButton isSaving={isSaving} type="submit" variant="primary" className="me-2">
              Salvar transação
            </AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTransactionModal;
