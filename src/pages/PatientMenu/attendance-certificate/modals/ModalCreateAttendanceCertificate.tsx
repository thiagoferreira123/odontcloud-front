import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Col, Form, Modal, Tooltip } from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import { useCreateAndEditModalStore } from '../hooks/CreateAndEditModalStore';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { PatternFormat } from 'react-number-format';
import AsyncButton from '../../../../components/AsyncButton';
import { notify, updateNotify } from '../../../../components/toast/NotificationIcon';
import api from '../../../../services/useAxios';
import { downloadPDF } from '../../../../helpers/PdfHelpers';
import { OverlayTrigger } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import useCertificateStore from '../hooks/CertificateStore';
import { AppException } from '../../../../helpers/ErrorHelpers';

interface FormValues {
  patient_name: string;
  cpf_cnpj_do_patient: string;
  permanence_start: string;
  permanencia_end: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  date_issue: string;
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


const ModalCreateAttendanceCertificate = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const toastId = useRef<React.ReactText>();

  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const showModal = useCreateAndEditModalStore((state) => state.showModal);
  const selectedCertificate = useCreateAndEditModalStore((state) => state.selectedCertificate);

  const validationSchema = Yup.object().shape({
    patient_name: Yup.string().nullable().required('Insira uma nome válido.'),
    cpf_cnpj_do_patient: Yup.string().nullable().required('Insira um CPF ou CNPJ válido.'),
    date_issue: Yup.string().nullable().required('Insira uma data válida'),
    permanence_start: Yup.string().nullable().required('Insira uma permanência válida'),
    permanencia_end: Yup.string().nullable().required('Insira uma permanência válida'),
    cep: Yup.string().nullable().required('Insira um cep válido'),
    state: Yup.string().nullable().required('Insira um estado válido'),
    city: Yup.string().nullable().required('Insira uma cidade válida'),
    neighborhood: Yup.string().nullable().required('Insira um bairro válido'),
    street: Yup.string().nullable().required('Insira uma rua válida'),
    number: Yup.string().nullable().required('Insira um número válido'),
  });

  const initialValues: FormValues = {
    patient_name: '',
    cpf_cnpj_do_patient: '',
    permanence_start: '',
    permanencia_end: '',
    cep: '',
    state: '',
    city: '',
    neighborhood: '',
    street: '',
    number: '',
    date_issue: '',
  };

