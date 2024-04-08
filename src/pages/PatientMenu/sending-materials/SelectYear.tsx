import React, { useCallback, useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useDateFilterStore } from './hooks/dateFilterStore';

const SelectYear = () => {
  const selectedYear = useDateFilterStore((state) => state.year);

  const [value, setValue] = useState<SingleValue<{ value: string; label: string } | undefined>>({ value: String(selectedYear), label: String(selectedYear) });
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  const { setYear } = useDateFilterStore();

  const handleSelectYear = useCallback((value: SingleValue<{ value: string; label: string }>) => {
    setValue(value);

    const year = value as { value: string; label: string };

    setYear(year.value);
  } , [setYear]);

  const fillAvailableYears = useCallback(() => {
    const today = new Date();
    let year = 2022;

    const years = [];

    while (year <= today.getFullYear()) {
      years.push({ value: String(year), label: String(year)});
      year++;
    }

    setOptions(years);
  }, []);

  useEffect(() => {
    fillAvailableYears();
  }, [fillAvailableYears]);

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={handleSelectYear} placeholder="" />;
};

export default SelectYear;
