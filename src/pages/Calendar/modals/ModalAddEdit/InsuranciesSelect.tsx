import { Form } from 'react-bootstrap';
import { FormEventModel } from '../../hooks';
import { FormikErrors, FormikTouched } from 'formik';
import { useEffect, useState } from 'react';
import { Option } from '../../../../types/inputs';
import { medicalInsuranceOptions } from '../../constatnts';
import { escapeRegexCharacters } from '../../../../helpers/SearchFoodHelper';
import Autosuggest from 'react-autosuggest';

type InsuranciesSelectProps = {
  formik: {
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: FormEventModel;
    errors: FormikErrors<FormEventModel>;
    touched: FormikTouched<FormEventModel>;
  };
};

const InsuranciesSelect = ({ formik }: InsuranciesSelectProps) => {
  const { setFieldValue, values, touched, errors } = formik;

  const [valueState, setValueState] = useState(values.calendar_medical_insurance || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(medicalInsuranceOptions.map((insurance) => insurance.value)))
      .filter((insurance) => escapeRegexCharacters(insurance.trim()).includes(escapedValue))
      .map((insurance) => insurance);

    return items;
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') return;

    setValueState(newValue);

    setFieldValue('calendar_medical_insurance', newValue ?? '');
  };

  return (
    <div className="mb-3 top-label">
      {/* <Select
        options={options}
        value={value}
        onChange={(e) => handleChange(e as Option)}
        isClearable
        id="calendar_medical_insurance"
        name="calendar_medical_insurance"
        classNamePrefix="react-select"
        placeholder="Selecione o convênio"
      /> */}
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => suggestion}
        focusInputOnSuggestionClick={false}
        shouldRenderSuggestions={() => true}
        inputProps={{
          placeholder: 'Digite ou seleciona um convênio',
          value: valueState,
          onChange: changeInput,
          className: 'form-control',
        }}
      />
      <Form.Label>CONVÊNIO</Form.Label>
      {errors.calendar_medical_insurance && touched.calendar_medical_insurance && <div className="error">{errors.calendar_medical_insurance}</div>}
    </div>
  );
};

export default InsuranciesSelect;
