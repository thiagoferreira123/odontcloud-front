import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import { Col, Form, Modal, Tooltip } from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import { useCreateAndEditModalStore } from '../hooks/CreateAndEditModalStore';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import AsyncButton from '../../../../components/AsyncButton';
import { notify, updateNotify } from '../../../../components/toast/NotificationIcon';
import api from '../../../../services/useAxios';
import { downloadPDF } from '../../../../helpers/PdfHelpers';
import { OverlayTrigger } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import useCertificateStore from '../hooks/CertificateStore';
import { AppException } from '../../../../helpers/ErrorHelpers';
import { PatternFormat } from 'react-number-format';

interface FormValues {
  certificate_patient_name: string;
  certificate_cpf_or_cnpj: string;
  certificate_permanence_start: string;
  certificate_permanence_end: string;
  certificate_date_emission: string;
  certificate_cep: string;
  certificate_state: string;
  certificate_city: string;
  certificate_neighborhood: string;
  certificate_street: string;
  certificate_number: string;
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

  const showModal = useCreateAndEditModalStore((certificate_state) => certificate_state.showModal);
  const selectedCertificate = useCreateAndEditModalStore((certificate_state) => certificate_state.selectedCertificate);

  const validationSchema = Yup.object().shape({
    certificate_patient_name: Yup.string().nullable().required('Insira uma nome válido.'),
    certificate_cpf_or_cnpj: Yup.string().nullable().required('Insira um CPF ou CNPJ válido.'),
    certificate_date_emission: Yup.string().nullable().required('Insira uma data válida'),
    certificate_permanence_start: Yup.string().nullable().required('Insira uma permanência válida'),
    certificate_permanence_end: Yup.string().nullable().required('Insira uma permanência válida'),
    certificate_cep: Yup.string().nullable().required('Insira um certificate_cep válido'),
    certificate_state: Yup.string().nullable().required('Insira um estado válido'),
    certificate_city: Yup.string().nullable().required('Insira uma cidade válida'),
    certificate_neighborhood: Yup.string().nullable().required('Insira um bairro válido'),
    certificate_street: Yup.string().nullable().required('Insira uma rua válida'),
    certificate_number: Yup.string().nullable().required('Insira um número válido'),
  });

  const initialValues: FormValues = {
    certificate_patient_name: '',
    certificate_cpf_or_cnpj: '',
    certificate_permanence_start: '',
    certificate_permanence_end: '',
    certificate_cep: '',
    certificate_state: '',
    certificate_city: '',
    certificate_neighborhood: '',
    certificate_street: '',
    certificate_number: '',
    certificate_date_emission: '',
  };

