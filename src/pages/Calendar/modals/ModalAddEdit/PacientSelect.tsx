import { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { ActionMeta, SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Option } from '../../../../types/inputs';
import usePatients from '../../../../hooks/usePatients';
import { useQuery } from '@tanstack/react-query';

type Props = {
  onChange: (option: Option | null, actionMeta: ActionMeta<Option>) => void;
  value: SingleValue<Option>;
};

const PacientSelect = ({ onChange, value }: Props) => {
  const { getPatients } = usePatients();

  const getPatients_ = async () => {
    try {
      const result = await getPatients();

      return result;
    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  const patientsResult = useQuery({ queryKey: ['patients'], queryFn: getPatients_ });

  const options = useMemo(() => {
    return patientsResult.data?.map((patient) => ({
      label: patient.name,
      value: patient.id?.toString() ?? '',
    })) ?? [];
  }, [patientsResult.data]);

  return (
    <div className="mb-3 top-label">
      <CreatableSelect
        value={value}
        options={options}
        onChange={onChange}
        classNamePrefix="react-select"
        isLoading={patientsResult.isLoading}
        loadingMessage={() => 'Carregando Pacientes'}
        formatCreateLabel={(inputValue: string) => `Criar paciente ${inputValue}`}
        isClearable
        placeholder=""
        id="paciente"
        name="paciente"
      />
      <Form.Label>NOME DO PACIENTE</Form.Label>
    </div>
  );
};

export default PacientSelect;
