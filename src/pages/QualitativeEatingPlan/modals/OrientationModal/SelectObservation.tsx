import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Select, { createFilter } from 'react-select';
import { htmlToPlainText } from '/src/helpers/InputHelpers';
import api from '/src/services/useAxios';
import { OrientationTemplate } from '/src/types/PlanoAlimentarClassico';
import { Option } from '/src/types/inputs';
import { notify } from '../../../../components/toast/NotificationIcon';

interface SelectObservationProps {
  show: boolean;
  // eslint-disable-next-line no-unused-vars
  onGetObservation: (observation: string) => void;
}

const SelectObservation = (props: SelectObservationProps) => {
  const [value, setValue] = useState<Option>();
  const [options, setOptions] = useState<Option[]>([{ label: 'Carregando orientações...', value: '' }]);
  const [type, setType] = useState<'personal' | 'dietSystem'>('personal');

  const getOrientations = async (): Promise<OrientationTemplate[]> => {
    try {
      const url = type === 'personal' ? '/orientacao-nutricional/modelos/' : '/orientacao-nutricional/modelos/shared';

      const result = await api.get(url);

      return result.data as OrientationTemplate[];
    } catch (error) {
      console.error('Erro ao buscar orientações:', error);
      notify('Erro ao buscar orientações', 'Erro', 'close', 'danger');
      return [];
    }
  };

  const orientationsResult = useQuery({ queryKey: ['meal-orientations', type], queryFn: getOrientations, enabled: props.show });

  const handleSetOption = (option: Option) => {
    setValue(option);
    props.onGetObservation(htmlToPlainText(option.value));
  };

  useEffect(() => {
    setOptions(
      orientationsResult.data?.map((orientation: OrientationTemplate) => ({ label: orientation.nome, value: String(orientation.orientacao) })) ?? []
    );
  }, [orientationsResult.data]);

  return (
    <>
      <div className="d-flex justify-content-center mb-3 mt-2">
        <Button variant={type === 'personal' ? 'primary' : 'outline-primary'} className="mb-1 ms-2" onClick={() => setType('personal')}>
          Meus modelos
        </Button>{' '}
        <Button variant={type === 'dietSystem' ? 'primary' : 'outline-primary'} className="mb-1 ms-2" onClick={() => setType('dietSystem')}>
          Modelos do DietSystem
        </Button>{' '}
      </div>
      {orientationsResult.isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      ) : (
        <Select
          classNamePrefix="react-select"
          options={options}
          value={value}
          filterOption={createFilter({ ignoreAccents: false })}
          onChange={(option) => handleSetOption(option as Option)}
          placeholder="Busque por um modelo"
        />
      )}
    </>
  );
};

export default SelectObservation;
