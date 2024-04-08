import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { FormikValues } from '.';
import CsLineIcons from '../../../../../../cs-line-icons/CsLineIcons';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';

type Props = {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    setValues: (values: React.SetStateAction<FormikValues>, shouldValidate?: boolean) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    values: FormikValues;
    errors: FormikErrors<FormikValues>;
    touched: FormikTouched<FormikValues>;
  };
};

export default function OptionalValues(props: Props) {
  const { handleChange, values, touched, errors } = props.formik;

  const applyZipCodeMask = (value: string): string => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{5})(\d)/, '$1-$2')
      .substring(0, 9);
  };

  const applyCpfCnpjMask = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 11) {
      return numericValue.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})?/, '$1.$2.$3-$4');
    }
    return numericValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})?/, '$1.$2.$3/$4-$5');
  };

  const handleCpfCnpjChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyCpfCnpjMask(event.target.value);
    props.formik.setFieldValue('patient_cpf', maskedValue);
  };

  const handleZipCodeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawZipCode = event.target.value;
    const maskedZipCode = applyZipCodeMask(rawZipCode);
    props.formik.setFieldValue('patient_zip_code', maskedZipCode);

    if (maskedZipCode.length === 9) {
      try {
        const numericZipCode = maskedZipCode.replace('-', '');
        const response = await axios.get(`https://viacep.com.br/ws/${numericZipCode}/json/`);
        const { uf, localidade, bairro, logradouro } = response.data;

        props.formik.setFieldValue('patient_state', uf);
        props.formik.setFieldValue('patient_city', localidade);
        props.formik.setFieldValue('patient_neighborhood', bairro);
        props.formik.setFieldValue('patient_street', logradouro);
      } catch (error) {
        console.error('Erro ao buscar CEP', error);
      }
    }
  };

  return (
    <>
      <div className="mb-3 filled">
        <CsLineIcons icon="credit-card" />
        <Form.Control type="text" name="patient_cpf" placeholder="CPF ou CNPJ" value={values.patient_cpf} onChange={handleCpfCnpjChange} />
        {errors.patient_cpf && touched.patient_cpf && <div className="error">{errors.patient_cpf}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="email" />
        <Form.Control type="text" name="patient_email" value={values.patient_email} onChange={handleChange} placeholder="Email" />
        {errors.patient_email && touched.patient_email && <div className="error">{errors.patient_email}</div>}
      </div>

      <div className="mb-3 filled w-100">
        <CsLineIcons icon="phone" />
        <Form.Control type="text" name="patient_phone" placeholder="Telefone" value={values.patient_phone} onChange={handleChange} />
        {errors.patient_phone && touched.patient_phone && <div className="error">{errors.patient_phone}</div>}
      </div>

      <div className="mb-3 filled w-100">
        <CsLineIcons icon="user" />
        <Form.Control
          type="text"
          name="patient_extra_contact_full_name"
          placeholder="Nome contato extra"
          value={values.patient_extra_contact_full_name}
          onChange={handleChange}
        />
        {errors.patient_extra_contact_full_name && touched.patient_extra_contact_full_name && (
          <div className="error">{errors.patient_extra_contact_full_name}</div>
        )}
      </div>

      <div className="mb-3 filled w-100">
        <CsLineIcons icon="user" />
        <Form.Control
          type="text"
          name="patient_extra_contact_cpf"
          placeholder="Cpf contato extra"
          value={values.patient_extra_contact_cpf}
          onChange={handleChange}
        />
        {errors.patient_extra_contact_cpf && touched.patient_extra_contact_cpf && <div className="error">{errors.patient_extra_contact_cpf}</div>}
      </div>

      <div className="mb-3 filled w-100">
        <CsLineIcons icon="user" />
        <Form.Control
          type="text"
          name="patient_extra_contact_phone"
          placeholder="Telefone contato extra"
          value={values.patient_extra_contact_phone}
          onChange={handleChange}
        />
        {errors.patient_extra_contact_phone && touched.patient_extra_contact_phone && <div className="error">{errors.patient_extra_contact_phone}</div>}
      </div>

      <div className="mb-3 filled w-100">
        <CsLineIcons icon="user" />
        <Form.Control
          type="text"
          name="patient_extra_contact_relationship"
          placeholder="Parentesco contato extra"
          value={values.patient_extra_contact_relationship}
          onChange={handleChange}
        />
        {errors.patient_extra_contact_relationship && touched.patient_extra_contact_relationship && (
          <div className="error">{errors.patient_extra_contact_relationship}</div>
        )}
      </div>

      <Row className="d-flex">
        <Col xs={12} md={6}>
          <div className="mb-3 filled">
            <CsLineIcons icon="pin" />
            <PatternFormat
              className="form-control"
              format="#####-###"
              mask="_"
              value={values.patient_zip_code}
              placeholder="CEP"
              name="patient_zip_code"
              onChange={handleZipCodeChange}
            />
            {errors.patient_zip_code && touched.patient_zip_code && <div className="error">{errors.patient_zip_code}</div>}
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="mb-3 filled">
            <CsLineIcons icon="pin" />
            <Form.Control type="text" name="patient_state" value={values.patient_state} onChange={handleChange} placeholder="Estado" />
            {errors.patient_state && touched.patient_state && <div className="error">{errors.patient_state}</div>}
          </div>
        </Col>
      </Row>

      <div className="mb-3 filled">
        <CsLineIcons icon="pin" />
        <Form.Control type="text" name="patient_city" value={values.patient_city} onChange={handleChange} placeholder="Cidade" />
        {errors.patient_city && touched.patient_city && <div className="error">{errors.patient_city}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="pin" />
        <Form.Control type="text" name="patient_neighborhood" value={values.patient_neighborhood} onChange={handleChange} placeholder="Bairro" />
        {errors.patient_neighborhood && touched.patient_neighborhood && <div className="error">{errors.patient_neighborhood}</div>}
      </div>

      <Row className="d-flex">
        <Col xs={12} md={8}>
          <div className="mb-3 filled">
            <CsLineIcons icon="pin" />
            <Form.Control type="text" name="patient_street" value={values.patient_street} onChange={handleChange} placeholder="Rua" />
            {errors.patient_street && touched.patient_street && <div className="error">{errors.patient_street}</div>}
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="mb-3 filled">
            <CsLineIcons icon="pin" />
            <Form.Control type="text" name="patient_number" value={values.patient_number} onChange={handleChange} placeholder="Nº" />
            {errors.patient_number && touched.patient_number && <div className="error">{errors.patient_number}</div>}
          </div>
        </Col>
      </Row>

      <div className="mb-3 filled">
        <CsLineIcons icon="email" />
        <Form.Control type="text" name="patient_complement" value={values.patient_complement} onChange={handleChange} placeholder="Complemento" />
        {errors.patient_complement && touched.patient_complement && <div className="error">{errors.patient_complement}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="notebook-1" />
        <Form.Control as="textarea" name="patient_observation" rows={3} value={values.patient_observation} onChange={handleChange} placeholder="Observações" />
        {errors.patient_observation && touched.patient_observation && <div className="error">{errors.patient_observation}</div>}
      </div>
    </>
  );
}
