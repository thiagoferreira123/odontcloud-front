import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useFilterStore } from '../hooks/FilterStore';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

const SelectMultiple = () => {
  const [options, setOptions] = useState([{ label: 'Carregando...', value: '' }]);
  const categories = useFilterStore((state) => state.categories);
  const selectedCategories = useFilterStore((state) => state.selectedCategories);

  const { setSelectedCategories, getCategories } = useFilterStore();

  useEffect(() => {
    async function buildOptions() {
      try {
        await getCategories();
      } catch (error) {
        console.error(error);
        notify('Ocorreu um erro ao listar categorias de receita', 'Erro', 'close', 'danger')
      }
    }

    !categories.length && buildOptions();
  }, [categories, getCategories]);

  useEffect(() => {
    setOptions(categories.map((category) => ({ label: category.nome, value: category.id.toString() })));
  }, [categories]);

  return (
    <Select
      classNamePrefix="react-select"
      isMulti
      options={options}
      value={selectedCategories}
      onChange={setSelectedCategories}
      placeholder="Digite a categoria da receita"
    />
  );
};

export default SelectMultiple;
