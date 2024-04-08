import React, { useState } from 'react';
import Select from 'react-select';
import { Option } from '../../types/inputs';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import { useNutricionalGuidanceStore } from './hooks/NutricionalGuidanceStore';

type NutritionalGuidanceSelectProps = {
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
};

const NutritionalGuidanceSelect = (props: NutritionalGuidanceSelectProps) => {
  const [value, setValue] = useState<Option>();

  const { getNutricionalGuidances } = useNutricionalGuidanceStore();

  const getNutricionalGuidances_ = async () => {
    try {
      const result = await getNutricionalGuidances();

      if (result === false) throw new Error('Erro ao buscar modelos de orientação');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['anamnesis-templates'], queryFn: getNutricionalGuidances_ });

  const handleSelectTemplate = (e: Option) => {
    setValue(e);

    const template = result.data?.find((nutritionalGuidance) => nutritionalGuidance.id.toString() === e.value);

    props.setFieldValue('orientacao', template?.orientacao ?? '');
  };

  if (result.isLoading) return <StaticLoading />;
  else if (result.isError)
    return (
      <Select
        classNamePrefix="react-select"
        options={[]}
        value={value}
        onChange={(e) => setValue(e as Option)}
        placeholder="Erro ao buscar modelos de orientação"
      />
    );
  else if (!result.data?.length)
    return (
      <Select
        classNamePrefix="react-select"
        options={[]}
        value={value}
        onChange={(e) => setValue(e as Option)}
        placeholder="Nenhum modelo de orientação encontrado"
      />
    );

  return (
    <Select
      classNamePrefix="react-select"
      options={result.data.map((nutritionalGuidance) => ({ label: nutritionalGuidance.nome, value: nutritionalGuidance.id.toString() }))}
      value={value}
      onChange={(e) => handleSelectTemplate(e as Option)}
      placeholder="Selcione um modelo de orientação"
    />
  );
};

export default NutritionalGuidanceSelect;
