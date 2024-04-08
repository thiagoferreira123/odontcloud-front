import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { useQuery } from '@tanstack/react-query';
import { useCaloricExpenditureStore } from '../hooks';
import { useAntropometricAssessmentStore } from '../../PatientMenu/anthropometric-assessment/hooks/AntropometricAssessmentStore';
import { AntropometricAssessmentData, AntropometricAssessmentHistory } from '../../../types/AntropometricAssessment';
import { escapeRegexCharacters } from '../../../helpers/SearchFoodHelper';

const WeigthSelect = () => {
  const weight = useCaloricExpenditureStore((state) => state.weight);
  const patientId = useCaloricExpenditureStore((state) => state.patientId);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { getAssessmentsWithData } = useAntropometricAssessmentStore();
  const { setWeight } = useCaloricExpenditureStore();

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (assessments: AntropometricAssessmentHistory<AntropometricAssessmentData>[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(assessments.map(
        (assessment) => assessment.data?.peso?.toString() ??
          assessment.data?.pesoAtual?.toString() ??
            assessment.data?.pesoBioimpedancia?.toString() ?? ''
      )))
      .filter((caloricGeb) => caloricGeb && Number(caloricGeb) && escapeRegexCharacters(caloricGeb.trim()).includes(escapedValue))
      .map((caloricGeb) => caloricGeb);

    return items;
  };

  const getAssessmentsWithData_ = async () => {
    try {

      if(!patientId) return;

      const result = await getAssessmentsWithData(patientId);

      if (result === false) throw new Error('Erro ao buscar antropometrias');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    setWeight(Number(newValue));
  };

  const result = useQuery({ queryKey: ['assessments-with-data'], queryFn: getAssessmentsWithData_ });

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(result.data ?? [], value));
  };

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
          placeholder: "",
          value: weight ? weight.toString() : '',
          onChange: changeInput,
          className: 'form-control',
        }}
      />
    </>
  );
};

export default WeigthSelect;
