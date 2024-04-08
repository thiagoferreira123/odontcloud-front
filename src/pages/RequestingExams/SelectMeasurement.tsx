/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '/src/types/inputs';

interface SelectProps {
  options: Option[]
}

const SelectMeasurement = ({options}: SelectProps) => {
  const [value, setValue] = useState<SingleValue<Option>>(options[0]);


  return <Select classNamePrefix="react-select" options={options} value={value} onChange={(e) => setValue(e)} placeholder="" />;
};

export default SelectMeasurement;
