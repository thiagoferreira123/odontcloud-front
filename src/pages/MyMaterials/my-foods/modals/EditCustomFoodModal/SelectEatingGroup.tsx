import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Food } from '/src/types/foods';
import { Option } from '/src/types/inputs';
import { useEditCustomFoodModalStore } from '../../hooks/EditCustomFoodModalStore';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

const SelectEatingGroup = () => {
  const [options, setOptions] = useState<Option[]>([
    { label: 'Carregando...', value: '0' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedFood = useEditCustomFoodModalStore((state) => state.selectedFood);
  const foodGroups = useEditCustomFoodModalStore((state) => state.foodGroups);

  const { updateSelectedFood, getFoodGroups } = useEditCustomFoodModalStore();

  const onChangeGroup = async (option: SingleValue<Option>) => {
    try {
      if (!option || !selectedFood) return;

      if (option.value && selectedFood.grupo_id == Number(option.value)) return;

      const group = getGroup(option.value) ?? selectedFood.grupoAlimento;

      if(!group) return console.error('Grupo não encontrado');

      const payload: Partial<Food> = {
        selectedGroup: option,
        grupoAlimento: group,
        grupo_id: group.id,
      };

      updateSelectedFood(payload);
    } catch (error) {
      notify('Ocorreu um erro ao buscar pelos grupos alimentares', 'Erro', 'danger', 'Erro', false);
      console.error(error);
    }
  };

  const getGroup = (value: string) => {
    const group = foodGroups.find((group) => group.id === Number(value));

    return group;
  };

  useEffect(() => {

    const loadGroups = async () => {
      setIsLoading(true);
      await getFoodGroups();
    }

    setOptions(foodGroups.map((group) => ({ label: group.descricao, value: group.id.toString() })));

    if(!foodGroups.length && !isLoading) loadGroups();
  }, [foodGroups, getFoodGroups, isLoading]);

  useEffect(() => {
    if (!selectedFood || selectedFood.selectedGroup) return;

    const group = foodGroups.find((group) => group.id === selectedFood.grupo_id);

    if (!group) return;

    const option = options.find((option) => option.value === group.id.toString());

    if (!option) return;

    updateSelectedFood({ selectedGroup: option });
  }, [selectedFood, options, updateSelectedFood, foodGroups]);

  return (
    <Select
      classNamePrefix="react-select"
      options={options}
      value={selectedFood?.selectedGroup}
      onChange={(newValue) => onChangeGroup(newValue)}
      placeholder="Busque por um grupo alimentar"
    />
  );
};

export default SelectEatingGroup;
