import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '../../../types/inputs';
import { useCaloricExpenditureStore } from '../hooks';
import { ActivityLevel } from '../helpers/MathHelpers';

interface SelectProps {
  options: Option[]
}

const SelectActivityFactor = ({options}: SelectProps) => {
  const parameterId = useCaloricExpenditureStore((state) => state.parameterId);
  const selectedActivityFactor = useCaloricExpenditureStore((state) => state.selectedActivityFactor);

  const [value, setValue] = useState<Option>(options.find(o => o.value == selectedActivityFactor) || options[0]);

  const { setSelectedActivityFactor, persistParameters } = useCaloricExpenditureStore();

  const handleChhange = (e: SingleValue<Option>) => {
    e && setSelectedActivityFactor(e.value as ActivityLevel)
    setValue(e as Option)
  }

  const handleUpdateData = () => {
    persistParameters(
      {
        fator_atividade_dri_2023: selectedActivityFactor,
      },
      parameterId
    );
  };

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={handleChhange} placeholder="" onBlur={handleUpdateData} />;
};

export default SelectActivityFactor;
