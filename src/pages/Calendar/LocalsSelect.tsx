import { useCalendarStore } from './hooks';
import { Form } from 'react-bootstrap';
import Select, { ActionMeta, GroupBase } from 'react-select';
import { Local } from '../../types/Events';
import { useServiceLocationStore } from '../../hooks/professional/ServiceLocationStore';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../Auth/Login/hook';
import { Role } from '../Auth/Login/hook/types';

type LocalsSelectProps = {
  onChange: (option: Local | null, actionMeta: ActionMeta<Local>) => void;
};

const LocalsSelect = ({ onChange }: LocalsSelectProps) => {
  const user = useAuth((state) => state.user);
  const selectedLocal = useCalendarStore((state) => state.selectedLocal);
  const { getServiceLocations } = useServiceLocationStore();
  const { setLocal } = useCalendarStore();

  const getServiceLocations_ = async () => {
    try {
      const response = await getServiceLocations();

      if (response === false) throw new Error('Error on get service locations');

      if (response.length) {
        const location = response.find((local) => user && 'id_local' in user && local.id === user.id_local) ?? response[0];
        !selectedLocal && setLocal(location);
      }
      return response;
    } catch (error) {
      console.error('Error on get service locations', error);
      throw error;
    }
  };

  const resultLocals = useQuery({ queryKey: ['my-locals', user], queryFn: getServiceLocations_ });

  return (
    <div className={`top-label ${user?.role === Role.SECRETARY ? 'd-none' : null}`}>
      <Select
        options={resultLocals.data as unknown as readonly (Local | GroupBase<Local>)[]}
        onChange={onChange}
        value={selectedLocal}
        isLoading={resultLocals.isLoading}
        loadingMessage={() => 'Carregando Locais'}
        classNamePrefix="react-select"
        placeholder=""
        getOptionLabel={(option) => resultLocals.data?.find((local) => local.id === option.id)?.nome || ''}
        getOptionValue={(option: Local) => resultLocals.data?.find((local) => local.id === option.id)?.id.toString() || ''}
        isClearable
        styles={{
          container: (styles) => ({ ...styles, zIndex: 2 }),
        }}
      />
      <Form.Label style={{ zIndex: 2 }}>Selecione o local de agendamento</Form.Label>
    </div>
  );
};

export default LocalsSelect;
