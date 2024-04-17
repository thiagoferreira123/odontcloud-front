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

export default function ContactValues(props: Props) {
  const { handleChange, values, touched, errors } = props.formik;

  return (
    <>
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
    </>
  );
}
