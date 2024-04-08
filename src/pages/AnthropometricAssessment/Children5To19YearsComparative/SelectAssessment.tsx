import Select, { SingleValue } from 'react-select';
import { Option } from '../../../types/inputs';

interface SelectAssessmentProps {
  options: any[];
  value: Option;
  setValue: (value: SingleValue<Option>) => void;
}

const SelectAssessment = ({options, value, setValue}: SelectAssessmentProps) => {
  return <Select classNamePrefix="react-select" options={options} value={value} onChange={(e) => setValue(e)} placeholder="" />;
};

export default SelectAssessment;
