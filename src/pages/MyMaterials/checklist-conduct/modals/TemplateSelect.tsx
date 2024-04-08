import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Select from 'react-select';
import { FormikState } from 'formik';
import { ChecklistConductTemplateItem } from '../../../PatientMenu/checklist-conduct/hooks/ChecklistConductTemplatesStore/types';
import { ChecklistConductModalFormValues } from '.';
import { Option } from '../../../../types/inputs';
import { useChecklistConductModalStore } from '../hooks/ChecklistConductModalStore';
import useChecklistConductTemplatesStore from '../../../PatientMenu/checklist-conduct/hooks/ChecklistConductTemplatesStore';
import StaticLoading from '../../../../components/loading/StaticLoading';

interface TemplateSelectProps {
  setSelectedItem: React.Dispatch<React.SetStateAction<ChecklistConductTemplateItem | null>>;
  resetForm: (nextState?: Partial<FormikState<ChecklistConductModalFormValues>> | undefined) => void;
}

const TemplateSelect = ({ setSelectedItem, resetForm }: TemplateSelectProps) => {
  const [value, setValue] = useState<Option>();
  const selectedChecklistConduct = useChecklistConductModalStore((state) => state.selectedChecklistConduct);

  const { getChecklistConductTemplates } = useChecklistConductTemplatesStore();
  const { addConductItem } = useChecklistConductModalStore();

  const getChecklistConductTemplates_ = async () => {
    try {
      const result = await getChecklistConductTemplates();

      if (result === false) throw new Error('Erro ao buscar modelos de checklist');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['chacklist-templates'], queryFn: getChecklistConductTemplates_ });

  const handleSelectTemplate = (e: Option) => {
    setValue(e);

    const template = result.data?.find((goal) => goal.id.toString() === e.value);

    if (!template || !selectedChecklistConduct) return;

    template.items.forEach((item) => {
      const payload: ChecklistConductTemplateItem = {
        ...item,
        id: undefined,
        position: item.position + selectedChecklistConduct.items.length,
      };

      addConductItem(payload);
    });

    setSelectedItem(null);
    resetForm();
  };

  if (result.isLoading) return <StaticLoading />;
  else if (result.isError)
    return (
      <Select
        classNamePrefix="react-select"
        options={[]}
        value={value}
        onChange={(e) => setValue(e as Option)}
        placeholder="Erro ao buscar modelos de checklist"
      />
    );
  else if (!result.data?.length)
    return (
      <Select
        classNamePrefix="react-select"
        options={[]}
        value={value}
        onChange={(e) => setValue(e as Option)}
        placeholder="Nenhum modelo de checklist encontrado"
      />
    );

  return (
    <Select
      classNamePrefix="react-select"
      options={result.data.map((goal) => ({ label: goal.identification, value: goal.id.toString() }))}
      value={value}
      onChange={(e) => handleSelectTemplate(e as Option)}
      placeholder="Selcione um modelo de checklist"
    />
  );
};

export default TemplateSelect;
