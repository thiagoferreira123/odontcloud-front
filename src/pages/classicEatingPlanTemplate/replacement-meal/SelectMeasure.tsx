import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import useClassicPlan from '../hooks/useClassicPlan';
import { ClassicPlanReplacementMealFood } from '../../../types/PlanoAlimentarClassico';
import { MeasureOption, MedidaCaseira } from '../../../types/foods';
import api from '../../../services/useAxios';
import { buildArrayMedidas, buildOptions } from '../../../helpers/FoodHelper';

const SelectMeasure = (props: { selectedFood: ClassicPlanReplacementMealFood, mealId: number }) => {
  const [measures, setMeasures] = useState<MedidaCaseira[]>([]);
  const { updateReplacementMealFood } = useClassicPlan();

  const [options, setOptions] = useState<MeasureOption[]>([
    { label: 'Gramas', value: 'Gramas' },
    { label: 'À vontade', value: 'À vontade' },
  ]);

  const onChangeMeasure = async (option: SingleValue<MeasureOption>) => {
    try {
      if(!option) return;

      if(option.value && props.selectedFood.medida_caseira === option.value) return;

      const response = getOption(options, option.value);

      const gramas = response.measure ? response.measure.gramas * props.selectedFood.quantidade_medida : 0;

      const payload: Partial<ClassicPlanReplacementMealFood> = {
        id            : props.selectedFood.id,
        id_refeicao   : props.selectedFood.id_refeicao,
        measureOption : response.option,
        measure       : response.measure,
        medida_caseira: option.value,
        gramas        : gramas,
        carbohydrate  : ((Number(props.selectedFood.food?.carboidrato) * Number(gramas)) / 100).toFixed(1),
        protein       : ((Number(props.selectedFood.food?.proteina) * Number(gramas)) / 100).toFixed(1),
        lipid         : ((Number(props.selectedFood.food?.lipideos) * Number(gramas)) / 100).toFixed(1),
        calories      : ((Number(props.selectedFood.food?.energia) * Number(gramas)) / 100).toFixed(1),
        alimentoequivalentes: []
      };

      updateReplacementMealFood(payload, props.mealId);

      await api.patch('/plano-alimentar-classico-refeicao-substituta-alimento/' + props.selectedFood.id, {
        medida_caseira: option.value,
        gramas        : gramas,
      });

      await api.delete(`/plano-alimentar-classico-refeicao-substituta-alimento/${props.selectedFood.id}/equivalents`);

    } catch (error) {
      console.error(error);
    }
  };

  const getOption = (options: MeasureOption[], measureValue: string) => {
    const option = options.find((option) => option.value === measureValue);

    if (!option) return {option};

    const measure = measures.find((medida) => medida.nome === option.value);

    return {option, measure};
  };

  useEffect(() => {
    if (props.selectedFood.food) {
      const measures = buildArrayMedidas(props.selectedFood.food);
      setMeasures(measures);
    }
  }, [props.selectedFood.food, props.selectedFood.measureOption]);

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
