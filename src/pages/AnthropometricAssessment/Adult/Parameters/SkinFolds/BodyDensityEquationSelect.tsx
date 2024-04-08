import React from 'react';
import Select, { SingleValue } from 'react-select';
import { useParametersStore } from '../hooks/ParametersStore';
import { BodyDensityEquationSelectOptions } from '../constants';
import { Option } from '../../../../../types/inputs';

const BodyDensityEquationSelect = () => {
  const selectedBodyDensityEquation = useParametersStore((state) => state.selectedBodyDensityEquation);
  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const { updateData } = useParametersStore();
  const { setBodyDensityEquation } = useParametersStore();

  const handleUpdateData = (option: SingleValue<Option>) => {
    try {
      updateData(apiAssessmentDataUrl, {
        protocolo: option?.label ?? null,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Select
      classNamePrefix="react-select"
      options={BodyDensityEquationSelectOptions}
      value={selectedBodyDensityEquation}
      onChange={(e) => {
        setBodyDensityEquation(e);
        handleUpdateData(e);
      }}
      placeholder=""
    />
  );
};

export default BodyDensityEquationSelect;
