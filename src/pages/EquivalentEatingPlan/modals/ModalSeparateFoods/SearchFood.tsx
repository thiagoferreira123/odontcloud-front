import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Autosuggest from 'react-autosuggest';
import { getSuggestions } from './utils/FoodHelper';
import { toast } from 'react-toastify';
import { EquivalentEatingPlanMealFood } from '../../../../types/PlanoAlimentarEquivalente';
import { Food, MedidaCaseira } from '../../../../types/foods';
import { useModalsStore } from '../../hooks/modalsStore';
import useFoods from '../../../../hooks/useFoods';
import { getFood, renderInputComponent, renderSuggestion } from '../../../ClassicEatingPlan/principal-meal/SearchFood';
import { buildArrayMedidas } from '../../../../helpers/FoodHelper';
import { notify } from '../../../../components/toast/NotificationIcon';
import { getSuggestionValue } from '../../../../helpers/SearchFoodHelper';

const SearchFood = (props: { selectedFood: EquivalentEatingPlanMealFood }) => {
  const [valueState, setValueState] = useState(props.selectedFood.nome || '');
  const [suggestions, setSuggestions] = useState<Food[]>([]);

  const { updateSelectedMealFood, updateSelectedMealFoodMacros } = useModalsStore();

  const foods = useFoods((state) => state.foods);

  const changeInput = (_event: unknown, { newValue }: { newValue: string | Food }) => {
    if (typeof newValue !== 'string') return;

    const [descricaoDoAlimento, foodId, table] = newValue.split('@');

    if (!foodId || !table) {
      setValueState(descricaoDoAlimento);
    } else {
      const food = getFood(Number(foodId), table, foods);

      if (!food) return console.error('Food not found');

      changeFood(food);
    }
  };

  const changeFoodName = async () => {
    if (valueState == props.selectedFood.nome || !valueState.length) return;
  };

  const changeFood = async (food: Food) => {
    try {
      const measures = buildArrayMedidas(food);

      if (food.id && props.selectedFood.id_alimento === food.id && props.selectedFood.grupo === food.tabela) return;
      if (!props.selectedFood.id) throw new Error('selectedFood.id is undefined');

      const measure = measures.find((m: MedidaCaseira) => m.nome === food.medidaCaseira1) ?? measures[0];
      const option = { value: measure.nome, label: measure.nome };

      const payload: Partial<EquivalentEatingPlanMealFood> = {
        id: props.selectedFood.id,
        id_refeicao: props.selectedFood.id_refeicao,
        id_avulso: food.id,
        quantidade: props.selectedFood.quantidade,
        grupo: food.tabela,
        id_alimento: food.id,
        medida_caseira: measure.nome,
        measure: measure,
        measureOption: option,
        nome: food.descricaoDoAlimento,
        unidade: 1,
        food,
      };

      updateSelectedMealFood(payload);
      updateSelectedMealFoodMacros(payload);
      // if(props.selectedFood.id_alimento != food.id) setValueState(food.descricaoDoAlimento);
      setValueState(food.descricaoDoAlimento);
    } catch (error) {
      notify('Erro ao salvar alimento', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(foods, value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  useEffect(() => {
    const { id_avulso, grupo, medida_caseira, quantidade, measureOption } = props.selectedFood;

    if (!id_avulso) return;

    const food = getFood(id_avulso, grupo, foods);

    if (!food) return;
    if (measureOption) return;

    const measures = buildArrayMedidas(food);
    const measure = measures.find((m) => m.nome === medida_caseira) ?? measures[0];
    const option = { value: measure.nome, label: measure.nome };

    const payload = {
      id: props.selectedFood.id,
      id_refeicao: props.selectedFood.id_refeicao,
      medida_caseira: measure.nome,
      apelido_medida_caseira: measure.nome,
      measure: measure,
      measureOption: option,
      quantidade,
      food: food,
      unidade: 1,
    };

    updateSelectedMealFood(payload);
    updateSelectedMealFoodMacros(payload);
    // if(props.selectedFood.id_alimento != food.id) setValueState(food.descricaoDoAlimento);
  }, [getFood, props.selectedFood, updateSelectedMealFood, updateSelectedMealFoodMacros]);

  if (!foods) {
    return <></>;
  }

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      focusInputOnSuggestionClick={false}
      inputProps={{
        placeholder: '',
        value: valueState,
        onChange: changeInput,
        onBlur: () => changeFoodName(),
        className: 'form-control',
      }}
      renderInputComponent={renderInputComponent}
    />
  );
};
export default SearchFood;
