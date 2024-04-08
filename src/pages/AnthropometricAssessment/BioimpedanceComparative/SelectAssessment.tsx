/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '/src/types/inputs';

interface SelectAssessmentProps {
  options: any[];
  value: Option;
  // eslint-disable-next-line no-unused-vars
  setValue: (value: SingleValue<Option>) => void;
}

const SelectAssessment = ({options, value, setValue}: SelectAssessmentProps) => {
  return <Select classNamePrefix="react-select" options={options} value={value} onChange={(e) => setValue(e)} placeholder="" />;
};

export default SelectAssessment;
