import { FormikErrors, FormikTouched } from 'formik';
import { escapeRegexCharacters } from '/src/helpers/SearchFoodHelper';
import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { ITemplate, useTemplateStore } from '../hooks/TemplateStore';
import { useQuery } from '@tanstack/react-query';

interface SelectCategoryProps {
  errors: FormikErrors<{
    name: string;
    category: string;
  }>;

  touched: FormikTouched<{
    name: string;
    category: string;
  }>;

  values: {
    name: string;
    category: string;
  };

  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
  // eslint-disable-next-line no-unused-vars
  handleChange: (newValue: string) => void;
  value: string;
}

const CategorySelect = (props: SelectCategoryProps) => {
  const [valueState, setValueState] = useState(props.value || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { getTemplates } = useTemplateStore();

  const getTemplates_ = async () => {
    try {
      const result = await getTemplates();

      if (result === false) throw new Error('Erro ao buscar fórmula manipulada');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['manipulated-formula-templates'], queryFn: getTemplates_ });

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(result.data ?? [], value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (templates: ITemplate[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(templates.map((exam) => exam.categoria)))
      .filter((category) => escapeRegexCharacters(category.trim()).includes(escapedValue))
      .map((category) => category);

    return items;
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') return;

    props.setFieldValue('category', newValue ?? '');
  };

  useEffect(() => {
    setValueState(props.value || '');
  }, [props.value]);

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
      {props.errors.category && props.touched.category && <div className="error">{props.errors.category}</div>}
    </>
  );
};

export default CategorySelect;