  const onSubmit = async (values: FormValues) => {
    try {
      let certificateId = '';
      setIsSaving(true);

      if (!id) throw new AppException('patient_id (id) is not defined');

      if (selectedCertificate?.certificate_id) {
        const result = await updateCertificate({ ...selectedCertificate, ...values }, queryClient);

        certificateId = selectedCertificate.certificate_id;

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addCertificate({ ...values, certificate_patient_id: id }, queryClient);

        if (!result) throw new Error('Error adding assessment');

        certificateId = result.certificate_id;
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
    formik.setFieldValue('certificate_cep', maskedZipCode); // Access setFieldValue through formik object

    if (maskedZipCode.length === 9) {
      try {
        const numericZipCode = maskedZipCode.replace('-', '');
        const response = await axios.get(`https://viacertificate_cep.com.br/ws/${numericZipCode}/json/`);
        const { uf, localidade, bairro, logradouro } = response.data;

        formik.setFieldValue('certificate_state', uf);
        formik.setFieldValue('certificate_city', localidade);
        formik.setFieldValue('certificate_neighborhood', bairro);
        formik.setFieldValue('certificate_street', logradouro);
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
      if (!certificateId) return;

      const { data } = await api.get('/certificate-pdf/' + certificateId, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accertificate_cept: 'application/pdf',
        },
      });

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

    toastId.current = notify('Gerando pdf do atestado, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      if (!certificateId) return;

      await api.post('/certificate-email/' + certificateId);

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
      const {
        certificate_patient_name,
        certificate_cpf_or_cnpj,
        certificate_permanence_start,
        certificate_permanence_end,
        certificate_cep,
        certificate_state,
        certificate_city,
        certificate_neighborhood,
        certificate_street,
        certificate_number,
        certificate_date_emission,
      } = selectedCertificate;
      setValues({
        certificate_patient_name,
        certificate_cpf_or_cnpj,
        certificate_permanence_start,
        certificate_permanence_end,
        certificate_cep,
        certificate_state,
        certificate_city,
        certificate_neighborhood,
        certificate_street,
        certificate_number,
        certificate_date_emission,
      });
    } else {
      setValues(initialValues);
    }
  }, [selectedCertificate]);

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        {' '}
        <Modal.Title>Emita atestados para o paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mt-4">
        <div className="mb-2 text-end">
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Envie o PDF do atestado para o e-mail do paciente</Tooltip>}>
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
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Crie um PDF do atestado do paciente</Tooltip>}>
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
              <Form.Control type="text" name="certificate_patient_name" value={values.certificate_patient_name} onChange={handleChange} />
              <Form.Label>NOME DO PACIENTE</Form.Label>
              {errors.certificate_patient_name && touched.certificate_patient_name && <div className="error">{errors.certificate_patient_name}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control type="text" name="certificate_cpf_or_cnpj" value={values.certificate_cpf_or_cnpj} onChange={handleCPFOrCNPJChange} />
              <Form.Label>CPF OU CNPJ DO PACIENTE</Form.Label>
              {errors.certificate_cpf_or_cnpj && touched.certificate_cpf_or_cnpj && <div className="error">{errors.certificate_cpf_or_cnpj}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col md={4} className="mb-3 top-label me-2">
              <PatternFormat
                className="form-control"
                name="certificate_date_emission"
                format="##/##/####"
                mask="_"
                placeholder="DD/MM/YYYY"
                // allowEmptyFormatting="true"
                value={values.certificate_date_emission}
                onChange={handleChange}
              />
              <Form.Label>DATA</Form.Label>
              {errors.certificate_date_emission && touched.certificate_date_emission && <div className="error">{errors.certificate_date_emission}</div>}
            </Col>

            <Col md={4} className="mb-3 top-label me-2">
              <PatternFormat
                className="form-control"
                name="certificate_permanence_start"
                format="##:##"
                mask="_"
                placeholder="00:00"
                value={values.certificate_permanence_start}
                onChange={handleChange}
              />
              <Form.Label>INICIO ATENDIMENTO</Form.Label>
              {errors.certificate_permanence_start && touched.certificate_permanence_start && (
                <div className="error">{errors.certificate_permanence_start}</div>
              )}
            </Col>

            <Col md={4} className="mb-3 top-label me-2">
              <PatternFormat
                className="form-control"
                name="certificate_permanence_end"
                format="##:##"
                mask="_"
                placeholder="00:00"
                value={values.certificate_permanence_end}
                onChange={handleChange}
              />
              <Form.Label>FIM ATENDIMENTO</Form.Label>
              {errors.certificate_permanence_end && touched.certificate_permanence_end && <div className="error">{errors.certificate_permanence_end}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col md={6} className="mb-3 top-label">
              <Form.Control type="text" name="certificate_cep" value={values.certificate_cep} onChange={handleZipCodeChange} />
              <Form.Label>CEP</Form.Label>
              {errors.certificate_cep && touched.certificate_cep && <div className="error">{errors.certificate_cep}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col md={6} className="mb-3 top-label me-2">
              <Form.Control type="text" name="certificate_state" value={values.certificate_state} onChange={handleChange} />
              <Form.Label>ESTADO</Form.Label>
              {errors.certificate_state && touched.certificate_state && <div className="error">{errors.certificate_state}</div>}
            </Col>

            <Col md={6} className="mb-3 top-label">
              <Form.Control type="text" name="certificate_city" value={values.certificate_city} onChange={handleChange} />
              <Form.Label>CIDADE</Form.Label>
              {errors.certificate_city && touched.certificate_city && <div className="error">{errors.certificate_city}</div>}
            </Col>
          </div>

          <div className="d-flex">
            <Col md={5} className="mb-3 top-label me-2">
              <Form.Control type="text" name="certificate_neighborhood" value={values.certificate_neighborhood} onChange={handleChange} />
              <Form.Label>BAIRRO</Form.Label>
              {errors.certificate_neighborhood && touched.certificate_neighborhood && <div className="error">{errors.certificate_neighborhood}</div>}
            </Col>

            <Col md={5} className="mb-3 top-label me-1">
              <Form.Control type="text" name="certificate_street" value={values.certificate_street} onChange={handleChange} />
              <Form.Label>RUA</Form.Label>
              {errors.certificate_street && touched.certificate_street && <div className="error">{errors.certificate_street}</div>}
            </Col>

            <Col md={2} className="mb-3 top-label">
              <Form.Control type="text" name="certificate_number" value={values.certificate_number} onChange={handleChange} />
              <Form.Label>Nº</Form.Label>
              {errors.certificate_number && touched.certificate_number && <div className="error">{errors.certificate_number}</div>}
            </Col>
          </div>

          <div className="text-center mt-3">
            <AsyncButton isSaving={isSaving} type="submit" variant="primary" className="me-2">
              Salvar atestado
            </AsyncButton>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateAttendanceCertificate;
