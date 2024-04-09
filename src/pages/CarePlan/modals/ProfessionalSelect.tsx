import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { procedures } from '../constants';
import { useAuth } from '../../Auth/Login/hook';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import { useModalNewProcedureStore } from '../hooks/ModalNewProcedureStore';
import { Option } from '../../../types/inputs';
import { ModalNewProcedureFormValues } from './ModalNewProcedure';
import { FormikErrors, FormikTouched } from 'formik';
import useProfessionalStore from '../../MySettings/hooks/ProfessionalStore';

type ProfessionalSelectProps = {
  formik: {
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: ModalNewProcedureFormValues;
    errors: FormikErrors<ModalNewProcedureFormValues>;
    touched: FormikTouched<ModalNewProcedureFormValues>;
  };
};

const ProfessionalSelect = ({ formik }: ProfessionalSelectProps) => {
  const [value, setValue] = useState<Option>();

  const user = useAuth((state) => state.user);

  const { getProfessionals } = useProfessionalStore();
  const { setFieldValue, values, touched, errors } = formik;

  const getProfessionals_ = async () => {
    try {
      if (!user) throw new AppException('Usuário não encontrado');

      const response = await getProfessionals(user.clinic_id);

      if (response === false) throw new Error('Erro ao buscar profissionais');

      return response;
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['professionals'], queryFn: getProfessionals_, enabled: !!user?.clinic_id });

  const handleChange = (option: Option) => {
    setFieldValue('procedure_professional_id', option.value);
  };

  const options =
    result.data?.map((professional) => ({
      label: professional.professional_full_name,
      value: professional.professional_id ?? '',
    })) ?? [];

  useEffect(() => {
    if (values.procedure_professional_id) {
      const option = options.find((option) => option.value === values.procedure_professional_id);
      setValue(option);
    }
  }, [values.procedure_professional_id]);

  if (result.isLoading) return <StaticLoading />;

  return (
    <Select
      classNamePrefix="react-select"
      options={options}
      value={value}
      onChange={(o) => handleChange(o as Option)}
      placeholder={result.data?.length ? 'Selecione um profissional' : 'Nenhum profissional encontrado'}
    />
  );
};

export default ProfessionalSelect;
