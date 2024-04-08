/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '/src/types/inputs';

interface SelectExamProps {
  options: any[];
  value: Option;
  // eslint-disable-next-line no-unused-vars
  setValue: (value: SingleValue<Option>) => void;
}

const SelectExam = ({options, value, setValue}: SelectExamProps) => {
  return <Select classNamePrefix="react-select" options={options} value={value} onChange={(e) => setValue(e)} placeholder="" />;
};

export default SelectExam;
