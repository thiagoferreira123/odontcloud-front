import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { NumericFormat, PatternFormat } from 'react-number-format';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { FormAddProfessionalFormValues } from '.';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';

type Props = {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => Promise<FormikErrors<FormAddProfessionalFormValues>> | Promise<void>;
    setValues: (values: React.SetStateAction<FormAddProfessionalFormValues>, shouldValidate?: boolean) => Promise<FormikErrors<FormAddProfessionalFormValues>> | Promise<void>;
    values: FormAddProfessionalFormValues;
    errors: FormikErrors<FormAddProfessionalFormValues>;
    touched: FormikTouched<FormAddProfessionalFormValues>;
  };
};

export default function OptionalValues(props: Props) {
  const { handleChange, values, touched, errors } = props.formik;

  return (
    <>

      <div className="mb-3 filled">
        <CsLineIcons icon="email" />
        <Form.Control type="text" name="professional_email" value={values.professional_email} onChange={handleChange} placeholder="Email" />
        {errors.professional_email && touched.professional_email && <div className="error">{errors.professional_email}</div>}
      </div>

      <div className="mb-3 filled w-100">
        <CsLineIcons icon="phone" />
        <Form.Control type="text" name="professional_phone" placeholder="Telefone" value={values.professional_phone} onChange={handleChange} />
        {errors.professional_phone && touched.professional_phone && <div className="error">{errors.professional_phone}</div>}
      </div>
    </>
  );
}
