import { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { getSuggestions } from './utils/FoodHelper';
import { useModalStore } from '../../hooks/modalStore';
import useFoods from '../../../../../hooks/useFoods';
import { Food, MedidaCaseira } from '../../../../../types/foods';
import { getFood, renderInputComponent, renderSuggestion } from '../../../../ClassicEatingPlan/principal-meal/SearchFood';
import { ClassicPlanMealTemplateFood } from '../../../../../types/PlanoAlimentarClassico';
import { buildArrayMedidas } from '../../../../../helpers/FoodHelper';
import { notify } from '../../../../../components/toast/NotificationIcon';
import { getSuggestionValue } from '../../../../../helpers/SearchFoodHelper';

interface SearchFoodProps {
  selectedFood: ClassicPlanMealTemplateFood;
}

const SearchFood = (props: SearchFoodProps) => {
  const [valueState, setValueState] = useState(props.selectedFood.nome || '');
  const [suggestions, setSuggestions] = useState<Food[]>([]);

  const { updateSelectedMealFood, updateSelectedMealFoodMacros, buildMealMacros } = useModalStore();

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

      if (food.id && props.selectedFood.id_alimento === food.id && props.selectedFood.tabela === food.tabela) return;
      if (!props.selectedFood.id) throw new Error('selectedFood.id is undefined');

      const measure = measures.find((m: MedidaCaseira) => m.nome === food.medidaCaseira1) ?? measures[0];
      const option = { value: measure.nome, label: measure.nome };

      const payload: Partial<ClassicPlanMealTemplateFood> = {
        id: props.selectedFood.id,
        id_refeicao: props.selectedFood.id_refeicao,
        quantidade_medida: props.selectedFood.quantidade_medida,
        tabela: food.tabela,
        id_alimento: food.id,
        medida_caseira: measure.nome,
        measure: measure,
        measureOption: option,
        nome: food.descricaoDoAlimento,
        food,
      };

      updateSelectedMealFood(payload);
      updateSelectedMealFoodMacros(payload);
      setValueState(food.descricaoDoAlimento);

      buildMealMacros();
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
    const { id_alimento, tabela, medida_caseira, quantidade_medida, measureOption } = props.selectedFood;

    if (!id_alimento) return;

    const food = getFood(id_alimento, tabela, foods);

    if (!food) {
      notify('Alimento não encontrado', 'Erro', 'close', 'danger');
      return;
    }
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
      quantidade_medida,
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
