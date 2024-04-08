import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import useMacrosStore from '../../hooks/useMacrosStore';
import { useCaloricExpenditureStore } from '../../../PatientMenu/caloric-expenditure/hooks';
import useClassicPlan from '../../hooks/useClassicPlan';
import { useQuery } from '@tanstack/react-query';
import { CaloricExpenditure } from '../../../../types/CaloricExpenditure';
import { escapeRegexCharacters } from '../../../../helpers/SearchFoodHelper';

const CaloricExpenditureSelect = () => {
  const vrCalorias = useMacrosStore((state) => state.vrCalorias);
  const patientID = useClassicPlan((state) => state.patientID);

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { getExpenditures } = useCaloricExpenditureStore();
  const { setPredition } = useMacrosStore();

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (expenditures: CaloricExpenditure[], value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    const items = Array.from(new Set(expenditures.map((exam) => exam.parametros ? exam.parametros[0].geb.toString() : '')))
      .filter((caloricGeb) => caloricGeb && Number(caloricGeb) && escapeRegexCharacters(caloricGeb.trim()).includes(escapedValue))
      .map((caloricGeb) => caloricGeb);

    return items;
  };

  const getExpenditures_ = async () => {
    try {

      if(!patientID) throw new Error('Paciente não encontrado no plano alimentar');

      const result = await getExpenditures(patientID);

      if (result === false) throw new Error('Erro ao buscar gastos calóricos');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const changeInput = (_event: unknown, { newValue }: { newValue: string }) => {
    if (typeof newValue !== 'string') return;

    const vrCalorias = Number(newValue);

    setPredition({ vrCalorias: String(vrCalorias) });
  };

  const result = useQuery({ queryKey: ['anamnesis-templates'], queryFn: getExpenditures_ });

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
          placeholder: "Total calórico",
          value: vrCalorias ? vrCalorias.toString() : '',
          onChange: changeInput,
          className: 'form-control',
        }}
      />
    </>
  );
};

export default CaloricExpenditureSelect;
