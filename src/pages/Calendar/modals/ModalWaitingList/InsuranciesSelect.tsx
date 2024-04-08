import Select from '../../../../components/Select';
import { Form } from 'react-bootstrap';
import { ActionMeta, GroupBase, SingleValue } from 'react-select';
import useHealthInsuranceStore from '../../hooks/HealthInsuranceStore';
import { AppException } from '../../../../helpers/ErrorHelpers';
import { notify } from '../../../../components/toast/NotificationIcon';
import { useQuery } from '@tanstack/react-query';
import { HealthInsurance } from '../../hooks/HealthInsuranceStore/types';

type Props = {
  onChange: (option: HealthInsurance | null, actionMeta: ActionMeta<HealthInsurance>) => void;
  value: SingleValue<HealthInsurance> | undefined;
};

const InsuranciesSelect = ({ onChange, value }: Props) => {
  const { getHealthInsurances } = useHealthInsuranceStore();

  const getHealthInsurances_ = async () => {
    try {
      const result = await getHealthInsurances();

      if (!result) throw new Error('Erro ao buscar convênios');

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const result = useQuery({ queryKey: ['health-insurances'], queryFn: getHealthInsurances_ });

  return (
    <div className="mb-3 top-label">
      <Select
        options={(result.data as unknown as readonly (HealthInsurance | GroupBase<HealthInsurance>)[]) ?? []}
        value={value}
        onChange={onChange}
        isLoading={result.isLoading}
        loadingMessage={() => 'Carregando Convênios'}
        getOptionLabel={(option: HealthInsurance) =>
          result.data?.find((insurance) => insurance.calendar_health_insurance_id === option.calendar_health_insurance_id)?.calendar_health_insurance_name || ''
        }
        getOptionValue={(option: HealthInsurance) =>
          result.data?.find((insurance) => insurance.calendar_health_insurance_id === option.calendar_health_insurance_id)?.calendar_health_insurance_id?.toString() || ''
        }
        isClearable
        id="convenio"
        name="calendar_health_insurance_id"
      />
      <Form.Label>CONVÊNIO</Form.Label>
    </div>
  );
};

export default InsuranciesSelect;
