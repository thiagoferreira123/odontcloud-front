import { Form } from 'react-bootstrap';
import { FormikErrors, FormikTouched } from 'formik';
import { medicalInsuranceOptions } from '../../constatnts';
import { escapeRegexCharacters } from '../../../../helpers/SearchFoodHelper';
import Autosuggest from 'react-autosuggest';
import { ModalWaitingListFormValues } from '.';
import { useState } from 'react';

type InsuranciesSelectProps = {
  formik: {
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: ModalWaitingListFormValues;
    errors: FormikErrors<ModalWaitingListFormValues>;
    touched: FormikTouched<ModalWaitingListFormValues>;
  };
};

const InsuranciesSelect = ({ formik }: InsuranciesSelectProps) => {
  const { setFieldValue, values, touched, errors } = formik;

  const [valueState, setValueState] = useState(values.calendar_waiting_list_health_insurance || '');
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

    setFieldValue('calendar_waiting_list_health_insurance', newValue ?? '');
  };

  return (
    <div className="mb-3 top-label">
      {/* <Select
        options={options}
        value={value}
        onChange={(e) => handleChange(e as Option)}
        isClearable
        id="calendar_waiting_list_health_insurance"
        name="calendar_waiting_list_health_insurance"
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
      {errors.calendar_waiting_list_health_insurance && touched.calendar_waiting_list_health_insurance && <div className="error">{errors.calendar_waiting_list_health_insurance}</div>}
    </div>
  );
};

export default InsuranciesSelect;
