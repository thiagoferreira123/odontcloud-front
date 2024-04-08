import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { MeasureOption, MedidaCaseira } from '/src/types/foods';
import { buildArrayMedidas, buildOptions } from '/src/helpers/FoodHelper';
import { EquivalentEatingPlanMealFood } from '/src/types/PlanoAlimentarEquivalente';
import { useModalsStore } from '/src/pages/EquivalentEatingPlan/hooks/modalsStore';

const SelectMeasure = (props: { selectedFood: EquivalentEatingPlanMealFood }) => {
  const [measures, setMeasures] = useState<MedidaCaseira[]>([]);

  const { updateSelectedMealFood, updateSelectedMealFoodMacros } = useModalsStore();

  const [options, setOptions] = useState<MeasureOption[]>([
    { label: 'Gramas', value: 'Gramas' },
    { label: 'À vontade', value: 'À vontade' },
  ]);

  const onChangeMeasure = async (option: SingleValue<MeasureOption>) => {
    try {
      if (!option) return;

      if (option.value && props.selectedFood.medida_caseira === option.value) return;

      const response = getOption(options, option.value);

      const payload: Partial<EquivalentEatingPlanMealFood> = {
        id: props.selectedFood.id,
        id_refeicao: props.selectedFood.id_refeicao,
        measureOption: response.option,
        measure: response.measure,
        medida_caseira: option.value,
      };

      updateSelectedMealFood(payload);
      updateSelectedMealFoodMacros({...payload, quantidade: props.selectedFood.quantidade, food: props.selectedFood.food});
    } catch (error) {
      console.error(error);
    }
  };

  const getOption = (options: MeasureOption[], measureValue: string) => {
    const option = options.find((option) => option.value === measureValue);

    if (!option) return { option };

    const measure = measures.find((medida) => medida.nome === option.value);

    return { option, measure };
  };

  useEffect(() => {
    if (props.selectedFood.food) {
      const measures = buildArrayMedidas(props.selectedFood.food);
      setMeasures(measures);
    }
  }, [props.selectedFood]);

  useEffect(() => {
    const options = buildOptions(measures);

    setOptions(options);
  }, [measures]);

  return (
    <Select
      classNamePrefix="react-select"
      className="ms-1"
      options={options}
      value={props.selectedFood.measureOption}
      onChange={(newValue) => onChangeMeasure(newValue)}
      placeholder="Selecione uma medida caseira"
    />
  );
};

export default SelectMeasure;
