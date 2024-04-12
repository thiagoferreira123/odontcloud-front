import { FormikErrors, FormikTouched } from 'formik';
import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { CreateTransactionModalFormValues } from '.';
import useTransactionStore from '../../hooks/TransactionStore';
import { escapeRegexCharacters } from '../../../../helpers/SearchFoodHelper';
import { useQuery } from '@tanstack/react-query';
import { Transaction } from '../../hooks/TransactionStore/types';

interface CategorySelectProps {
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

const CategorySelect = ({ formik }: CategorySelectProps) => {
  const { setFieldValue, touched, errors, values } = formik;

  const [valueState, setValueState] = useState(values.financial_control_category || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { getTransactions } = useTransactionStore();

  const getTransactions_ = async () => {
    try {
      const response = await getTransactions();

      if(response === false) throw new Error('Erro ao buscar categorias');

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

  const getSuggestions = (transactions: Transaction[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(transactions.map((transaction) => transaction.financial_control_category)))
      .filter((transaction) => escapeRegexCharacters(transaction.trim()).includes(escapedValue))
      .map((transaction) => transaction);

    return items;
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') return;

    // setValueState(newValue);

    setFieldValue('financial_control_category', newValue ?? '');
  };

  useEffect(() => {
    setValueState(values.financial_control_category || '');
  }, [values.financial_control_category]);

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
      {errors.financial_control_category && touched.financial_control_category && <div className="error">{errors.financial_control_category}</div>}
    </>
  );
};

export default CategorySelect;
