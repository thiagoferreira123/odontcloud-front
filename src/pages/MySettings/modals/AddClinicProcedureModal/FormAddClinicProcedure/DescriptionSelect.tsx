import { FormikErrors, FormikTouched } from 'formik';
import React, { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { ProcedureTemplate, procedures } from '../../../../CarePlan/constants';
import { escapeRegexCharacters } from '../../../../../helpers/SearchFoodHelper';
import { FormAddClinicProcedureFormValues } from '.';

interface SelectCategoryProps {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => Promise<FormikErrors<FormAddClinicProcedureFormValues>> | Promise<void>;
    setValues: (
      values: React.SetStateAction<FormAddClinicProcedureFormValues>,
      shouldValidate?: boolean
    ) => Promise<FormikErrors<FormAddClinicProcedureFormValues>> | Promise<void>;
    values: FormAddClinicProcedureFormValues;
    errors: FormikErrors<FormAddClinicProcedureFormValues>;
    touched: FormikTouched<FormAddClinicProcedureFormValues>;
  };
}

const DescriptionSelect = ({ formik }: SelectCategoryProps) => {
  const { handleChange, setFieldValue, values, touched, errors } = formik;

  const [valueState, setValueState] = useState(values.clinic_procedure_description || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(procedures, value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (procedures: ProcedureTemplate[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(procedures.map((procedure) => procedure.procedures)))
      .filter((procedure) => escapeRegexCharacters(procedure.trim()).includes(escapedValue))
      .map((procedure) => procedure);

    return items;
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') return;

    setFieldValue('clinic_procedure_description', newValue ?? '');
  };

  useEffect(() => {
    setValueState(values.clinic_procedure_description);
  }, [values.clinic_procedure_description]);

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
          placeholder: 'Nome do procedimento',
          value: valueState,
          onChange: changeInput,
          className: 'form-control',
        }}
      />
      {errors.clinic_procedure_description && touched.clinic_procedure_description && <div className="error">{errors.clinic_procedure_description}</div>}
    </>
  );
};

export default DescriptionSelect;
