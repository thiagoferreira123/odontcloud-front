import { FormikErrors, FormikTouched } from 'formik';
import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { CreateTransactionModalFormValues } from '.';
import { escapeRegexCharacters } from '../../../../helpers/SearchFoodHelper';
import { useQuery } from '@tanstack/react-query';
import { PaymentMethod } from '../../hooks/TransactionStore/types';
import usePaymentMethodStore from '../../hooks/PaymentMethodStore';

interface PaymentMethodSelectProps {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };

    setFieldValue: (field: string, value: PaymentMethod, shouldValidate?: boolean | undefined) => void;
    values: CreateTransactionModalFormValues;
    errors: FormikErrors<CreateTransactionModalFormValues>;
    touched: FormikTouched<CreateTransactionModalFormValues>;
  };
}

const PaymentMethodSelect = ({ formik }: PaymentMethodSelectProps) => {
  const { setFieldValue, touched, errors, values } = formik;

  const [valueState, setValueState] = useState(values.paymentMethod?.payment_form || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { getTransactionPaymentMethods } = usePaymentMethodStore();

  const getTransactionPaymentMethods_ = async () => {
    try {
      const response = await getTransactionPaymentMethods();

      if(response === false) throw new Error('Erro ao buscar metodos de pagamento');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(result.data ?? [], value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (paymentMethods: PaymentMethod[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(paymentMethods.map((exam) => exam.payment_form)))
      .filter((exam) => escapeRegexCharacters(exam.trim()).includes(escapedValue))
      .map((exam) => exam);

    return items;
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') return;

    const existingCategory = result.data?.find((paymentMethod) => paymentMethod.payment_form === newValue);

    if(existingCategory) {
      setFieldValue('paymentMethod', existingCategory);
    } else {
      setFieldValue('paymentMethod', { payment_form: newValue });
    }
  };

  useEffect(() => {
    setValueState(values.paymentMethod?.payment_form || '');
  }, [values.paymentMethod]);

  const result = useQuery({ queryKey: ['transaction-payment-menthods'], queryFn: getTransactionPaymentMethods_ });

  return (
    <>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => suggestion}
        focusInputOnSuggestionClick={false}
        shouldRenderSuggestions={() => true}
        inputProps={{
          placeholder: '',
          value: valueState,
          onChange: changeInput,
          className: 'form-control',
        }}
      />
      {errors.paymentMethod && touched.paymentMethod && <div className="error">{errors.paymentMethod}</div>}
    </>
  );
};

export default PaymentMethodSelect;
