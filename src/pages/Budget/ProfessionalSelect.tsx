import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CarePlanBudget } from './hooks/CarePlanBudgetStore/types';
import { Option } from '../../types/inputs';
import { useAuth } from '../Auth/Login/hook';
import useProfessionalStore from '../MySettings/hooks/ProfessionalStore';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify } from '../../components/toast/NotificationIcon';
import StaticLoading from '../../components/loading/StaticLoading';
import useCarePlanBudgetStore from './hooks/CarePlanBudgetStore';

type ProfessionalSelectProps = {
  carePlanBudget: CarePlanBudget;
};

const ProfessionalSelect = ({ carePlanBudget }: ProfessionalSelectProps) => {
  const queryClient = useQueryClient();
  const [value, setValue] = useState<Option>();

  const user = useAuth((state) => state.user);

  const { getProfessionals } = useProfessionalStore();
  const { updateCarePlanBudget } = useCarePlanBudgetStore();

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
    updateCarePlanBudget({
      ...carePlanBudget,
      budget_care_plan_professional_id: option.value,
    }, queryClient);
  };

  const options =
    result.data?.map((professional) => ({
      label: professional.professional_full_name,
      value: professional.professional_id ?? '',
    })) ?? [];

  useEffect(() => {
    if (carePlanBudget.budget_care_plan_professional_id) {
      const option = options.find((option) => option.value === carePlanBudget.budget_care_plan_professional_id);
      setValue(option);
    }
  }, [carePlanBudget.budget_care_plan_professional_id]);

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
