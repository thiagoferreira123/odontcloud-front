import { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { ModalNewProcedureFormValues } from './ModalNewProcedure';
import { FormikErrors, FormikTouched } from 'formik';
import { Option } from '../../../types/inputs';

type ProcedureSelectProps = {
  formik: {
    setFieldValue: (
      field: string,
      value: {
        tooth_number: string;
      }[],
      shouldValidate?: boolean | undefined
    ) => void;
    values: ModalNewProcedureFormValues;
    errors: FormikErrors<ModalNewProcedureFormValues>;
    touched: FormikTouched<ModalNewProcedureFormValues>;
  };
};

export const procedureGroupValues: {
  [key: string]: {
    [key: string]: number[];
  };
} = {
  permanent: {
    superior: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
    inferior: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
  },
  deciduos: {
    superior: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
    inferior: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
  },
};

const defaultOptions = [
  {
    label: 'Todos',
    value: 'todos',
  },
  {
    label: 'Arcada Superior',
    value: 'superior',
  },
  {
    label: 'Arcada Inferior',
    value: 'inferior',
  },
];

const SelectTeeth = ({ formik }: ProcedureSelectProps) => {
  const [value, setValue] = useState<MultiValue<Option>>();

  const { setFieldValue, values, touched, errors } = formik;

  const deciduos = [
    { value: '51', label: '51' },
    { value: '52', label: '52' },
    { value: '53', label: '53' },
    { value: '54', label: '54' },
    { value: '55', label: '55' },
    { value: '61', label: '61' },
    { value: '62', label: '62' },
    { value: '63', label: '63' },
    { value: '64', label: '64' },
    { value: '65', label: '65' },
    { value: '71', label: '71' },
    { value: '72', label: '72' },
    { value: '73', label: '73' },
    { value: '74', label: '74' },
    { value: '75', label: '75' },
    { value: '81', label: '81' },
    { value: '82', label: '82' },
    { value: '83', label: '83' },
    { value: '84', label: '84' },
    { value: '85', label: '85' },
  ];

  const permanent = [
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '15', label: '15' },
    { value: '16', label: '16' },
    { value: '17', label: '17' },
    { value: '18', label: '18' },
    { value: '21', label: '21' },
    { value: '22', label: '22' },
    { value: '23', label: '23' },
    { value: '24', label: '24' },
    { value: '25', label: '25' },
    { value: '26', label: '26' },
    { value: '27', label: '27' },
    { value: '28', label: '28' },
    { value: '31', label: '31' },
    { value: '32', label: '32' },
    { value: '33', label: '33' },
    { value: '34', label: '34' },
    { value: '35', label: '35' },
    { value: '36', label: '36' },
    { value: '37', label: '37' },
    { value: '38', label: '38' },
    { value: '41', label: '41' },
    { value: '42', label: '42' },
    { value: '43', label: '43' },
    { value: '44', label: '44' },
    { value: '45', label: '45' },
    { value: '46', label: '46' },
    { value: '47', label: '47' },
    { value: '48', label: '48' },
  ];

  const handleChange = (option: MultiValue<Option>) => {
    if(!option.length) {
      setFieldValue(
        'teeth',
        []
      );
    } else if(option.find((o) => o.value === 'todos')) {
      const teeth = values.procedure_deciduous_or_permanent === 'deciduos' ? deciduos : permanent;
      setFieldValue(
        'teeth',
        teeth.map((toothOption) => ({
          tooth_number: toothOption.value,
          tooth_faces: [],
        }))
      );
    } else if (defaultOptions.find((o) => o.value === option[option.length - 1].value)) {
      const teeth = procedureGroupValues[values.procedure_deciduous_or_permanent][option[option.length - 1].value];
      setFieldValue(
        'teeth',
        teeth.map((toothNumber) => ({
          tooth_number: toothNumber.toString(),
          tooth_faces: [],
        }))
      );
    } else {
      setFieldValue(
        'teeth',
        option.map((o) => ({
          tooth_number: o.value,
          tooth_faces: [],
        }))
      );
    }
  };

  useEffect(() => {
    setValue(
      values.teeth.map((tooth) => ({
        value: tooth.tooth_number,
        label: tooth.tooth_number,
      }))
    );
  }, [values.teeth]);

  return (
    <Select
      classNamePrefix="react-select"
      isMulti
      options={[...defaultOptions, ...(values.procedure_deciduous_or_permanent === 'deciduos' ? deciduos : permanent)]}
      value={value}
      onChange={(e) => handleChange(e as MultiValue<Option>)}
      placeholder=""
    />
  );
};

export default SelectTeeth;
