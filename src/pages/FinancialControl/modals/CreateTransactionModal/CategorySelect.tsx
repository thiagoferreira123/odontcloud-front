import { FormikErrors, FormikTouched } from 'formik';
import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { CreateTransactionModalFormValues } from '.';
import { TransactionCategory } from '../../hooks/TransactionStore/types';
import useTransactionCategoryStore from '../../hooks/TransactionCategoryStore';
import { escapeRegexCharacters } from '../../../../helpers/SearchFoodHelper';
import { useQuery } from '@tanstack/react-query';

interface CategorySelectProps {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };

    setFieldValue: (field: string, value: TransactionCategory, shouldValidate?: boolean | undefined) => void;
    values: CreateTransactionModalFormValues;
    errors: FormikErrors<CreateTransactionModalFormValues>;
    touched: FormikTouched<CreateTransactionModalFormValues>;
  };
}

const CategorySelect = ({ formik }: CategorySelectProps) => {
  const { setFieldValue, touched, errors, values } = formik;

  const [valueState, setValueState] = useState(values.category?.category || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { getTransactionCategories } = useTransactionCategoryStore();

  const getTransactionCategories_ = async () => {
    try {
      const response = await getTransactionCategories();

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

  const getSuggestions = (exams: TransactionCategory[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(exams.map((exam) => exam.category)))
      .filter((exam) => escapeRegexCharacters(exam.trim()).includes(escapedValue))
      .map((exam) => exam);

    return items;
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') return;

    const existingCategory = result.data?.find((category) => category.category === newValue);

    if(existingCategory) {
      setFieldValue('category', existingCategory);
    } else {
      setFieldValue('category', { category: newValue, category_type: 'entrada' });
    }
  };

  useEffect(() => {
    setValueState(values.category?.category || '');
  }, [values.category]);

  const result = useQuery({ queryKey: ['transactionCategories'], queryFn: getTransactionCategories_ });

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
      {errors.category && touched.category && <div className="error">{errors.category}</div>}
    </>
  );
};

export default CategorySelect;
