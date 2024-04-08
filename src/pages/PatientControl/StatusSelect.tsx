import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '../../types/inputs';
import { useFiltersStore } from './hooks/FiltersStore';

const options = [
  { label: 'Todos', value: '0'},
  { label: 'Ativo', value: '1' },
  { label: 'Inativo', value: '2' },
]

const StatusSelect = () => {
  const [value, setValue] = useState<SingleValue<Option>>({ label: 'Todos', value: '0' });
  const { setStatus } = useFiltersStore();

  const handleSelectCategory = (e: SingleValue<Option>) => {
    setValue(e);
    e && setStatus(+e.value)
  };

  return (
    <Select
      classNamePrefix="react-select"
      options={options}
      value={value}
      onChange={(e) => handleSelectCategory(e as SingleValue<Option>)}
      placeholder="Status"
    />
  );
};

export default StatusSelect;
