import { Form } from 'react-bootstrap';
import { FormEventModel } from '../../hooks';
import { FormikErrors, FormikTouched } from 'formik';
import { useEffect, useState } from 'react';
import { Option } from '../../../../types/inputs';
import Select from 'react-select';

type InsuranciesSelectProps = {
  formik: {
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: FormEventModel;
    errors: FormikErrors<FormEventModel>;
    touched: FormikTouched<FormEventModel>;
  };
};

const options = [
  {
    label: 'Convenio 1',
    value: 'convenio1',
  },
  {
    label: 'Convenio 2',
    value: 'convenio2',
  }
];

const InsuranciesSelect = ({ formik }: InsuranciesSelectProps) => {
  const [value, setValue] = useState<Option>();

  const { setFieldValue, values, touched, errors } = formik;

  const handleChange = (option: Option) => {
    setFieldValue('calendar_medical_insurance', option?.value ?? '');
  };

  useEffect(() => {
    setValue(options.find((option) => option.value === values.calendar_medical_insurance));
  }, [values.calendar_medical_insurance]);

  return (
    <div className="mb-3 top-label">
      <Select
        options={options}
        value={value}
        onChange={(e) => handleChange(e as Option)}
        isClearable
        id="calendar_medical_insurance"
        name="calendar_medical_insurance"
        classNamePrefix="react-select"
        placeholder="Selecione o convênio"
      />
      <Form.Label>CONVÊNIO</Form.Label>
      {errors.calendar_medical_insurance && touched.calendar_medical_insurance && <div className="error">{errors.calendar_medical_insurance}</div>}
    </div>
  );
};

export default InsuranciesSelect;
