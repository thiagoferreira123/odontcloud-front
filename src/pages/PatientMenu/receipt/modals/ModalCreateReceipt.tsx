import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Col, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import * as Icon from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateAndEditModalStore } from '../hooks/CreateAndEditModalStore';
import useReceiptStore from '../hooks/ReceiptStore';
import AsyncButton from '../../../../components/AsyncButton';
import { notify, updateNotify } from '../../../../components/toast/NotificationIcon';
import { downloadPDF } from '../../../../helpers/PdfHelpers';
import api from '../../../../services/useAxios';

interface ModalCreateReceipt {
  showModal: boolean;
  onClose: () => void;
}

interface FormValues {
  receipt_patient_id: string;
  receipt_patient_name: string;
  receipt_cpf_or_cnpj: string;
  receipt_receipt_value: string;
  receipt_value_in_extension: string;
  receipt_date_emission: string;
  receipt_referent_a: string;
  receipt_cep: string;
  receipt_state: string;
  receipt_city: string;
  receipt_neighborhood: string;
  receipt_street: string;
  receipt_number: string;
}

const maskCPFOrCNPJ = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

const applyZipCodeMask = (zipCode: string) => {
  return zipCode.replace(/\D/g, '').replace(/^(\d{5})(\d{3})/, '$1-$2');
};

