import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Results from './Results';
import Parameters from './Parameters';
import { useParams } from 'react-router-dom';
import { useCaloricExpenditureStore } from './hooks';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import AsyncButton from '../../components/AsyncButton';
import { notify } from '../../components/toast/NotificationIcon';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import PatientMenuRow from '../../components/PatientMenuRow';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';

const CaloricExpenditure = () => {
  const { id } = useParams<{ id: string }>();

  const [isSaving, setIsSaving] = useState(false);

  const parameterId = useCaloricExpenditureStore((state) => state.parameterId);

  const { getCaloricExpenditure, persistParameters } = useCaloricExpenditureStore();
  const { setPatientId } = usePatientMenuStore();

  const getCaloricExpenditure_ = async () => {
    try {
      if (!id) throw new Error('Id is required');

      const response = await getCaloricExpenditure(+id);

      if (response === false) throw new Error('Error fetching data');
      response.id_paciente && setPatientId(response.id_paciente);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onSubmit = async () => {
    try {
      setIsSaving(true);

      const response = await persistParameters({}, parameterId);

      if (response === false) throw new Error('Error saving data');

      notify('Predição de gasto calórico salva com sucesso', 'Sucesso', 'check', 'success');
      setIsSaving(false);
    } catch (error) {
      notify('Erro ao salvar', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const result = useQuery({ queryKey: ['caloric-expenditure', id], queryFn: getCaloricExpenditure_ });

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  if (result.isError) return <div className="vh-100 w-100 d-flex align-items-center pb-5">Ocorreu um erro ao buscar dados da predição de gasto calórico</div>;

  return (
    <>
      <PatientMenuRow />
      <Row>
        <Col lg="7">
          <Parameters />
        </Col>

        <Col lg="5">
          <Results />

          <div className="text-center">
            <AsyncButton isSaving={isSaving} variant="primary" size="lg" className="btn-icon btn-icon-start mt-1" onClickHandler={onSubmit}>
              <CsLineIcons icon="save" /> <span>Salvar </span>
            </AsyncButton>{' '}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default CaloricExpenditure;
