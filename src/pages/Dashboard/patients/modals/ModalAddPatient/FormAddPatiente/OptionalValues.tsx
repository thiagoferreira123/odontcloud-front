import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { FormikValues } from '.';
import CsLineIcons from '../../../../../../cs-line-icons/CsLineIcons';
import { Form } from 'react-bootstrap';

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

  return (
    <>
      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="patient_rg" value={values.patient_rg} onChange={handleChange} placeholder="RG" />
        {errors.patient_rg && touched.patient_rg && <div className="error">{errors.patient_rg}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="patient_rg_issuer" value={values.patient_rg_issuer} onChange={handleChange} placeholder="Emissor" />
        {errors.patient_rg_issuer && touched.patient_rg_issuer && <div className="error">{errors.patient_rg_issuer}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="patient_marital_status" value={values.patient_marital_status} onChange={handleChange} placeholder="Estado civil" />
        {errors.patient_marital_status && touched.patient_marital_status && <div className="error">{errors.patient_marital_status}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control
          type="text"
          name="patient_health_insurance"
          value={values.patient_health_insurance}
          onChange={handleChange}
          placeholder="Plano de saude"
        />
        {errors.patient_health_insurance && touched.patient_health_insurance && <div className="error">{errors.patient_health_insurance}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control
          type="text"
          name="patient_health_insurance_number"
          value={values.patient_health_insurance_number}
          onChange={handleChange}
          placeholder="Nº plano de saude"
        />
        {errors.patient_health_insurance_number && touched.patient_health_insurance_number && (
          <div className="error">{errors.patient_health_insurance_number}</div>
        )}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control
          type="text"
          name="patient_medical_record_number"
          value={values.patient_medical_record_number}
          onChange={handleChange}
          placeholder="Nº prontuário"
        />
        {errors.patient_medical_record_number && touched.patient_medical_record_number && <div className="error">{errors.patient_medical_record_number}</div>}
      </div>

      <div className="mb-3 filled w-100">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="patient_reference" placeholder="Referência" value={values.patient_reference} onChange={handleChange} />
        {errors.patient_reference && touched.patient_reference && <div className="error">{errors.patient_reference}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="credit-card" />
        <Form.Control type="text" name="patient_cpf" placeholder="CPF ou CNPJ" value={values.patient_cpf} onChange={handleCpfCnpjChange} />
        {errors.patient_cpf && touched.patient_cpf && <div className="error">{errors.patient_cpf}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="notebook-1" />
        <Form.Control as="textarea" name="patient_observation" rows={3} value={values.patient_observation} onChange={handleChange} placeholder="Observações" />
        {errors.patient_observation && touched.patient_observation && <div className="error">{errors.patient_observation}</div>}
      </div>
    </>
  );
}
