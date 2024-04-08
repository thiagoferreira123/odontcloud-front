/* eslint-disable @typescript-eslint/no-explicit-any */
import NotificationIcon from '/src/components/toast/NotificationIcon';
import React, { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { toast } from 'react-toastify';
import { useModalAddRecipeStore } from '../../hooks/ModalAddRecipeStore';
import { Option } from '/src/types/inputs';
import { FormikErrors, FormikTouched } from 'formik';
import { FormValues } from '../..';

interface SelectProps {
  errors: FormikErrors<FormValues>;

  touched: FormikTouched<FormValues>;

  values: FormValues;

  name: string;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
  // eslint-disable-next-line no-unused-vars
  handleChange: (newValue: MultiValue<Option>) => void;
  value: MultiValue<Option>;
}

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

const SelectCategory = (props: SelectProps) => {
  const [options, setOptions] = useState([{ label: 'Carregando...', value: '' }]);
  const categories = useModalAddRecipeStore((state) => state.categories);

  const { getCategories } = useModalAddRecipeStore();

  useEffect(() => {
    async function buildOptions() {
      try {
        await getCategories();
      } catch (error) {
        console.error(error);
        notify('Ocorreu um erro ao listar categorias de receita', 'Erro', 'close', 'danger');
      }
    }

    !categories.length && buildOptions();
  }, [categories, getCategories]);

  useEffect(() => {
    setOptions(categories.map((category) => ({ label: category.nome, value: category.id.toString() })));
  }, [categories]);

  return (
    <>
      <Select
        classNamePrefix="react-select"
        isMulti
        name={props.name}
        options={options}
        value={props.value}
        onChange={props.handleChange}
        placeholder="Digite a categoria da receita"
      />
      {props.errors.categories && props.touched.categories && <div className="error">{props.errors.categories.toString()}</div>}
    </>
  );
};

export default SelectCategory;
