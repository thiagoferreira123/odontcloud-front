import { FormikErrors, FormikTouched } from 'formik';
import React, {  } from 'react';
import { Form } from 'react-bootstrap';
import { FormAddProfessionalFormValues } from '.';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';

interface RequiredDataProps {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => Promise<FormikErrors<FormAddProfessionalFormValues>> | Promise<void>;
    setValues: (
      values: React.SetStateAction<FormAddProfessionalFormValues>,
      shouldValidate?: boolean
    ) => Promise<FormikErrors<FormAddProfessionalFormValues>> | Promise<void>;
    values: FormAddProfessionalFormValues;
    errors: FormikErrors<FormAddProfessionalFormValues>;
    touched: FormikTouched<FormAddProfessionalFormValues>;
  };
}

export default function RequiredData(props: RequiredDataProps) {
  const { handleChange, values, touched, errors } = props.formik;

  return (
    <>
      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="professional_full_name" value={values.professional_full_name} onChange={handleChange} placeholder="Nome completo" />
        {errors.professional_full_name && touched.professional_full_name && <div className="error">{errors.professional_full_name}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="professional_specialty" value={values.professional_specialty} onChange={handleChange} placeholder="Especialidade" />
        {errors.professional_specialty && touched.professional_specialty && <div className="error">{errors.professional_specialty}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="professional_cro_state" value={values.professional_cro_state} onChange={handleChange} placeholder="CRO" />
        {errors.professional_cro_state && touched.professional_cro_state && <div className="error">{errors.professional_cro_state}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="professional_cro_number" value={values.professional_cro_number} onChange={handleChange} placeholder="Nº CRO" />
        {errors.professional_cro_number && touched.professional_cro_number && <div className="error">{errors.professional_cro_number}</div>}
      </div>
    </>
  );
}
