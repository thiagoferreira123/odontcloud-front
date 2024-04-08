import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import Select from 'react-select';
import StaticLoading from '../../components/loading/StaticLoading';
import { Option } from '../../types/inputs';
import { useParams } from 'react-router-dom';

import useMedicalRecordStore from '../PatientMenu/medical-record/hooks';

type TemplateSelectProps = {
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
};

const TemplateSelect = (props: TemplateSelectProps) => {
  const { id } = useParams<{ id: string }>();
  const [value, setValue] = useState<Option>();

  const { getMedicalRecords } = useMedicalRecordStore();

  const getMedicalRecords_ = async () => {
    try {
      if (!id) throw new Error('patientId is required');
      const response = await getMedicalRecords(+id);
      if (response === false) throw new Error('Erro ao buscar prontuário');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['anamnesis-templates'], queryFn: getMedicalRecords_ });

  const handleSelectTemplate = (e: Option) => {
    setValue(e);

    const template = result.data?.find((prontuario) => prontuario.id.toString() === e.value);
    props.setFieldValue('text', template?.text ?? '');
  };

  if (result.isLoading) return <StaticLoading />;
  else if (result.isError)
    return (
      <Select
        classNamePrefix="react-select"
        options={[]}
        value={value}
        onChange={(e) => setValue(e as Option)}
        placeholder="Erro ao buscar modelos de prontuário"
      />
    );
  else if (!result.data?.length)
    return (
      <Select
        classNamePrefix="react-select"
        options={[]}
        value={value}
        onChange={(e) => setValue(e as Option)}
        placeholder="Nenhum modelo de prontuário encontrado"
      />
    );

  return (
    <Select
      classNamePrefix="react-select"
      options={result.data.map((prontuario) => ({ label: prontuario.identification ?? 'Sem identificação', value: prontuario.id.toString() }))}
      value={value}
      onChange={(e) => handleSelectTemplate(e as Option)}
      placeholder="Selcione um modelo de prontuário"
    />
  );
};

export default TemplateSelect;
