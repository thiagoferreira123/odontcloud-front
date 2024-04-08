import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Option } from '../../../../../types/inputs';
import { FormikErrors } from 'formik';
import { CreateGoalsModalFormValues } from '.';

interface FrequencySelectProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<CreateGoalsModalFormValues>>;
  fieldValue: string;
}

const frequencyOptions = [
  { label: 'Diário', value: 'd' },
  { label: 'Semanal', value: 's' },
  { label: 'Mensal', value: 'm' },
  { label: 'Anual', value: 'a' },
];

const FrequencySelect = ({ setFieldValue, fieldValue }: FrequencySelectProps) => {
  const [value, setValue] = useState<Option>();

  const handleSelectTemplate = (e: Option) => {
    setFieldValue('period', e.value);
  };

  useEffect(() => {
    const option = frequencyOptions.find((option) => option.value === fieldValue) as Option;
    setValue(option);
  }, [fieldValue]);

  return (
    <Select
      classNamePrefix="react-select"
      options={frequencyOptions}
      value={value}
      onChange={(e) => handleSelectTemplate(e as Option)}
      placeholder=""
    />
  );
};

export default FrequencySelect;
