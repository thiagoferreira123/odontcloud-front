import React from 'react';
import Select, { SingleValue } from 'react-select';
import { useParametersStore } from '../hooks/ParametersStore';
import { BodyFatEquationSelectOptions } from '../constants';
import { Option } from '/src/types/inputs';

const BodyFatEquationSelect = () => {
  const selectedBodyFatEquation = useParametersStore((state) => state.selectedBodyFatEquation);
  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const { updateData } = useParametersStore();
  const { setBodyFatEquation } = useParametersStore();

  const handleUpdateData = (option: SingleValue<Option>) => {
    try {
      updateData(apiAssessmentDataUrl, {
        siri_ou_brozek: option?.value ?? null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Select
      classNamePrefix="react-select"
      options={BodyFatEquationSelectOptions}
      value={selectedBodyFatEquation}
      onChange={(e) => {
        setBodyFatEquation(e);
        handleUpdateData(e);
      }}
      placeholder=""
    />
  );
};

export default BodyFatEquationSelect;
