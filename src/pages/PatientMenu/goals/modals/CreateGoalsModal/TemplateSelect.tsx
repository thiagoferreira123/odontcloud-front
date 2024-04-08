import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Select from 'react-select';
import { Option } from '../../../../../types/inputs';
import useGoalTemplateStore from '../../hooks/GoalTemplateStore';
import StaticLoading from '../../../../../components/loading/StaticLoading';
import { FormikErrors } from 'formik';
import { CreateGoalsModalFormValues } from '.';

interface TemplateSelectProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<CreateGoalsModalFormValues>>;
}

const TemplateSelect = ({ setFieldValue }: TemplateSelectProps) => {
  const [value, setValue] = useState<Option>();

  const { getGoalTemplates } = useGoalTemplateStore();

  const getGoalTemplates_ = async () => {
    try {
      const result = await getGoalTemplates();

      if (result === false) throw new Error('Erro ao buscar modelos de meta');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['goal-templates'], queryFn: getGoalTemplates_ });

  const handleSelectTemplate = (e: Option) => {
    setValue(e);

    const template = result.data?.find((goal) => goal.id.toString() === e.value);

    if (!template) return;

    setFieldValue('name', template.name);
    setFieldValue('description', template.description);
  };

  if (result.isLoading) return <StaticLoading />;
  else if (result.isError)
    return (
      <Select classNamePrefix="react-select" options={[]} value={value} onChange={(e) => setValue(e as Option)} placeholder="Erro ao buscar modelos de meta" />
    );
  else if (!result.data?.length)
    return (
      <Select
        classNamePrefix="react-select"
        options={[]}
        value={value}
        onChange={(e) => setValue(e as Option)}
        placeholder="Nenhum modelo de meta encontrado"
      />
    );

  return (
    <Select
      classNamePrefix="react-select"
      options={result.data.map((goal) => ({ label: goal.name, value: goal.id.toString() }))}
      value={value}
      onChange={(e) => handleSelectTemplate(e as Option)}
      placeholder="Selcione um modelo de meta"
    />
  );
};

export default TemplateSelect;
