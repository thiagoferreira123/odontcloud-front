import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Col, Form, Modal, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import * as Yup from 'yup';
import { Transaction, TransactionType } from '../../hooks/TransactionStore/types';
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
import { parseToBrValue } from '../../../../helpers/StringHelpers';
registerLocale('pt-BR', ptBR);

export interface CreateTransactionModalFormValues {
  financial_control_description: string;
  financial_control_value: string;
  financial_control_observation: string;
  financial_control_date: string;
  financial_control_entry_or_exit: TransactionType | '';
  financial_control_payment_method: string;
  financial_control_category: string;
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
    financial_control_description: Yup.string().required('Insira uma descrição válida.'),
    financial_control_value: Yup.string().required('Insira um valor válido.'),
    financial_control_entry_or_exit: Yup.string().required('Selecione uma categoria válida.'),
    financial_control_observation: Yup.string(),
    financial_control_date: Yup.string().required('Insira uma data válida.'),
    financial_control_payment_method: Yup.string().required('Insira um método de pagamento válido.'),
    financial_control_category: Yup.string().required('Insira uma categoria válida.'),
  });

  const initialValues: CreateTransactionModalFormValues = {
    financial_control_description: '',
    financial_control_value: '',
    financial_control_observation: '',
    financial_control_date: '',
    financial_control_entry_or_exit: '',
    financial_control_payment_method: '',
    financial_control_category: '',
  };

  const onSubmit = async (values: CreateTransactionModalFormValues) => {
    try {
      if (!values.financial_control_category) return console.error('Categoria inválida');

      setIsSaving(true);

      if (selectedTransaction?.financial_control_id) {
        const response = await updateTransaction(
          { ...(values as Partial<Transaction>), financial_control_id: selectedTransaction.financial_control_id },
          selectedMonth?.value ?? '',
          selectedYear?.value ?? '',
          queryClient
        );

        if (response === false) throw new Error('Erro ao atualizar transação');
      } else {
        const response = await addTransaction(values as Partial<Transaction>, queryClient);

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
    formik.setFieldValue('financial_control_value', inputVal);
  };

  useEffect(() => {
    if (selectedTransaction) {
      setStartDate(new Date(selectedTransaction.financial_control_date));
      formik.setValues({
        financial_control_description: selectedTransaction.financial_control_description,
        financial_control_value: parseToBrValue(selectedTransaction.financial_control_value).replace('R$', ''),
        financial_control_entry_or_exit: selectedTransaction.financial_control_entry_or_exit,
        financial_control_observation: selectedTransaction.financial_control_observation ?? '',
        financial_control_date: selectedTransaction.financial_control_date,
        financial_control_category: selectedTransaction.financial_control_category,
        financial_control_payment_method: selectedTransaction.financial_control_payment_method,
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
              <Form.Control type="text" name="financial_control_description" value={formik.values.financial_control_description} onChange={handleChange} />
              <Form.Label>DESCRIÇÃO DA TRANSAÇÃO</Form.Label>
              {formik.errors.financial_control_description && formik.touched.financial_control_description && (
                <div className="error">{formik.errors.financial_control_description}</div>
              )}
            </Col>

            <Col md={3} className="mb-3 top-label me-2">
              <Form.Control
                type="text"
                name="financial_control_value"
                value={formik.values.financial_control_value}
                onChange={handleCurrencyChange}
                onBlur={formik.handleBlur}
              />
              <Form.Label>VALOR</Form.Label>
              {formik.errors.financial_control_value && formik.touched.financial_control_value && (
                <div className="error">{formik.errors.financial_control_value}</div>
              )}
            </Col>

            <Col md={3} className="mb-3 me-2">
              <div className="top-label transform-up-3">
                {formik.errors.financial_control_entry_or_exit && formik.touched.financial_control_entry_or_exit && (
                  <div className="error">{formik.errors.financial_control_entry_or_exit}</div>
                )}
              </div>
              <ToggleButtonGroup type="radio" className="d-block" name="buttonOptions2" value={values.financial_control_entry_or_exit}>
                <ToggleButton
                  id="tbg-radio-3"
                  value={'entrance'}
                  variant="outline-primary"
                  onChange={() => setFieldValue('financial_control_entry_or_exit', 'entrance')}
                >
                  Entrada
                </ToggleButton>
                <ToggleButton
                  id="tbg-radio-4"
                  value={'output'}
                  variant="outline-secondary"
                  onChange={() => setFieldValue('financial_control_entry_or_exit', 'output')}
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
                  setFieldValue('financial_control_date', date ? date.toISOString() : '');
                }}
                locale="pt-BR"
                dateFormat="dd/MM/yyyy"
              />
              <Form.Label>DATA DA TRANSAÇÃO</Form.Label>
              {formik.errors.financial_control_date && formik.touched.financial_control_date && (
                <div className="error">{formik.errors.financial_control_date}</div>
              )}
            </Col>

            <Col md={4} className="mb-3 top-label me-2">
              <CategorySelect formik={formik} />
              <Form.Label>CATEGORIA</Form.Label>
              {formik.errors.financial_control_category && formik.touched.financial_control_category && (
                <div className="error">{formik.errors.financial_control_category}</div>
              )}
            </Col>

            <Col md={4} className="mb-3 top-label me-2">
              <PaymentMethodSelect formik={formik} />
              <Form.Label>FORMA DE PAGAMENTO</Form.Label>
              {formik.errors.financial_control_payment_method && formik.touched.financial_control_payment_method && (
                <div className="error">{formik.errors.financial_control_payment_method}</div>
              )}
            </Col>
          </div>

          <div>
            <Col className="mb-3 top-label">
              <Form.Control
                type="text"
                as="textarea"
                rows={3}
                name="financial_control_observation"
                value={formik.values.financial_control_observation}
                onChange={handleChange}
              />
              <Form.Label>OBSERVAÇÃO</Form.Label>
              {formik.errors.financial_control_observation && formik.touched.financial_control_observation && (
                <div className="error">{formik.errors.financial_control_observation}</div>
              )}
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
