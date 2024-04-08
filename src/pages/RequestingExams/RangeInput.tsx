import React from 'react';
import { NumericFormat } from 'react-number-format';

interface RangeInputProps {
  value: number;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RangeInput = (props: RangeInputProps) => {
  return < NumericFormat {...props} className="form-control" mask="" format="#######" allowemptyformatting="true" />;
};
