import { Card, Col, Container, Row } from 'react-bootstrap';
import useLayout from '../../hooks/useLayout';
import Symptons from './Symptons';
import AsyncButton from '../../components/AsyncButton';
import { useState } from 'react';
import { MetabolicTracking } from './hooks/types';
import { useParams } from 'react-router-dom';
import useMetabolicTrackingStore from './hooks';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';

export default function MetabolicTrakingLooseForm() {
  const { key } = useParams<{ key: string }>();
  const professional_id = useMetabolicTrackingStore((state) => state.professional_id);
  const selectedSynptoms = useMetabolicTrackingStore((state) => state.selectedSynptoms);

  const { email, name_patient, wpp } = useMetabolicTrackingStore((state) => state);

  const [isSaving, setIsSaving] = useState(false);

  const { createMetabolicTracking, getMetabolicTracking } = useMetabolicTrackingStore();

  const getMetabolicTracking_ = async () => {
    try {
      if (!key) throw new Error('key não informada');

      const response = await getMetabolicTracking(key);

      if (!response) throw new Error('Erro ao buscar rastreamento metabólico');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      if (!key) throw new Error('key não informada');

      const payload: Partial<MetabolicTracking> = {
        key: key,
        tracking_full: JSON.stringify(selectedSynptoms),
        professional_id,
        email,
        name_patient,
        wpp,
        data: new Date(),
        punctuation: 0,
        description: '',
        patient_id: 0,
      };

      await createMetabolicTracking(payload);

      setIsSaving(false);
      window.location.replace('https://www.dietsystem.com.br')
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const result = useQuery({ queryKey: ['metabolic-tracking', key], queryFn: getMetabolicTracking_ });

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  if (result.isError) return <div className="vh-100 w-100 d-flex align-items-center pb-5">Ocorreu um erro ao buscar dados do rastreamento metabólico</div>;

  return (
    <>
      <Card className="mb-3" body>
        <h5 className="text-alternate">Preencha o questionário abaixo, de acordo com as legendas:</h5>
        0 - nunca ou quase nunca teve o sintoma <br />
        1 - ocasionalmente teve, efeito não foi severo <br />
        2 - ocasionalmente teve, efeito foi severo <br />
        3 - frequentemente teve, efeito não foi severo <br />
        4 - frequentemente teve, efeito foi severo <br />
      </Card>
      <Card className="mb-3" body>
        <div>
          <h5>Perguntas</h5>
        </div>
        <Symptons />
      </Card>

      <AsyncButton className="w-100" variant="primary" onClickHandler={handleSubmit} isSaving={isSaving}>
        Salvar
      </AsyncButton>
    </>
  );
}
