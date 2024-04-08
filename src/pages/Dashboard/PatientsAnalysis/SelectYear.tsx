import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { getLastFourYears } from '../../../helpers/DateHelper';
import { Option } from '../../../types/inputs';
import { usePatientStoreAnalysisStore } from './hooks';

const SelectYear = () => {
  const year = usePatientStoreAnalysisStore((state) => state.year);
  const [value, setValue] = useState<SingleValue<Option>>({ label: year.toString(), value: year.toString() });

  const { setYear } = usePatientStoreAnalysisStore();

  return (
    <Select
      classNamePrefix="react-select"
      options={getLastFourYears().map((y) => ({ label: y.toString(), value: y.toString() }))}
      value={value}
      onChange={(e) => {setValue(e); e && setYear(e.value)}}
      placeholder=""
    />
  );
};

export default SelectYear;
