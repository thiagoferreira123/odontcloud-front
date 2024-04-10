import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Select from 'react-select';
import StaticLoading from '../../components/loading/StaticLoading';
import { Option } from '../../types/inputs';
import { useEditModalStore } from './hooks/EditModalStore';
import { useClinicAnamnesisStore } from './hooks/AnamnesisTemplateStore';
import { useAuth } from '../Auth/Login/hook';

const TemplateSelect = () => {
  const [value, setValue] = useState<Option>();
  const selectedAnamnesis = useEditModalStore((state) => state.selectedAnamnesis);
  const user = useAuth((state) => state.user);

  const { getClinicAnamnesis } = useClinicAnamnesisStore();
  const { handleChangeAnamnesis } = useEditModalStore();

  const getClinicAnamnesis_ = async () => {
    try {
      if (!user) throw new Error('Usuário não encontrado');

      const result = await getClinicAnamnesis(user.clinic_id);

      if (result === false) throw new Error('Erro ao buscar modelos de anamnese');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['anamnesis-templates'], queryFn: getClinicAnamnesis_ });

  const handleSelectTemplate = (e: Option) => {
    setValue(e);

    const template = result.data?.find((anamnese) => anamnese.clinic_anamnesi_id.toString() === e.value);
    handleChangeAnamnesis({ ...selectedAnamnesis, anamnesis_text: template?.clinic_anamnesi_text ?? '' });
  };

  if (result.isLoading) return <StaticLoading />;
  else if (result.isError)
    return (
      <Select
        classNamePrefix="react-select"
        options={[]}
        value={value}
        onChange={(e) => setValue(e as Option)}
        placeholder="Erro ao buscar modelos de anamnese"
      />
    );
  else if (!result.data?.length)
    return (
      <Select
        classNamePrefix="react-select"
        options={[]}
        value={value}
        onChange={(e) => setValue(e as Option)}
        placeholder="Nenhum modelo de anamnese encontrado"
      />
    );

  return (
    <Select
      classNamePrefix="react-select"
      options={result.data.map((anamnese) => ({ label: anamnese.clinic_identification ?? 'Sem identificação', value: anamnese.clinic_anamnesi_id }))}
      value={value}
      onChange={(e) => handleSelectTemplate(e as Option)}
      placeholder="Selcione um modelo de anamnese"
    />
  );
};

export default TemplateSelect;
