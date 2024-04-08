import React, { useState } from 'react';
import Select from 'react-select';

const SelectMultiple = () => {
  const [value, setValue] = useState();

  const options = [
    { value: 'all', label: 'Todos' },
    { value: 'lower arch', label: 'Arcada inferior' },
    { value: 'lower upper', label: 'Arcada superior' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: '7' },
    { value: '8', label: '8' },
    { value: '9', label: '9' },
    { value: '10', label: '10' },
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
    { value: '29', label: '29' },
    { value: '30', label: '30' },
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
    { value: '85', label: '85' }
  ];
  return <Select classNamePrefix="react-select" isMulti options={options} value={value} onChange={setValue} placeholder="" />;
};

export default SelectMultiple;
