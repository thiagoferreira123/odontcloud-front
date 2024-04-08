import { useEquivalentEatingPlanStore } from '/src/pages/EquivalentEatingPlan/hooks/equivalentEatingPlanStore';
import { useEquivalentEatingPlanListStore } from '/src/pages/EquivalentEatingPlan/hooks/equivalentPlanListStore';
import { listGroups } from '/src/pages/EquivalentEatingPlan/hooks/equivalentPlanListStore/initialState';
import { useModalsStore } from '/src/pages/EquivalentEatingPlan/hooks/modalsStore';
import React, { useCallback, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { ReplacementListFood } from '/src/types/Food';
import { EquivalentEatingPlanMealFood, EquivalentEatingPlanMealReplacementFood, isEquivalentEatingPlanMealFood } from '/src/types/PlanoAlimentarEquivalente';
import { Option } from '/src/types/inputs';

interface SearchReplacementFoodProps {
  food: EquivalentEatingPlanMealFood | EquivalentEatingPlanMealReplacementFood | null;
  // eslint-disable-next-line no-unused-vars
  onSelectFood: (food: ReplacementListFood) => void;
}

function SearchReplacementFood(props: SearchReplacementFoodProps) {
  const [value, setValue] = useState<Option | null>();

  const [foods, setFoods] = useState<ReplacementListFood[]>([]);

  const [options, setOptions] = useState<Option[]>([]);

  const selectedFood = useModalsStore((state) => state.selectedFood);
  const selectedFoods = useEquivalentEatingPlanStore((state) => state.selectedFoods);

  const { getGroupFoods } = useEquivalentEatingPlanListStore();

  const onChangeFood = async (option: SingleValue<Option>) => {
    if (!option) return;

    setValue(option);

    const food = foods.find((f) => f.id === Number(option.value));

    if (!food) return console.error('Food not found');

    props.onSelectFood(food);
  };

  const buildListGroups = useCallback(async () => {
    if (!selectedFood) return;

    const group = listGroups.find((lg) => lg.name === selectedFood.grupo);

    if (!group) return;

    const foods = await getGroupFoods(group.id);
    setFoods(foods);
  }, [getGroupFoods, selectedFood]);

  useEffect(() => {
    buildListGroups();
  }, [buildListGroups, setFoods]);

  useEffect(() => {

    if (!selectedFood || !selectedFoods) return;

    const options = foods.filter((food) => selectedFoods.find((f) => f.idAlimento === food.id && f.grupo === selectedFood.grupo)).map((food) => ({ label: food.descricao_dos_alimentos, value: String(food.id) }));
    setOptions(options);

    const selectedValue = options.find((option) => {

      if(!props.food) return false;

      if(isEquivalentEatingPlanMealFood(props.food)) return option.label == props.food.nome;
      return option.value === String(props.food.idAlimentoSubstituto)
    });

    setValue(selectedValue ?? null);
  }, [foods, props.food, selectedFood, selectedFoods]);

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={onChangeFood} placeholder="Busque por um alimento" />;
}

export default SearchReplacementFood;
