import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { MeasureOption, MedidaCaseira } from '/src/types/foods';
import { buildArrayMedidas, buildOptions } from '/src/helpers/FoodHelper';
import { ClassicPlanMealTemplateFood } from '/src/types/PlanoAlimentarClassico';
import { useModalStore } from '../../hooks/modalStore';

interface SelectMeasureProps {
  selectedFood: ClassicPlanMealTemplateFood;
}

const SelectMeasure = (props: SelectMeasureProps) => {
  const [measures, setMeasures] = useState<MedidaCaseira[]>([]);

  const { updateSelectedMealFood, updateSelectedMealFoodMacros, buildMealMacros } = useModalStore();

  const [options, setOptions] = useState<MeasureOption[]>([
    { label: 'Gramas', value: 'Gramas' },
    { label: 'À vontade', value: 'À vontade' },
  ]);

  const onChangeMeasure = async (option: SingleValue<MeasureOption>) => {
    try {
      if (!option) return;

      if (option.value && props.selectedFood.medida_caseira === option.value) return;

      const response = getOption(options, option.value);

      const payload: Partial<ClassicPlanMealTemplateFood> = {
        id: props.selectedFood.id,
        id_refeicao: props.selectedFood.id_refeicao,
        measureOption: response.option,
        measure: response.measure,
        medida_caseira: option.value,
      };

      updateSelectedMealFood(payload);
      updateSelectedMealFoodMacros({...payload, quantidade_medida: props.selectedFood.quantidade_medida, food: props.selectedFood.food});

      buildMealMacros();
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
      const measures = buildArrayMedidas(props.selectedFood.food, true);
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
