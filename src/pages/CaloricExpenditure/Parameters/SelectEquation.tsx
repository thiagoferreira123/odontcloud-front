import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '../../../types/inputs';
import { useCaloricExpenditureStore } from '../hooks';

interface SelectProps {
  options: any[];
}

const SelectEquation = ({ options }: SelectProps) => {
  const selectedEquation = useCaloricExpenditureStore((state) => state.selectedEquation);
  const parameterId = useCaloricExpenditureStore((state) => state.parameterId);

  const [value, setValue] = useState<Option>(options.find((o) => o.value === selectedEquation) || null);

  const { setSelectedEquation, persistParameters } = useCaloricExpenditureStore();

  const handleChhange = (e: SingleValue<Option>) => {
    e && setSelectedEquation(e.value);
    setValue(e as Option);
  };

  const handleUpdateData = () => {
    selectedEquation && persistParameters(
      {
        formula: selectedEquation,
      },
      parameterId
    );
  };

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={handleChhange} placeholder="Selecione uma equação" onBlur={handleUpdateData} />;
};

export default SelectEquation;
