import { FormikErrors, FormikTouched } from 'formik';
import React, { useEffect, useState } from 'react';
import { Option } from '../../../../../../types/inputs';
import CsLineIcons from '../../../../../../cs-line-icons/CsLineIcons';
import { Form } from 'react-bootstrap';
import { FormikValues } from '.';
import Select, { SingleValue } from 'react-select';
import { PatternFormat } from 'react-number-format';
import { useModalAddPatientStore } from '../../../hooks/ModalAddPatientStore';

interface RequiredDataProps {
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
}

export const patient_sex = [
  { value: '0', label: 'Feminino' },
  { value: '1', label: 'Masculino' },
];

export default function RequiredData(props: RequiredDataProps) {
  const { handleChange, values, touched, errors, setFieldValue } = props.formik;

  const [selectSex, setSelectSex] = useState<Option>();

  const selectedPatient = useModalAddPatientStore((state) => state.selectedPatient);

  const selectOnChangeSex = (selectedOption: SingleValue<Option>) => {
    if (selectedOption) {
      setFieldValue('patient_sex', selectedOption.value);
      setSelectSex(selectedOption);
    }
  };

  useEffect(() => {
    if (patient_sex && patient_sex.length && selectedPatient?.patient_sex != null) {
      const sex = patient_sex.find((sex) => sex.value == String(selectedPatient?.patient_sex));
      sex && setSelectSex(sex);
    }
  }, [selectedPatient?.patient_sex]);

  return (
    <>
      <div className="mb-3 filled">
        <CsLineIcons icon="user" />
        <Form.Control type="text" name="patient_full_name" value={values.patient_full_name} onChange={handleChange} placeholder="Nome completo" />
        {errors.patient_full_name && touched.patient_full_name && <div className="error">{errors.patient_full_name}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="gender" />
        <Select classNamePrefix="react-select" name="sex" options={patient_sex} value={selectSex} onChange={selectOnChangeSex} placeholder="Sexo" />
        {errors.patient_sex && touched.patient_sex && <div className="error">{errors.patient_sex}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="calendar" />
        <PatternFormat
          className="form-control"
          name="patient_birth_date"
          format="##/##/####"
          mask="_"
          placeholder="DD/MM/YYYY"
          value={values.patient_birth_date}
          onChange={handleChange}
        />
        {errors.patient_birth_date && touched.patient_birth_date && <div className="error">{errors.patient_birth_date}</div>}
      </div>
    </>
  );
}
