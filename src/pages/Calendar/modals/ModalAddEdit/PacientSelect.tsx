import { useMemo } from 'react';
import { Form } from 'react-bootstrap';
import { ActionMeta, SingleValue } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Option } from '../../../../types/inputs';
import { useQuery } from '@tanstack/react-query';
import usePatientStore from '../../../Dashboard/patients/hooks/PatientStore';

type Props = {
  onChange: (option: Option | null, actionMeta: ActionMeta<Option>) => void;
  value: SingleValue<Option>;
};

const PacientSelect = ({ onChange, value }: Props) => {
  const { getPatients } = usePatientStore();

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
      label: patient.patient_full_name,
      value: patient.patient_id?.toString() ?? '',
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
        placeholder="Selecione um paciente"
        id="paciente"
        name="paciente"
      />
      <Form.Label>NOME DO PACIENTE</Form.Label>
    </div>
  );
};

export default PacientSelect;
