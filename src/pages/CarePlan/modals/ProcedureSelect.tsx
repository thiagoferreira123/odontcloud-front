import React, { useState } from 'react';
import Select from 'react-select';
import { procedures } from '../constants';
import useClinicProcedureStore from '../hooks/ClinicProcedureStore';
import { useAuth } from '../../Auth/Login/hook';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import { useModalNewProcedureStore } from '../hooks/ModalNewProcedureStore';
import { Option } from '../../../types/inputs';
import { ModalNewProcedureFormValues } from './ModalNewProcedure';
import { FormikErrors, FormikTouched } from 'formik';

type ProcedureSelectProps = {
  formik: {
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: ModalNewProcedureFormValues;
    errors: FormikErrors<ModalNewProcedureFormValues>;
    touched: FormikTouched<ModalNewProcedureFormValues>;
  };
};

const ProcedureSelect = ({ formik }: ProcedureSelectProps) => {
  const [value, setValue] = useState<Option>();
  const showOnlyClinicProcedures = useModalNewProcedureStore((state) => state.showOnlyClinicProcedures);

  const user = useAuth((state) => state.user);

  const { getClinicProcedures } = useClinicProcedureStore();
  const { setFieldValue, values, touched, errors } = formik;

  const getClinicProcedure_ = async () => {
    try {
      if (!user) throw new AppException('Usuário não encontrado');

      const response = await getClinicProcedures(user.clinic_id);

      if (response === false) throw new Error('Erro ao buscar plano de tratamento');

      return response;
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['clinic-procedures'], queryFn: getClinicProcedure_, enabled: !!user?.clinic_id });

  if (result.isLoading) return <StaticLoading />;

  const apiOptions =
    result.data?.map((procedure) => ({
      label: procedure.clinic_procedure_description,
      value: procedure.clinic_procedure_description,
    })) ?? [];

  const procedureOptions = procedures.map((procedure) => ({
    label: procedure.procedures,
    value: procedure.procedures,
  }));

  const options = showOnlyClinicProcedures ? apiOptions : [...procedureOptions, ...apiOptions];

  const handleChange = (option: Option) => {
    setValue(option);

    const apiObject = result.data?.find((procedure) => procedure.clinic_procedure_description === option.value);

    setFieldValue('procedure_name', option.value);
    apiObject && setFieldValue('procedure_value', apiObject.clinic_procedure_value);
  }

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={o => handleChange(o as Option)} placeholder="" />;
};

export default ProcedureSelect;
