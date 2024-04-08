import { FormikErrors, FormikTouched } from 'formik';
import { escapeRegexCharacters } from '/src/helpers/SearchFoodHelper';
import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { TemplateMeal, useTemplateMealStore } from '../../hooks/TemplateMealStore';

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

  const templateMeals = useTemplateMealStore((state) => state.templateMeals);

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(templateMeals ?? [], value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (templates: TemplateMeal[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(templates.map((template) => template.category)))
      .filter((category) => category && escapeRegexCharacters(category.trim()).includes(escapedValue))
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
        // shouldRenderSuggestions={() => true}
        inputProps={{
          placeholder: 'Selecione uma categoria',
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
