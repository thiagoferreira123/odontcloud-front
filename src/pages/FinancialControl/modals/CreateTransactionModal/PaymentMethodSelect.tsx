import { FormikErrors, FormikTouched } from 'formik';
import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { CreateTransactionModalFormValues } from '.';
import { escapeRegexCharacters } from '../../../../helpers/SearchFoodHelper';
import { useQuery } from '@tanstack/react-query';
import { PaymentMethod, Transaction } from '../../hooks/TransactionStore/types';
import useTransactionStore from '../../hooks/TransactionStore';

interface PaymentMethodSelectProps {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };

    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: CreateTransactionModalFormValues;
    errors: FormikErrors<CreateTransactionModalFormValues>;
    touched: FormikTouched<CreateTransactionModalFormValues>;
  };
}

const PaymentMethodSelect = ({ formik }: PaymentMethodSelectProps) => {
  const { setFieldValue, touched, errors, values } = formik;

  const [valueState, setValueState] = useState(values.financial_control_payment_method || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { getTransactions } = useTransactionStore();

  const getTransactions_ = async () => {
    try {
      const response = await getTransactions();

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

  const getSuggestions = (financial_control_payment_methods: Transaction[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(financial_control_payment_methods.map((transaction) => transaction.financial_control_payment_method)))
      .filter((transaction) => escapeRegexCharacters(transaction.trim()).includes(escapedValue))
      .map((transaction) => transaction);

    return items;
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') return;

    setFieldValue('financial_control_payment_method', newValue ?? '');
  };

  useEffect(() => {
    setValueState(values.financial_control_payment_method || '');
  }, [values.financial_control_payment_method]);

  const result = useQuery({ queryKey: ['my-transactions'], queryFn: getTransactions_ });

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
      {errors.financial_control_payment_method && touched.financial_control_payment_method && <div className="error">{errors.financial_control_payment_method}</div>}
    </>
  );
};

export default PaymentMethodSelect;
