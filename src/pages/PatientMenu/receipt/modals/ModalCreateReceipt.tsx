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
  patient_id: number;
  patient_name: string;
  cpf_cnpj_do_patient: string;
  receipt_value: string;
  value_by_extension: string;
  issue_date: string;
  referent_to: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
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

const ModalCreateReceipt  = () => {

  const { id } = useParams();

  const queryClient = useQueryClient();
  const toastId = useRef<React.ReactText>();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const showModal = useCreateAndEditModalStore((state) => state.showModal);
  const selectedReceipt = useCreateAndEditModalStore((state) => state.selectedReceipt);

  
  const validationSchema = Yup.object().shape({
    patient_name: Yup.string().nullable().required('Insira uma nome válido.'),
    cpf_cnpj_do_patient: Yup.string().nullable().required('Insira um CPF ou CNPJ válido.'),
    receipt_value: Yup.string().nullable().required('Insira um valor válido'),
    value_by_extension: Yup.string().nullable().required('Insira um valor por extenso válido'),
    issue_date: Yup.string().nullable().required('Insira uma data válida'),
    referent_to: Yup.string().nullable().required('Insira uma referencia válida'),
    cep: Yup.string().nullable().required('Insira um cep válido'),
    state: Yup.string().nullable().required('Insira um estado válido'),
    city: Yup.string().nullable().required('Insira uma cidade válida'),
    neighborhood: Yup.string().nullable().required('Insira um bairro válido'),
    street: Yup.string().nullable().required('Insira uma rua válida'),
    number: Yup.string().nullable().required('Insira um número válido'),
  });

  const initialValues = {
  patient_id: 0, 
  patient_name: '', 
  cpf_cnpj_do_patient: '', 
  receipt_value: '', 
  value_by_extension: '', 
  issue_date: '', 
  referent_to: '', 
  cep: '', 
  state: '', 
  city: '', 
  neighborhood: '', 
  street: '', 
  number: '', 
};

  const onSubmit = async (values: FormValues) => {
    try {
      let certificateId = '';
      setIsSaving(true);

      if (!id) throw new Error('patient_id (id) is not defined');

      if (selectedReceipt?.id) {
        const result = await updateReceipt({ ...selectedReceipt, ...values }, queryClient);

        if (result === false) throw new Error('Error updating assessment');

        certificateId = selectedReceipt.id;
      } else {
        const result = await addReceipt({ ...values, patient_id: +id }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        certificateId = result.id;
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
    formik.setFieldValue('cep', maskedZipCode); // Access setFieldValue through formik object

    if (maskedZipCode.length === 9) {
      try {
        const numericZipCode = maskedZipCode.replace('-', '');
        const response = await axios.get(`https://viacep.com.br/ws/${numericZipCode}/json/`);
        const { uf, localidade, bairro, logradouro } = response.data;

        formik.setFieldValue('state', uf);
        formik.setFieldValue('city', localidade);
        formik.setFieldValue('neighborhood', bairro);
        formik.setFieldValue('street', logradouro);
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
      inputVal = (inputVal.length > 2 ? inputVal.slice(0, inputVal.length - 2) + ',' + inputVal.slice(inputVal.length - 2) : inputVal);
      inputVal = inputVal.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    formik.setFieldValue('receipt_value', inputVal);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const certificateId = await onSubmit(values);
    
      toastId.current = notify('Gerando pdf do recibo, por favor aguarde...', 'Sucesso', 'check', 'success', true);

      try {
        console.log('certificateId', certificateId);
        if(!certificateId) throw new Error('certificateId is not defined');
        
        const { data } = await api.get(
          '/recibo-pdf/' + certificateId,
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/pdf',
            },
          }
        );
  
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

    toastId.current = notify("Gerando pdf do recibo, por favor aguarde...", 'Sucesso', 'check', 'success', true);

    try {
      if(!certificateId) return;

      await api.post('/recibo-email/' + certificateId);

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
      const { patient_id, patient_name, cpf_cnpj_do_patient, receipt_value, value_by_extension,issue_date, referent_to, cep, state, city, neighborhood, street , number } = selectedReceipt;
      setValues({ patient_id, patient_name, cpf_cnpj_do_patient, receipt_value, value_by_extension,issue_date, referent_to, cep, state, city, neighborhood, street , number  });
    } else {
      setValues(initialValues);
    }
  }, [selectedReceipt]);
  
  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton> <Modal.Title>Emita um recibo para o paciente</Modal.Title></Modal.Header>
      <Modal.Body>
        <div className='mb-2 text-end' >
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Envie o PDF do recibo para o e-mail do paciente</Tooltip>}>
            <span>
              <AsyncButton isSaving={isSendingEmail} loadingText=' ' onClickHandler={handleSendToEmail} type="button" variant="outline-primary" size="sm" className='me-1'>
                <Icon.Send />
              </AsyncButton>
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Crie um PDF do recibo do paciente</Tooltip>}>
            <span>
              <AsyncButton isSaving={isGeneratingPdf} loadingText=' ' onClickHandler={handleDownloadPdf} type="button" variant="outline-primary" size="sm">
                <Icon.Printer />
              </AsyncButton>
            </span>
          </OverlayTrigger>
        </div>

        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className='d-flex'>
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control type="text"
                name="patient_name"
                value={values.patient_name}
                onChange={handleChange} />
              <Form.Label>NOME DO PACIENTE</Form.Label>
              {errors.patient_name && touched.patient_name && <div className="error">{errors.patient_name}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control
                type="text"
                name="cpf_cnpj_do_patient"
                value={values.cpf_cnpj_do_patient}
                onChange={handleCPFOrCNPJChange}
              />
              <Form.Label>CPF OU CNPJ DO PACIENTE</Form.Label>
              {errors.cpf_cnpj_do_patient && touched.cpf_cnpj_do_patient && (
                <div className="error">{errors.cpf_cnpj_do_patient}</div>
              )}
            </Col>
          </div>

          <div className='d-flex'>
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control
                type="text"
                name="receipt_value"
                value={formik.values.receipt_value}
                onChange={handleCurrencyChange}
              />
              <Form.Label>VALOR R$</Form.Label>
              {formik.errors.receipt_value && formik.touched.receipt_value && <div className="error">
                {formik.errors.receipt_value}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control
                type="text"
                name="value_by_extension"
                value={values.value_by_extension}
                onChange={handleChange} />
              <Form.Label>VALOR POR EXTENSO</Form.Label>
              {errors.value_by_extension && touched.value_by_extension && <div className="error">
                {errors.value_by_extension}</div>}
            </Col>
          </div>

          <div className='d-flex'>
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control
                type="text"
                name="issue_date"
                value={formik.values.issue_date}
                onChange={handleDateChange}
              />
              <Form.Label>DATA DA EMISSÃO</Form.Label>
              {formik.errors.issue_date && formik.touched.issue_date && <div className="error">
                {formik.errors.issue_date}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control
                type="text"
                name="referent_to"
                value={values.referent_to}
                onChange={handleChange} />
              <Form.Label>REFERENTE A</Form.Label>
              {errors.referent_to && touched.issue_date && <div className="error">
                {errors.referent_to}</div>}
            </Col>
          </div>

          <div className='d-flex'>
            <Col md={6} className="mb-3 top-label">
              <Form.Control
                type="text"
                name="cep"
                value={values.cep}
                onChange={handleZipCodeChange} />
              <Form.Label>CEP</Form.Label>
              {errors.cep && touched.cep && <div className="error">
                {errors.cep}</div>}
            </Col>
          </div>

          <div className='d-flex'>
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control
                type="text"
                name="state"
                value={values.state}
                onChange={handleChange} />
              <Form.Label>ESTADO</Form.Label>
              {errors.state && touched.state && <div className="error">
                {errors.state}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control
                type="text"
                name="city"
                value={values.city}
                onChange={handleChange} />
              <Form.Label>CIDADE</Form.Label>
              {errors.city && touched.city && <div className="error">{
                errors.city}</div>}
            </Col>
          </div>

          <div className='d-flex'>
            <Col md={5} className="mb-3 top-label me-2">
              <Form.Control
                type="text"
                name="neighborhood"
                value={values.neighborhood}
                onChange={handleChange} />
              <Form.Label>BAIRRO</Form.Label>
              {errors.neighborhood && touched.neighborhood && <div className="error">
                {errors.neighborhood}</div>}
            </Col>

            <Col md={5} className="mb-3 top-label me-1">
              <Form.Control
                type="text"
                name="street"
                value={values.street}
                onChange={handleChange} />
              <Form.Label>RUA</Form.Label>
              {errors.street && touched.street && <div className="error">
                {errors.street}</div>}
            </Col>

            <Col md={2} className="mb-3 top-label">
              <Form.Control
                type="text"
                name="number"
                value={values.number}
                onChange={handleChange} />
              <Form.Label>Nº</Form.Label>
              {errors.number && touched.number && <div className="error">
                {errors.number}</div>}
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
