import { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { useQuery } from '@tanstack/react-query';
import { Option } from '../../types/inputs';
import useTopicCategoryStore from './hooks/TopicCategoryStore';
import { useForumTopicFilterStore } from './hooks/ForumTopicFilterStore';

const CategorySelect = () => {
  const [value, setValue] = useState<MultiValue<Option>>();

  const { setCategories } = useForumTopicFilterStore();

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

    setCategories(categories.map((category) => category.id));
  };

  if (result.isLoading)
    return (
      <Select
        classNamePrefix="react-select"
        isMulti
        options={[]}
        value={value}
        onChange={(e) => setValue(e as MultiValue<Option>)}
        placeholder="Buscando..."
        isDisabled
      />
    );
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
        className="border-0"
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
