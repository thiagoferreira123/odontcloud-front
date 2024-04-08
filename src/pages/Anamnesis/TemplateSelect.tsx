import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Select from 'react-select';
import { useAnamnesisTemplateStore } from './hooks/AnamnesisTemplateStore';
import StaticLoading from '../../components/loading/StaticLoading';
import { Option } from '../../types/inputs';
import { useEditModalStore } from './hooks/EditModalStore';

const TemplateSelect = () => {
  const [value, setValue] = useState<Option>();
  const selectedAnamnesis = useEditModalStore((state) => state.selectedAnamnesis);

  const { getAnamnesisTemplates } = useAnamnesisTemplateStore();
  const { handleChangeAnamnesis } = useEditModalStore();

  const getAnamnesisTemplates_ = async () => {
    try {
      const result = await getAnamnesisTemplates();

      if (result === false) throw new Error('Erro ao buscar modelos de anamnese');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['anamnesis-templates'], queryFn: getAnamnesisTemplates_ });

  const handleSelectTemplate = (e: Option) => {
    setValue(e);

    const template = result.data?.find((anamnese) => anamnese.id.toString() === e.value);
    handleChangeAnamnesis({ ...selectedAnamnesis, textFromAnamnesis: template?.modelo ?? '' })
  }

  if (result.isLoading) return <StaticLoading />;
  else if (result.isError) return (
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
      options={result.data.map((anamnese) => ({ label: anamnese.titulo, value: anamnese.id.toString() }))}
      value={value}
      onChange={(e) => handleSelectTemplate(e as Option)}
      placeholder="Selcione um modelo de anamnese"
    />
  );
};

export default TemplateSelect;
