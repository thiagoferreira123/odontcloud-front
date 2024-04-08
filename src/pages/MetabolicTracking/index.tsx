import { Alert, Card, Col, Row } from 'react-bootstrap';
import Symptons from './Symptons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useMetabolicTrackingStore, { getAlertInfo, getPontuationCount } from './hooks';
import { useParams } from 'react-router-dom';
import StaticLoading from '../../components/loading/StaticLoading';
import PatientMenuRow from '../../components/PatientMenuRow';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';
import AsyncButton from '../../components/AsyncButton';
import { useState } from 'react';
import { MetabolicTracking as MetabolicTrackingType } from './hooks/types';

export default function MetabolicTracking() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [isSaving, setIsSaving] = useState(false);

  const selectedSynptoms = useMetabolicTrackingStore(state => state.selectedSynptoms);
  const puntuationCount = getPontuationCount(selectedSynptoms);
  const alertScoreInfo = getAlertInfo(puntuationCount);
  const patientId = usePatientMenuStore(state => state.patientId);

  const { getMetabolicTracking, updateMetabolicTracking } = useMetabolicTrackingStore();
  const { setPatientId } = usePatientMenuStore();

  const getMetabolicTracking_ = async () => {
    try {
      if(!id) throw new Error('ID não informado');

      const response = await getMetabolicTracking(+id);

      if (!response) throw new Error('Erro ao buscar rastreamento metabólico');

      response.patient_id && setPatientId(response.patient_id);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      if(!id) throw new Error('ID não informado');

      const payload: Partial<MetabolicTrackingType> = {
        id: +id,
        punctuation: puntuationCount,
        description: alertScoreInfo.message,
        tracking_full: JSON.stringify(selectedSynptoms),
      }

      await updateMetabolicTracking(payload, queryClient);

      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  }

  const result = useQuery({ queryKey: ['metabolic-tracking', id], queryFn: getMetabolicTracking_ });

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  if (result.isError) return <div className="vh-100 w-100 d-flex align-items-center pb-5">Ocorreu um erro ao buscar dados do rastreamento metabólico</div>;

  return (
    <>
      {patientId ? <PatientMenuRow /> : null}

      <Row className="d-flex">
        <Col xl={8}>
          <Card className="mb-3" body>
            <div>
              <h5>Perguntas</h5>
            </div>
            <Symptons />
          </Card>
        </Col>

        <Col xl={4}>
          <Card className="mb-3" body>
            <div>
              <h5>Resultado</h5>
            </div>
            <Alert variant={alertScoreInfo && alertScoreInfo.variant} className="text-center">
              <div className="mb-3">
                Pontuação total: <strong>({ puntuationCount } pontos)</strong>
              </div>
              <div>{alertScoreInfo && alertScoreInfo.message}</div>
            </Alert>
          </Card>

          <AsyncButton className="w-100" variant="primary" onClickHandler={handleSubmit} isSaving={isSaving}>
            Salvar
          </AsyncButton>
        </Col>
      </Row>
    </>
  );
}
