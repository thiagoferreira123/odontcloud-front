import { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { FormikErrors, FormikTouched } from 'formik';
import { Option } from '../../../types/inputs';
import { ModalPaymentConditionsFormValues } from './ModalPaymentConditions';

type SelectPaymentMethodProps = {
  formik: {
    setFieldValue: (
      field: string,
      value: string,
      shouldValidate?: boolean | undefined
    ) => void;
    values: ModalPaymentConditionsFormValues;
    errors: FormikErrors<ModalPaymentConditionsFormValues>;
    touched: FormikTouched<ModalPaymentConditionsFormValues>;
  };
};

const options = [
  {
    label: 'Dinheiro',
    value: 'dinheiro',
  },
  {
    label: 'Cartões de Crédito',
    value: 'cartoes_credito',
  },
  {
    label: 'Cartões de Débito',
    value: 'cartoes_debito',
  },
  {
    label: 'Boletos Bancários',
    value: 'boletos_bancarios',
  },
  {
    label: 'Transferências Bancárias (TED/DOC)',
    value: 'transferencias_bancarias',
  },
  {
    label: 'Pix',
    value: 'pix',
  },
  {
    label: 'Carteiras Digitais',
    value: 'carteiras_digitais',
  },
  {
    label: 'Cheque',
    value: 'cheque',
  },
];

const SelectPaymentMethod = ({ formik }: SelectPaymentMethodProps) => {
// const SelectPaymentMethod = () => {
  const [value, setValue] = useState<Option>();

  const { setFieldValue, values, touched, errors } = formik;

  const handleChange = (option: Option) => {
    setFieldValue(
      'budget_payment_method',
      option.value
    );

    // setValue(option);
  };

  useEffect(() => {
    setValue(options.find((option) => option.value === values.budget_payment_method));
  }, [values.budget_payment_method]);

  return (
    <Select
      classNamePrefix="react-select"
      options={options}
      value={value}
      onChange={(e) => handleChange(e as Option)}
      placeholder=""
    />
  );
};

export default SelectPaymentMethod;
