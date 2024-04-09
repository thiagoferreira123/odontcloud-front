import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { Form } from 'react-bootstrap';
import { FormAddClinicProcedureFormValues } from '.';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import DescriptionSelect from './DescriptionSelect';

interface RequiredDataProps {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => Promise<FormikErrors<FormAddClinicProcedureFormValues>> | Promise<void>;
    setValues: (
      values: React.SetStateAction<FormAddClinicProcedureFormValues>,
      shouldValidate?: boolean
    ) => Promise<FormikErrors<FormAddClinicProcedureFormValues>> | Promise<void>;
    values: FormAddClinicProcedureFormValues;
    errors: FormikErrors<FormAddClinicProcedureFormValues>;
    touched: FormikTouched<FormAddClinicProcedureFormValues>;
  };
}

export default function RequiredData(props: RequiredDataProps) {
  const { handleChange, setFieldValue, values, touched, errors } = props.formik;

  const handleChangeMaskMoney = (event: { target: { value: string } }) => {
    const inputValue = (parseInt(event.target.value.replace(/\D/g, ''), 10) / 100)
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    setFieldValue('clinic_procedure_value', inputValue);
  };

  return (
    <>
      <div className="mb-3 filled">
        <CsLineIcons icon="vaccine" />
        <DescriptionSelect formik={props.formik} />
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="money" />
        <Form.Control type="text" name="clinic_procedure_value" value={values.clinic_procedure_value} onChange={handleChangeMaskMoney} placeholder="Valor R$" />
        {errors.clinic_procedure_value && touched.clinic_procedure_value && <div className="error">{errors.clinic_procedure_value}</div>}
      </div>
    </>
  );
}
