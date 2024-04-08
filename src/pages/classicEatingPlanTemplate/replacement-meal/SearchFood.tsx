import { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import useClassicPlan from '../hooks/useClassicPlan';
import { getSuggestions } from '../services/ClassicPlanFoodHelper';
import useFilterDisplayStore from '../hooks/useFilterDisplayStore';
import { Food, MedidaCaseira } from '../../../types/foods';
import { ClassicPlanReplacementMealFood } from '../../../types/PlanoAlimentarClassico';
import useFoods from '../../../hooks/useFoods';
import api from '../../../services/useAxios';
import { buildArrayMedidas } from '../../../helpers/FoodHelper';
import { getSuggestionValue } from '../../../helpers/SearchFoodHelper';
import { notify } from '../../../components/toast/NotificationIcon';
import { getFood, renderInputComponent, renderSuggestion } from '../../ClassicEatingPlan/principal-meal/SearchFood';


const SearchFood = (props: { selectedFood: ClassicPlanReplacementMealFood; mealId: number }) => {
  const [valueState, setValueState] = useState(props.selectedFood.nome || '');
  const [suggestions, setSuggestions] = useState<Food[]>([]);
  const selectedTables = useFilterDisplayStore((state) => state.selectedTables);

  const { updateReplacementMealFood, changeReplacementMealFoodId } = useClassicPlan();

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

    if (typeof props.selectedFood.id === 'number') {
      const payload: Partial<ClassicPlanReplacementMealFood> = {
        id: props.selectedFood.id,
        id_refeicao: props.selectedFood.id_refeicao,
        nome: valueState,
      };

      updateReplacementMealFood(payload, props.mealId);

      await api.patch('/plano-alimentar-classico-refeicao-substituta-alimento/' + props.selectedFood.id, {
        nome: payload.nome,
      });
    }
  };

  const changeFood = async (food: Food) => {
    try {
      const measures = buildArrayMedidas(food);

      if (food.id && props.selectedFood.id_alimento === food.id && props.selectedFood.tabela === food.tabela) return;
      if (!props.selectedFood.id) throw new Error('selectedFood.id is undefined');

      const measure = measures.find((m: MedidaCaseira) => m.nome === food.medidaCaseira1) ?? measures[0];
      const option = { value: measure.nome, label: measure.nome };
      const gramas = measure.gramas * Number(props.selectedFood.quantidade_medida);

      const payload: Partial<ClassicPlanReplacementMealFood> = {
        id: props.selectedFood.id,
        id_refeicao: props.selectedFood.id_refeicao,
        tabela: food.tabela,
        id_alimento: food.id,
        medida_caseira: measure.nome,
        apelido_medida_caseira: measure.nome,
        measure: measure,
        measureOption: option,
        gramas: gramas,
        nome: food.descricaoDoAlimento,
        food: food,
        carbohydrate: ((Number(food?.carboidrato) * Number(gramas)) / 100).toFixed(1),
        protein: ((Number(food?.proteina) * Number(gramas)) / 100).toFixed(1),
        lipid: ((Number(food?.lipideos) * Number(gramas)) / 100).toFixed(1),
        calories: ((Number(food?.energia) * Number(gramas)) / 100).toFixed(1),
        alimentoequivalentes: []
      };

      updateReplacementMealFood(payload, props.mealId);
      if (props.selectedFood.id_alimento != food.id) setValueState(food.descricaoDoAlimento);

      if (typeof props.selectedFood.id === 'number') {
        await api.patch('/plano-alimentar-classico-refeicao-substituta-alimento/' + props.selectedFood.id, {
          id: payload.id,
          tabela: payload.tabela,
          id_alimento: payload.id_alimento,
          medida_caseira: payload.medida_caseira,
          apelido_medida_caseira: payload.apelido_medida_caseira,
          gramas: payload.gramas,
          nome: payload.nome,
        });

        await api.delete(`/plano-alimentar-classico-refeicao-substituta-alimento/${props.selectedFood.id}/equivalents`);
      } else {
        const response = await api.post('/plano-alimentar-classico-refeicao-substituta-alimento/add-alimento', {
          ...props.selectedFood,
          ...payload,
          id: undefined,
        });
        changeReplacementMealFoodId(response.data, props.selectedFood.id, props.mealId);
      }
    } catch (error) {
      notify('Erro ao salvar alimento', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(foods, value, selectedTables));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  useEffect(() => {
    const { id_alimento, tabela, medida_caseira, quantidade_medida, measureOption } = props.selectedFood;

    const food = getFood(id_alimento, tabela, foods);

    if (!food) return;
    if (measureOption) return;

    const measures = buildArrayMedidas(food);
    const measure = measures.find((m) => m.nome === medida_caseira) ?? measures[0];
    const option = { value: measure.nome, label: measure.nome };
    const gramas = measure.gramas * Number(quantidade_medida);

    const payload = {
      id: props.selectedFood.id,
      id_refeicao: props.selectedFood.id_refeicao,
      medida_caseira: measure.nome,
      apelido_medida_caseira: measure.nome,
      measure: measure,
      measureOption: option,
      gramas: gramas,
      food: food,
      carbohydrate: ((Number(food?.carboidrato) * Number(gramas)) / 100).toFixed(1),
      protein: ((Number(food?.proteina) * Number(gramas)) / 100).toFixed(1),
      lipid: ((Number(food?.lipideos) * Number(gramas)) / 100).toFixed(1),
      calories: ((Number(food?.energia) * Number(gramas)) / 100).toFixed(1),
    };

    updateReplacementMealFood(payload, props.mealId);

    if (props.selectedFood.id_alimento != food.id) setValueState(food.descricaoDoAlimento);
  }, [
    props.selectedFood.measureOption,
    props.selectedFood.id_alimento,
    props.selectedFood.tabela,
    props.selectedFood.medida_caseira,
    props.selectedFood.quantidade_medida,
    props.selectedFood.id,
    props.selectedFood,
    props.mealId,
    getFood,
    updateReplacementMealFood,
  ]);

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
