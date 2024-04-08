import { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { Option } from '../../../../types/inputs';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../../components/loading/StaticLoading';
import { FormikErrors } from 'formik';
import { CreateTopicModalFormValues } from '.';
import useTopicCategoryStore from '../../hooks/TopicCategoryStore';

interface CategorySelectProps {
  values: CreateTopicModalFormValues;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void> | Promise<FormikErrors<CreateTopicModalFormValues>>;
}

const CategorySelect = ({ setFieldValue, values }: CategorySelectProps) => {
  const [value, setValue] = useState<MultiValue<Option>>();

  const { getTopicCategorys } = useTopicCategoryStore();

  const getTopicCategorys_ = async () => {
    try {
      const result = await getTopicCategorys();

      if (result === false) throw new Error('Erro ao buscar categorias');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['topic-categories'], queryFn: getTopicCategorys_ });

  const handleSelectCategory = (e: MultiValue<Option>) => {
    const ids = e.map((category) => category.value);
    const categories = result.data?.filter((goal) => ids.includes(goal.id.toString()));

    if (!categories) return;

    setFieldValue('categories', categories);
  };

  useEffect(() => {
    if (values) {
      const categories = values.categories.map((category) => ({ label: category.nome, value: category.id.toString() }));
      setValue(categories);
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
        placeholder="Erro ao buscar categorias"
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
        placeholder="Nenhuma categoria encontrada"
      />
    );

  return (
    <Select
      classNamePrefix="react-select"
      isMulti
      options={result.data.map((category) => ({ label: category.nome, value: category.id.toString() }))}
      value={value}
      onChange={(e) => handleSelectCategory(e as MultiValue<Option>)}
      placeholder="Digite o nome da categoria"
    />
  );
};

export default CategorySelect;
