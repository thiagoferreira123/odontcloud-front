/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '../../../types/inputs';
import { useCaloricExpenditureStore } from '../hooks';
import { mets } from '../helpers/constants';
import { Met } from '../hooks/types';
import { notify } from '../../../components/toast/NotificationIcon';

interface SelectMetProps {
  met: Met;
}

const SelectMet = (props: SelectMetProps) => {
  const [value, setValue] = useState<Option>({label: props.met.nome, value: props.met.id_met.toString()});
  const selectedMets = useCaloricExpenditureStore((state) => state.mets);

  const options = mets.map((met) => ({ value: String(met.id), label: met.nome })).filter(met => !selectedMets.find(m => m.id_met === +met.value));

  const { updateMet } = useCaloricExpenditureStore();

  const handleChhange = async (option: SingleValue<Option>) => {

    if(!option) return setValue({label: '', value: ''})

    const met = mets.find((m) => m.id === +option.value)

    setValue(option as Option)

    const response = await updateMet({
      id: props.met.id,
      id_gasto_calorico: props.met.id_gasto_calorico,
      id_met: met?.id || 0,
      met: met?.met || 0,
      nome: met?.nome || '',
    })

    if(response === false) notify('Erro ao atualizar MET', 'Erro', 'close', 'danger')
  }

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={handleChhange} placeholder="" />;
};

export default SelectMet;