  const onSubmit = async (values: FormValues) => {
    try {
      let certificateId = '';
      setIsSaving(true);

      if (!id) throw new AppException('patient_id (id) is not defined');

      if (selectedCertificate?.id) {
        const result = await updateCertificate({ ...selectedCertificate, ...values }, queryClient);

        certificateId = selectedCertificate.id;

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addCertificate({ ...values, patient_id: +id }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        certificateId = result.id;
      }

      hideModal();
      resetForm();

      setIsSaving(false);
      setIsGeneratingPdf(false);
      setIsSendingEmail(false);
      hideModal();

      return certificateId;
    } catch (error) {

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      setIsSaving(false);
      setIsGeneratingPdf(false);
      setIsSendingEmail(false);
      console.error(error);
      return 0;
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, resetForm, setValues, values, touched, errors } = formik;
  const { hideModal } = useCreateAndEditModalStore();
  const { addCertificate, updateCertificate } = useCertificateStore();

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

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const certificateId = await onSubmit(values);

      toastId.current = notify('Gerando pdf do atestado, por favor aguarde...', 'Sucesso', 'check', 'success', true);

      try {
        if(!certificateId) return;

        const { data } = await api.get(
          '/atestado-pdf/' + certificateId,
          {
            responseType: 'arraybuffer',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/pdf',
            },
          }
        );

        downloadPDF(data, 'atestado-' + certificateId);

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

    toastId.current = notify("Gerando pdf do atestado, por favor aguarde...", 'Sucesso', 'check', 'success', true);

    try {
      if(!certificateId) return;

      await api.post('/atestado-email/' + certificateId);

      updateNotify(toastId.current, 'E-mail enviado com sucesso!', 'Sucesso', 'check', 'success');

      setIsSendingEmail(false);
    } catch (error) {
      setIsSendingEmail(false);
      updateNotify(toastId.current, 'Erro ao enviar e-mails!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedCertificate) {
      const { patient_name, cpf_cnpj_do_patient, permanence_start, permanencia_end, cep, state, city, neighborhood, street, number, date_issue } = selectedCertificate;
      setValues({ patient_name, cpf_cnpj_do_patient, permanence_start, permanencia_end, cep, state, city, neighborhood, street, number, date_issue });
    } else {
      setValues(initialValues);
    }
  }, [selectedCertificate]);

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton> <Modal.Title>Emita atestados para o paciente</Modal.Title></Modal.Header>
      <Modal.Body className="mt-4" >
        <div className='mb-2 text-end' >
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Envie o PDF do atestado para o e-mail do paciente</Tooltip>}>
            <span>
              <AsyncButton isSaving={isSendingEmail} loadingText=' ' onClickHandler={handleSendToEmail} type="button" variant="outline-primary" size="sm" className='me-1'>
                <Icon.Send />
              </AsyncButton>
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Crie um PDF do atestado do paciente</Tooltip>}>
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
              <Form.Control type="text" name="patient_name" value={values.patient_name} onChange={handleChange} />
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
            <Col md={4} className="mb-3 top-label me-2">
              <PatternFormat
                className="form-control"
                name="date_issue"
                format="##/##/####"
                mask="_"
                placeholder="DD/MM/YYYY"
                // allowEmptyFormatting="true"
                value={values.date_issue}
                onChange={handleChange}
              />
              <Form.Label>DATA</Form.Label>
              {errors.date_issue && touched.date_issue && <div className="error">{errors.date_issue}</div>}
            </Col>

            <Col md={4} className="mb-3 top-label me-2">
              <PatternFormat
                className="form-control"
                name="permanence_start"
                format="##:##"
                mask="_"
                placeholder="00:00"
                value={values.permanence_start}
                onChange={handleChange}
              />
              <Form.Label>INICIO ATENDIMENTO</Form.Label>
              {errors.permanence_start && touched.permanence_start && <div className="error">{errors.permanence_start}</div>}
            </Col>

            <Col md={4} className="mb-3 top-label me-2">
              <PatternFormat
                className="form-control"
                name="permanencia_end"
                format="##:##"
                mask="_"
                placeholder="00:00"
                value={values.permanencia_end}
                onChange={handleChange}
              />
              <Form.Label>FIM ATENDIMENTO</Form.Label>
              {errors.permanencia_end && touched.permanencia_end && <div className="error">{errors.permanencia_end}</div>}
            </Col>
          </div>

          <div className='d-flex'>
            <Col md={6} className="mb-3 top-label">
            <Form.Control type="text" name="cep" value={values.cep} onChange={handleZipCodeChange} />
            <Form.Label>CEP</Form.Label>
            {errors.cep && touched.cep && <div className="error">{errors.cep}</div>}
            </Col>
          </div>


          <div className='d-flex'>
            <Col md={6} className="mb-3 top-label me-2">
            <Form.Control type="text" name="state" value={values.state} onChange={handleChange} />
            <Form.Label>ESTADO</Form.Label>
            {errors.state && touched.state && <div className="error">{errors.state}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
            <Form.Control type="text" name="city" value={values.city} onChange={handleChange} />
            <Form.Label>CIDADE</Form.Label>
            {errors.city && touched.city && <div className="error">{errors.city}</div>}
            </Col>
          </div>

          <div className='d-flex'>
            <Col md={5} className="mb-3 top-label me-2">
            <Form.Control type="text" name="neighborhood" value={values.neighborhood} onChange={handleChange} />
            <Form.Label>BAIRRO</Form.Label>
            {errors.neighborhood && touched.neighborhood && <div className="error">{errors.neighborhood}</div>}
            </Col>

            <Col md={5} className="mb-3 top-label me-1">
            <Form.Control type="text" name="street" value={values.street} onChange={handleChange} />
            <Form.Label>RUA</Form.Label>
            {errors.street && touched.street && <div className="error">{errors.street}</div>}
            </Col>

            <Col md={2} className="mb-3 top-label">
            <Form.Control type="text" name="number" value={values.number} onChange={handleChange} />
            <Form.Label>Nº</Form.Label>
            {errors.number && touched.number && <div className="error">{errors.number}</div>}
            </Col>
          </div>

          <div className="text-center mt-3">
            <AsyncButton isSaving={isSaving} type="submit" variant="primary" className='me-2'>
              Salvar atestado
            </AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateAttendanceCertificate;
