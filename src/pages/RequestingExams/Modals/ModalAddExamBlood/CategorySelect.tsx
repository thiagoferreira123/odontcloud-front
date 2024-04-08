import { FormikErrors, FormikTouched } from 'formik';
import { escapeRegexCharacters } from '/src/helpers/SearchFoodHelper';
import { useExamsSelectStore } from '/src/pages/RequestingExams/hooks/ExamsSelectStore';
import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { Exam } from '/src/types/RequestingExam';

interface SelectCategoryProps {
  errors: FormikErrors<{
    ExameName: string;
    examMeasurementUnit: string;
    examCategory: string;
    minRangeFemale: string;
    maxRangeFemale: string;
    maxRangeMale: string;
    situationsIndicatingIncreaseOrPositivity: string;
    situationsIndicatingDecreaseOrNegativity: string;
    minRangeMale: string;
    bloodDescription: string;
  }>;

  touched: FormikTouched<{
    ExameName: string;
    examMeasurementUnit: string;
    examCategory: string;
    minRangeFemale: string;
    maxRangeFemale: string;
    maxRangeMale: string;
    situationsIndicatingIncreaseOrPositivity: string;
    situationsIndicatingDecreaseOrNegativity: string;
    minRangeMale: string;
    bloodDescription: string;
  }>;

  values: {
    ExameName: string;
    examMeasurementUnit: string;
    examCategory: string;
    minRangeFemale: string;
    maxRangeFemale: string;
    maxRangeMale: string;
    situationsIndicatingIncreaseOrPositivity: string;
    situationsIndicatingDecreaseOrNegativity: string;
    minRangeMale: string;
    bloodDescription: string;
  };

  name: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
  // eslint-disable-next-line no-unused-vars
  handleChange: (newValue: string) => void;
  value: string;
}

const CategorySelect = (props: SelectCategoryProps) => {
  const [valueState, setValueState] = useState(props.value || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const exams = useExamsSelectStore((state) => state.exams);

  const { getExams } = useExamsSelectStore();

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(exams, value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (exams: Exam[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(exams.map((exam) => exam.examCategory)))
      .filter((exam) => escapeRegexCharacters(exam.trim()).includes(escapedValue))
      .map((exam) => exam);

    return items;
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') return;

    setValueState(newValue);

    props.setFieldValue(props.name, newValue ?? '');
  };

  useEffect(() => {
    if(exams.length || isLoading) return setIsLoading(true);

    getExams();
  }, [exams.length, getExams, isLoading]);

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
      {props.errors.examCategory && props.touched.examCategory && <div className="error">{props.errors.examCategory}</div>}
    </>
  );
};

export default CategorySelect;
