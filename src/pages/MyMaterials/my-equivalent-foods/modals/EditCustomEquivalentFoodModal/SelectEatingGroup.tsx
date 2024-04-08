import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { useEditCustomEquivalentFoodModalStore } from '../../hooks/EditCustomEquivalentFoodModalStore';
import { toast } from 'react-toastify';
import { Option } from '../../../../../types/inputs';
import { PersonalEquivalentFood } from '../../../../../types/Food';
import { notify } from '../../../../../components/toast/NotificationIcon';
import { listGroups } from '../../../../EquivalentEatingPlan/hooks/equivalentPlanListStore/initialState';
import { EquivalentFoodFormValues } from '.';
import { FormikErrors, FormikTouched } from 'formik';

type AvatarProps = {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: EquivalentFoodFormValues;
    errors: FormikErrors<EquivalentFoodFormValues>;
    touched: FormikTouched<EquivalentFoodFormValues>;
  };
};

const SelectEatingGroup = ({ formik }: AvatarProps) => {

  const { setFieldValue, touched, errors } = formik;

  const [options, setOptions] = useState<Option[]>([
    { label: 'Carregando...', value: '0' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedFood = useEditCustomEquivalentFoodModalStore((state) => state.selectedFood);

  const { updateSelectedFood, getFoodGroups } = useEditCustomEquivalentFoodModalStore();

  const onChangeGroup = async (option: SingleValue<Option>) => {
    try {
      if (!option || !selectedFood) return;

      if (option.value && selectedFood.grupo_alimento == option.value) return;

      const group = getGroup(option.value) ?? selectedFood.selectedGroup;

      if(!group) return console.error('Grupo não encontrado');

      const payload: Partial<PersonalEquivalentFood> = {
        selectedGroupOption: option,
        selectedGroup: group,
        grupo_alimento: group.name,
        alimento: {...selectedFood.alimento, grupo: group.name}
      };

      setFieldValue('grupo_alimento', group.name);

      updateSelectedFood(payload);
    } catch (error) {
      notify('Ocorreu um erro ao buscar pelos grupos alimentares', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const getGroup = (value: string) => {
    const group = listGroups.find((group) => group.name === value);

    return group;
  };

  useEffect(() => {

    const loadGroups = async () => {
      setIsLoading(true);
      await getFoodGroups();
    }

    setOptions(listGroups.map((group) => ({ label: group.title, value: group.name })));

    if(!listGroups.length && !isLoading) loadGroups();
  }, [getFoodGroups, isLoading]);

  useEffect(() => {
    if (!selectedFood || !selectedFood.grupo_alimento || selectedFood.selectedGroupOption) return;

    const group = listGroups.find((group) => group.name === selectedFood.grupo_alimento);

    if (!group) return;

    const option = options.find((option) => option.value === group.name);

    if (!option) return;

    updateSelectedFood({ selectedGroupOption: option });
  }, [selectedFood, options, updateSelectedFood]);

  return (
    <Select
      classNamePrefix="react-select"
      options={options}
      value={selectedFood?.selectedGroupOption}
      onChange={(newValue) => onChangeGroup(newValue)}
      placeholder="Busque por um grupo alimentar"
    />
  );
};

export default SelectEatingGroup;
