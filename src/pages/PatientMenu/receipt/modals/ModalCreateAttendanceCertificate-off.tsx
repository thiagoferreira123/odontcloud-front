import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import * as Yup from 'yup';
import axios from 'axios';
import { useCreateAndEditModalStore } from '../hooks/CreateAndEditModalStore';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useReceiptStore from '../hooks/ReceiptStore';
import { PatternFormat } from 'react-number-format';
import AsyncButton from '../../../../components/AsyncButton';

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


const ModalCreateReceipt = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const [isSaving, setIsSaving] = useState(false);

  const showModal = useCreateAndEditModalStore((state) => state.showModal);
  const selectedReceipt = useCreateAndEditModalStore((state) => state.selectedReceipt);

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
      setIsSaving(true);

      if (!id) throw new Error('patient_id (id) is not defined');

      if (selectedReceipt?.id) {
        const result = await updateReceipt({ ...selectedReceipt, ...values }, queryClient);

        if (result === false) throw new Error('Error updating assessment');
      } else {
        const result = await addReceipt({ ...values, patient_id: +id }, queryClient);

        if (!result) throw new Error('Error adding assessment');
      }

      hideModal();
      resetForm();

      setIsSaving(false);
      hideModal();
    } catch (error) {
      setIsSaving(false);
      console.error(error);
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

  useEffect(() => {
    if (selectedReceipt) {
      const { patient_name, cpf_cnpj_do_patient, permanence_start, permanencia_end, cep, state, city, neighborhood, street, number, date_issue } = selectedReceipt;
      setValues({ patient_name, cpf_cnpj_do_patient, permanence_start, permanencia_end, cep, state, city, neighborhood, street, number, date_issue });
    } else {
      setValues(initialValues);
    }
  }, [selectedReceipt]);

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton> <Modal.Title>Emita recibos para o paciente</Modal.Title></Modal.Header>
      <Modal.Body className="mt-4" >

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
                format="##/##/####"
                mask="_"
                placeholder="DD/MM/YYYY"
                // allowEmptyFormatting="true"
                value={values.permanence_start}
                onChange={handleChange}
              />
              {/* <Form.Control type="text" name="permanence_start" value={values.permanence_start} onChange={handleChange} /> */}
              <Form.Label>INICIO ATENDIMENTO</Form.Label>
              {errors.permanence_start && touched.permanence_start && <div className="error">{errors.permanence_start}</div>}
            </Col>

            <Col md={4} className="mb-3 top-label me-2">
              {/* <Form.Control type="text" name="permanencia_end" value={values.permanencia_end} onChange={handleChange} /> */}
              <PatternFormat
                className="form-control"
                name="permanencia_end"
                format="##/##/####"
                mask="_"
                placeholder="DD/MM/YYYY"
                // allowEmptyFormatting="true"
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

            <Button type="submit" variant="primary">
              Gerar PDF do atestado
            </Button>
          </div>

        </Form>

      </Modal.Body>
    </Modal>
  );
};

export default ModalCreateReceipt;
