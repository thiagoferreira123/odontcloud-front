/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '../../../types/inputs';
import { useCaloricExpenditureStore } from '../hooks';

const options = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
]

const SelectGestationTrimester = () => {
  const parameterId = useCaloricExpenditureStore((state) => state.parameterId);
  const gestationTrimester = useCaloricExpenditureStore((state) => state.gestationTrimester);

  const [value, setValue] = useState<Option>(options.find(o => (Number(o.value) == gestationTrimester)) || options[0]);

  const { setGestationTrimester,persistParameters } = useCaloricExpenditureStore();

  const handleChhange = (e: SingleValue<Option>) => {
    e && setGestationTrimester(Number(e.value) as 1 | 2 | 3)
    setValue(e as Option)
  }

  const handleUpdateData = () => {
    persistParameters(
      {
        trimestre_gestacao: gestationTrimester,
      },
      parameterId
    );
  };

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={handleChhange} placeholder="" onBlur={handleUpdateData} />;
};

export default SelectGestationTrimester;
