import React, { useCallback, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useDateFilterStore } from './hooks/dateFilterStore';
import { months } from './utils/constants';

const SelectMonth = () => {
  const [value, setValue] = useState<SingleValue<{ value: string; label: string } | undefined>>();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const selectedMonth = useDateFilterStore((state) => state.month);

  const {setMonth} = useDateFilterStore();

  const setSelectedMonth = useCallback(() => {
    const month = months.find((month) => month.value === selectedMonth);
    setValue(month);
  }, [selectedMonth]);

  const handleSetValue = useCallback((value: SingleValue<{ value: string; label: string }>) => {
    setValue(value);

    const month = value as { value: string; label: string };

    setMonth(month.value);
  }, [setMonth]);

  useEffect(() => {
    setSelectedMonth();
    setOptions(months);
  }, [setSelectedMonth, options]);

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={handleSetValue} placeholder="" />;
};

export default SelectMonth;