const formatDate = (value: string): string => {
  const onlyNums = value.replace(/\D/g, '');
  if (onlyNums.length <= 2) {
    return onlyNums;
  }
  if (onlyNums.length <= 4) {
    return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2)}`;
  }
  return `${onlyNums.slice(0, 2)}/${onlyNums.slice(2, 4)}/${onlyNums.slice(4, 8)}`;
};

const ModalCreateReceipt = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const toastId = useRef<React.ReactText>();

  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const showModal = useCreateAndEditModalStore((receipt_state) => receipt_state.showModal);
  const selectedReceipt = useCreateAndEditModalStore((receipt_state) => receipt_state.selectedReceipt);

  const validationSchema = Yup.object().shape({
    receipt_patient_name: Yup.string().nullable().required('Insira uma nome válido.'),
    receipt_cpf_or_cnpj: Yup.string().nullable().required('Insira um CPF ou CNPJ válido.'),
    receipt_receipt_value: Yup.string().nullable().required('Insira um valor válido'),
    receipt_value_in_extension: Yup.string().nullable().required('Insira um valor por extenso válido'),
    receipt_date_emission: Yup.string().nullable().required('Insira uma data válida'),
    receipt_referent_a: Yup.string().nullable().required('Insira uma referencia válida'),
    receipt_cep: Yup.string().nullable().required('Insira um receipt_cep válido'),
    receipt_state: Yup.string().nullable().required('Insira um estado válido'),
    receipt_city: Yup.string().nullable().required('Insira uma cidade válida'),
    receipt_neighborhood: Yup.string().nullable().required('Insira um bairro válido'),
    receipt_street: Yup.string().nullable().required('Insira uma rua válida'),
    receipt_number: Yup.string().nullable().required('Insira um número válido'),
  });

  const initialValues = {
    receipt_patient_id: '',
    receipt_patient_name: '',
    receipt_cpf_or_cnpj: '',
    receipt_receipt_value: '',
    receipt_value_in_extension: '',
    receipt_date_emission: '',
    receipt_referent_a: '',
    receipt_cep: '',
    receipt_state: '',
    receipt_city: '',
    receipt_neighborhood: '',
    receipt_street: '',
    receipt_number: '',
  };

  const onSubmit = async (values: FormValues) => {
    try {
      let certificateId = '';
      setIsSaving(true);

      if (!id) throw new Error('receipt_patient_id (id) is not defined');

      if (selectedReceipt?.receipt_id) {
        const result = await updateReceipt({ ...selectedReceipt, ...values }, queryClient);

        if (result === false) throw new Error('Error updating assessment');

        certificateId = selectedReceipt.receipt_id;
      } else {
        const result = await addReceipt({ ...values, receipt_patient_id: id }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        certificateId = result.receipt_id;
      }

      hideModal();
      resetForm();

      setIsSaving(false);
      hideModal();
      return certificateId;
    } catch (error) {
      setIsSaving(false);
      setIsGeneratingPdf(false);
      setIsSendingEmail(false);
      console.error(error);
      return '';
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, resetForm, setValues, values, touched, errors } = formik;
  const { hideModal } = useCreateAndEditModalStore();
  const { addReceipt, updateReceipt } = useReceiptStore();

  const handleCPFOrCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const maskedValue = maskCPFOrCNPJ(value);
    setFieldValue(name, maskedValue);
  };

  const handleZipCodeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawZipCode = event.target.value;
    const maskedZipCode = applyZipCodeMask(rawZipCode);
    formik.setFieldValue('receipt_cep', maskedZipCode); // Access setFieldValue through formik object

    if (maskedZipCode.length === 9) {
      try {
        const numericZipCode = maskedZipCode.replace('-', '');
        const response = await axios.get(`https://viacep.com.br/ws/${numericZipCode}/json/`);
        const { uf, localidade, bairro, logradouro } = response.data;

        formik.setFieldValue('receipt_state', uf);
        formik.setFieldValue('receipt_city', localidade);
        formik.setFieldValue('receipt_neighborhood', bairro);
        formik.setFieldValue('receipt_street', logradouro);
      } catch (error) {
        console.error('Error fetching zip code', error);
      }
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const formattedValue = formatDate(value);
    formik.setFieldValue(name, formattedValue);
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = event.target.value;
    inputVal = inputVal.replace(/\D/g, '').replace(/^0+/, '');
    if (inputVal) {
      inputVal = inputVal.length > 2 ? inputVal.slice(0, inputVal.length - 2) + ',' + inputVal.slice(inputVal.length - 2) : inputVal;
      inputVal = inputVal.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    formik.setFieldValue('receipt_receipt_value', inputVal);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const certificateId = await onSubmit(values);

    toastId.current = notify('Gerando pdf do recibo, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      if (!certificateId) throw new Error('certificateId is not defined');

      const { data } = await api.get('/receipt-pdf/' + certificateId, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Acreceipt_cept: 'application/pdf',
        },
      });

      downloadPDF(data, 'recibo-' + certificateId);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleSendToEmail = async () => {
    setIsSendingEmail(true);
    const certificateId = await onSubmit(values);

    toastId.current = notify('Gerando pdf do recibo, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      if (!certificateId) return;

      await api.post('/receipt-email/' + certificateId);

      updateNotify(toastId.current, 'E-mail enviado com sucesso!', 'Sucesso', 'check', 'success');

      setIsSendingEmail(false);
    } catch (error) {
      setIsSendingEmail(false);
      updateNotify(toastId.current, 'Erro ao enviar e-mails!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedReceipt) {
      const {
        receipt_patient_id,
        receipt_patient_name,
        receipt_cpf_or_cnpj,
        receipt_receipt_value,
        receipt_value_in_extension,
        receipt_date_emission,
        receipt_referent_a,
        receipt_cep,
        receipt_state,
        receipt_city,
        receipt_neighborhood,
        receipt_street,
        receipt_number,
      } = selectedReceipt;
      setValues({
        receipt_patient_id,
        receipt_patient_name,
        receipt_cpf_or_cnpj,
        receipt_receipt_value,
        receipt_value_in_extension,
        receipt_date_emission,
        receipt_referent_a,
        receipt_cep,
        receipt_state,
        receipt_city,
        receipt_neighborhood,
        receipt_street,
        receipt_number,
      });
    } else {
      setValues(initialValues);
    }
  }, [selectedReceipt]);

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        {' '}
        <Modal.Title>Emita um recibo para o paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-2 text-end">
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Envie o PDF do recibo para o e-mail do paciente</Tooltip>}>
            <span>
              <AsyncButton
                isSaving={isSendingEmail}
                loadingText=" "
                onClickHandler={handleSendToEmail}
                type="button"
                variant="outline-primary"
                size="sm"
                className="me-1"
              >
                <Icon.Send />
              </AsyncButton>
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Crie um PDF do recibo do paciente</Tooltip>}>
            <span>
              <AsyncButton isSaving={isGeneratingPdf} loadingText=" " onClickHandler={handleDownloadPdf} type="button" variant="outline-primary" size="sm">
                <Icon.Printer />
              </AsyncButton>
            </span>
          </OverlayTrigger>
        </div>

        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="d-flex">
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control type="text" name="receipt_patient_name" value={values.receipt_patient_name} onChange={handleChange} />
              <Form.Label>NOME DO PACIENTE</Form.Label>
              {errors.receipt_patient_name && touched.receipt_patient_name && <div className="error">{errors.receipt_patient_name}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control type="text" name="receipt_cpf_or_cnpj" value={values.receipt_cpf_or_cnpj} onChange={handleCPFOrCNPJChange} />
              <Form.Label>CPF OU CNPJ DO PACIENTE</Form.Label>
              {errors.receipt_cpf_or_cnpj && touched.receipt_cpf_or_cnpj && <div className="error">{errors.receipt_cpf_or_cnpj}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control type="text" name="receipt_receipt_value" value={formik.values.receipt_receipt_value} onChange={handleCurrencyChange} />
              <Form.Label>VALOR R$</Form.Label>
              {formik.errors.receipt_receipt_value && formik.touched.receipt_receipt_value && <div className="error">{formik.errors.receipt_receipt_value}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control type="text" name="receipt_value_in_extension" value={values.receipt_value_in_extension} onChange={handleChange} />
              <Form.Label>VALOR POR EXTENSO</Form.Label>
              {errors.receipt_value_in_extension && touched.receipt_value_in_extension && <div className="error">{errors.receipt_value_in_extension}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control type="text" name="receipt_date_emission" value={formik.values.receipt_date_emission} onChange={handleDateChange} />
              <Form.Label>DATA DA EMISSÃO</Form.Label>
              {formik.errors.receipt_date_emission && formik.touched.receipt_date_emission && <div className="error">{formik.errors.receipt_date_emission}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control type="text" name="receipt_referent_a" value={values.receipt_referent_a} onChange={handleChange} />
              <Form.Label>REFERENTE A</Form.Label>
              {errors.receipt_referent_a && touched.receipt_date_emission && <div className="error">{errors.receipt_referent_a}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col md={6} className="mb-3 top-label">
              <Form.Control type="text" name="receipt_cep" value={values.receipt_cep} onChange={handleZipCodeChange} />
              <Form.Label>CEP</Form.Label>
              {errors.receipt_cep && touched.receipt_cep && <div className="error">{errors.receipt_cep}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control type="text" name="receipt_state" value={values.receipt_state} onChange={handleChange} />
              <Form.Label>ESTADO</Form.Label>
              {errors.receipt_state && touched.receipt_state && <div className="error">{errors.receipt_state}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control type="text" name="receipt_city" value={values.receipt_city} onChange={handleChange} />
              <Form.Label>CIDADE</Form.Label>
              {errors.receipt_city && touched.receipt_city && <div className="error">{errors.receipt_city}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col md={5} className="mb-3 top-label me-2">
              <Form.Control type="text" name="receipt_neighborhood" value={values.receipt_neighborhood} onChange={handleChange} />
              <Form.Label>BAIRRO</Form.Label>
              {errors.receipt_neighborhood && touched.receipt_neighborhood && <div className="error">{errors.receipt_neighborhood}</div>}
            </Col>

            <Col md={5} className="mb-3 top-label me-1">
              <Form.Control type="text" name="receipt_street" value={values.receipt_street} onChange={handleChange} />
              <Form.Label>RUA</Form.Label>
              {errors.receipt_street && touched.receipt_street && <div className="error">{errors.receipt_street}</div>}
            </Col>

            <Col md={2} className="mb-3 top-label">
              <Form.Control type="text" name="receipt_number" value={values.receipt_number} onChange={handleChange} />
              <Form.Label>Nº</Form.Label>
              {errors.receipt_number && touched.receipt_number && <div className="error">{errors.receipt_number}</div>}
            </Col>
          </div>

          <div className="text-center mt-3">
            <AsyncButton isSaving={isSaving} type="submit" variant="primary">
              Salvar recibo
            </AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateReceipt;
