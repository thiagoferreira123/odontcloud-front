import { FormikErrors, FormikTouched } from 'formik';
import { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { escapeRegexCharacters } from '../../../../../helpers/SearchFoodHelper';
import { MaterialTag, useMaterialTagStore } from '../../hooks/MaterialTagStore';
import { FileFormValues } from './FilePane';
import { useQuery } from '@tanstack/react-query';
import { TextFormValues } from './TextPane';

interface SelectCategoryProps {
  formik: {
    handleChange: {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
      (e: React.ChangeEvent<any>): void;
      // eslint-disable-next-line no-unused-vars
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    // eslint-disable-next-line no-unused-vars
    setFieldValue: (field: string, value: MaterialTag, shouldValidate?: boolean | undefined) => void;
    values: FileFormValues | TextFormValues;
    errors: FormikErrors<FileFormValues | TextFormValues>;
    touched: FormikTouched<FileFormValues | TextFormValues>;
  };
}

const CategorySelect = ({ formik }: SelectCategoryProps) => {
  const { setFieldValue, touched, errors, values } = formik;

  const [valueState, setValueState] = useState<MaterialTag>({ tag: ''});
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { getMaterialTags } = useMaterialTagStore();

  const getMaterialTags_ = async () => {
    try {
      const response = await getMaterialTags();

      if (response === false) throw new Error('Erro ao buscar tags');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (exams: MaterialTag[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(exams.map((exam) => exam.tag)))
      .filter((exam) => escapeRegexCharacters(exam.trim()).includes(escapedValue))
      .map((exam) => exam);

    return items;
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') {
      setValueState(newValue);

      console.log('newValue', newValue);

      setFieldValue('tag', newValue);
    } else {

      const payload: MaterialTag = {
        tag: newValue,
      };

      setValueState(payload);

      setFieldValue('tag', payload);
    }

  };

  const result = useQuery({ queryKey: ['material-tags'], queryFn: getMaterialTags_ });

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(result.data ?? [], value));
  };

  useEffect(() => {
    if (values.tag) {
      setValueState(values.tag);
    }
  }, [values.tag]);

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
          value: valueState.tag || '',
          onChange: changeInput,
          className: 'form-control',
        }}
      />
      {errors.tag && touched.tag && <div className="error">{errors.tag.toString()}</div>}
    </>
  );
};

export default CategorySelect;
