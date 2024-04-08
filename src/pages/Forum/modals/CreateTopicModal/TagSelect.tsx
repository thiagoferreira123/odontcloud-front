import { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { Option } from '../../../../types/inputs';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../../components/loading/StaticLoading';
import { FormikErrors } from 'formik';
import { CreateTopicModalFormValues } from '.';
import useTopicTagStore from '../../hooks/TopicTagStore';

interface TagSelectProps {
  values: CreateTopicModalFormValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<CreateTopicModalFormValues>>;
}

const TagSelect = ({ setFieldValue, values }: TagSelectProps) => {
  const [value, setValue] = useState<MultiValue<Option>>();

  const { getTopicTags } = useTopicTagStore();

  const getTopicTags_ = async () => {
    try {
      const result = await getTopicTags();

      if (result === false) throw new Error('Erro ao buscar tags');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['topic-tags'], queryFn: getTopicTags_ });

  const handleSelectTag = (e: MultiValue<Option>) => {
    setValue(e);

    const ids = e.map((tag) => tag.value);
    const tags = result.data?.filter((goal) => ids.includes(goal.id.toString()));

    if (!tags) return;

    setFieldValue('tags', tags);
  };

  useEffect(() => {
    if (values) {
      const tags = values.tags.map((category) => ({ label: category.nome, value: category.id.toString() }));
      setValue(tags);
    }
  }, [values]);

  if (result.isLoading) return <StaticLoading />;
  else if (result.isError)
    return (
      <Select
        classNamePrefix="react-select"
        isMulti
        options={[]}
        value={value}
        onChange={(e) => setValue(e as MultiValue<Option>)}
        placeholder="Erro ao buscar tags"
      />
    );
  else if (!result.data?.length)
    return (
      <Select
        classNamePrefix="react-select"
        isMulti
        options={[]}
        value={value}
        onChange={(e) => setValue(e as MultiValue<Option>)}
        placeholder="Nenhuma tag encontrada"
      />
    );

  return (
    <Select
      classNamePrefix="react-select"
      isMulti
      options={result.data.map((tag) => ({ label: tag.nome, value: tag.id.toString() }))}
      value={value}
      onChange={(e) => handleSelectTag(e as MultiValue<Option>)}
      placeholder="Digite o nome da tag"
    />
  );
};

export default TagSelect;
