import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Food, MedidaCaseira } from '../../../../types/foods';
import { Option } from '../../../../types/inputs';
import { buildFoodMeasures, buildOptions } from '../../../../helpers/FoodHelper';

const SelectMeasure = (props: { food: Food; onChange: (measure: MedidaCaseira) => void }) => {
  const [value, setValue] = useState<Option>();

  const [measures, setMeasures] = useState<MedidaCaseira[]>([]);

  const [options, setOptions] = useState<Option[]>([
    { label: 'Gramas', value: 'Gramas' },
    { label: 'À vontade', value: 'À vontade' },
  ]);

  const onChangeMeasure = (option: SingleValue<Option>) => {

    if (!option) return;

    const measure = measures.find((measure) => measure.nome === option.value);

    if (!measure) return;

    setValue(option);
    props.onChange(measure);
  };

  useEffect(() => {
    if (props.food) {
      const measures = buildFoodMeasures(props.food);
      setMeasures(measures);
    }
  }, [props.food]);

  useEffect(() => {
    const options = buildOptions(measures);
    setOptions(options);

    setValue(options.find((option) => option.value === (props.food.medida_selecionada ? props.food.medida_selecionada.nome : props.food.medidaCaseira1)));
  }, [measures, props.food.medidaCaseira1, props.food.medida_selecionada]);

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={onChangeMeasure} placeholder="Busque por um modelo" />;
};

export default SelectMeasure;
