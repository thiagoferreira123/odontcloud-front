import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '../../../types/inputs';
import { useCaloricExpenditureStore } from '../hooks';

interface SelectProps {
  options: Option[]
}

const SelectPhysicalActivityFactor = ({options}: SelectProps) => {
  const parameterId = useCaloricExpenditureStore((state) => state.parameterId);
  const selectedPhysicalActivityFactor = useCaloricExpenditureStore((state) => state.selectedPhysicalActivityFactor);
  const selectedPhysicalActivityFactorIndex = useCaloricExpenditureStore((state) => state.selectedPhysicalActivityFactorIndex);

  const [value, setValue] = useState<Option>(options[selectedPhysicalActivityFactorIndex] || options[0]);

  const { setSelectedPhysicalActivityFactor, persistParameters } = useCaloricExpenditureStore();

  const handleChhange = (e: SingleValue<Option>) => {
    e && setSelectedPhysicalActivityFactor(Number(e.value))
    setValue(e as Option)
  }

  const handleUpdateData = () => {

    const fator_atividade = options.findIndex(o => Number(o.value) == selectedPhysicalActivityFactor);

    if(fator_atividade === -1) return console.error('Fator de atividade não encontrado', selectedPhysicalActivityFactor, options);

    persistParameters(
      {
        fator_atividade,
      },
      parameterId
    );
  };

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={handleChhange} placeholder="" onBlur={handleUpdateData} />;
};

export default SelectPhysicalActivityFactor;
