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
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
      (e: React.ChangeEvent<any>): void;
      // eslint-disable-next-line no-unused-vars
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    // eslint-disable-next-line no-unused-vars
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => Promise<FormikErrors<FormikValues>> | Promise<void>;
    // eslint-disable-next-line no-unused-vars
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
    props.formik.setFieldValue('cpf', maskedValue);
  };

  const handleZipCodeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawZipCode = event.target.value;
    const maskedZipCode = applyZipCodeMask(rawZipCode);
    props.formik.setFieldValue('cep', maskedZipCode);

    if (maskedZipCode.length === 9) {
      try {
        const numericZipCode = maskedZipCode.replace('-', '');
        const response = await axios.get(`https://viacep.com.br/ws/${numericZipCode}/json/`);
        const { uf, localidade, bairro, logradouro } = response.data;

        props.formik.setFieldValue('state', uf);
        props.formik.setFieldValue('city', localidade);
        props.formik.setFieldValue('neighborhood', bairro);
        props.formik.setFieldValue('street', logradouro);
      } catch (error) {
        console.error('Erro ao buscar CEP', error);
      }
    }
  };

  return (
    <>
      <div className="mb-3 filled">
        <CsLineIcons icon="credit-card" />
        <Form.Control type="text" name="cpf" placeholder="CPF ou CNPJ" value={values.cpf} onChange={handleCpfCnpjChange} />
        {errors.cpf && touched.cpf && <div className="error">{errors.cpf}</div>}
      </div>

      <div className="mb-3 filled w-100">
        <CsLineIcons icon="phone" />
        <Form.Control type="text" name="phone" placeholder="Telefone" value={values.phone} onChange={handleChange} />
        {errors.phone && touched.phone && <div className="error">{errors.phone}</div>}
      </div>

      <Row className="d-flex">
        <Col xs={12} md={6}>
          <div className="mb-3 filled">
            <CsLineIcons icon="pin" />
            < PatternFormat className="form-control" format="#####-###" mask="_" placeholder="CEP" name="cep" onChange={handleZipCodeChange} />
            {errors.cep && touched.cep && <div className="error">{errors.cep}</div>}
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="mb-3 filled">
            <CsLineIcons icon="pin" />
            <Form.Control type="text" name="state" value={values.state} onChange={handleChange} placeholder="Estado" />
            {errors.state && touched.state && <div className="error">{errors.state}</div>}
          </div>
        </Col>
      </Row>
      <div className="mb-3 filled">
        <CsLineIcons icon="pin" />
        <Form.Control type="text" name="neighborhood" value={values.neighborhood} onChange={handleChange} placeholder="Bairro" />
        {errors.neighborhood && touched.neighborhood && <div className="error">{errors.neighborhood}</div>}
      </div>
      <Row className="d-flex">
        <Col xs={12} md={8}>
          <div className="mb-3 filled">
            <CsLineIcons icon="pin" />
            <Form.Control type="text" name="street" value={values.street} onChange={handleChange} placeholder="Rua" />
            {errors.street && touched.street && <div className="error">{errors.street}</div>}
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="mb-3 filled">
            <CsLineIcons icon="pin" />
            <Form.Control type="text" name="houseNumber" value={values.houseNumber} onChange={handleChange} placeholder="Nº" />
            {errors.houseNumber && touched.houseNumber && <div className="error">{errors.houseNumber}</div>}
          </div>
        </Col>
      </Row>
      <div className="mb-3 filled">
        <CsLineIcons icon="notebook-1" />
        <Form.Control as="textarea" name="observation" rows={3} value={values.observation} onChange={handleChange} placeholder="Observações" />
        {errors.observation && touched.observation && <div className="error">{errors.observation}</div>}
      </div>
    </>
  );
}
