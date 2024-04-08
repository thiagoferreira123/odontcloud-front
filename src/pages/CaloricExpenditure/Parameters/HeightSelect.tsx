import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { useQuery } from '@tanstack/react-query';
import { useCaloricExpenditureStore } from '../hooks';
import { useAntropometricAssessmentStore } from '../../PatientMenu/anthropometric-assessment/hooks/AntropometricAssessmentStore';
import { AntropometricAssessmentData, AntropometricAssessmentHistory } from '../../../types/AntropometricAssessment';
import { escapeRegexCharacters } from '../../../helpers/SearchFoodHelper';

const HeightSelect = () => {
  const height = useCaloricExpenditureStore((state) => state.height);
  const patientId = useCaloricExpenditureStore((state) => state.patientId);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { getAssessmentsWithData } = useAntropometricAssessmentStore();
  const { setHeight } = useCaloricExpenditureStore();

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (assessments: AntropometricAssessmentHistory<AntropometricAssessmentData>[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(assessments.map(
        (assessment) => assessment.data?.altura?.toString() ??
            assessment.data?.alturaBioimpedancia?.toString() ?? ''
      )))
      .filter((height) => height && Number(height) && escapeRegexCharacters(height.trim()).includes(escapedValue))
      .map((height) => (Number(height) * 100).toString());

    return items;
  };

  const getAssessmentsWithData_ = async () => {
    try {

      if(!patientId) throw new Error('Paciente não encontrado na antropometria');

      const result = await getAssessmentsWithData(patientId);

      if (result === false) throw new Error('Erro ao buscar antropometrias');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    setHeight(Number(newValue));
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
          value: height ? height.toString() : '',
          onChange: changeInput,
          className: 'form-control',
        }}
      />
    </>
  );
};

export default HeightSelect;
