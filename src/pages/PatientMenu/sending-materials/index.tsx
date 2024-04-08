import React from 'react';
import { Accordion, Card, Col, Form, Row } from 'react-bootstrap';
import SelectYear from './SelectYear';
import SelectMonth from './SelectMonth';
import { useQuery } from '@tanstack/react-query';
import usePatientMenuStore from '../hooks/patientMenuStore';
import { AxiosError } from 'axios';
import { useSendingMaterialsStore } from './hooks/sendingMaterialsStore';
import { useDateFilterStore } from './hooks/dateFilterStore';
import ClassicEatingPlans from './materials/classic-eating-plan';
import EquivalentEatingPlans from './materials/equivalent-eating-plan';
import Recipes from './materials/recipe';
import AnthropometricAssessment from './materials/anthropometric-assessment';
import RequestingExams from './materials/requesting-exam';
import ManipuledFormulas from './materials/manipulated-formulas';
import QualitativeEatingPlans from './materials/qualitative-eating-plan';
import Orientations from './materials/orientation';
import StaticLoading from '../../../components/loading/StaticLoading';

export default function SendingMaterials() {
  const patientId = usePatientMenuStore((state) => state.patientId);

  const year = useDateFilterStore((state) => state.year);
  const month = useDateFilterStore((state) => state.month);

  const { getMaterials } = useSendingMaterialsStore();

  const getMaterials_ = async () => {
    try {
      if(!patientId) throw new Error('Patient ID not found');
      if(!year) throw new Error('Year not found');
      if(!month) throw new Error('Month not found');

      const response = await getMaterials(patientId, year, month);
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;
      return [];
    }
  };

  const result = useQuery({ queryKey: ['sending-materials', patientId, year, month], queryFn: getMaterials_, enabled: !!patientId && !!year && !!month });

  return (
    <section className="scroll-section" id="basic">
      <Card body className="mb-5">
        <Row>
          <Col xs="4" lg="4">
            <Form.Label className="d-block">Selecione um ano</Form.Label>
            <SelectYear />
          </Col>
          <Col xs="4" lg="4">
            <Form.Label className="d-block">Selecione um mês</Form.Label>
            <SelectMonth />
          </Col>
        </Row>
      </Card>

      <h2 className="small-title">Materiais disponíveis</h2>

      {result.isLoading ? (
        <div className="sh-30 d-flex align-items-center">
          <StaticLoading />
        </div>
      ) : result.isError ? (
        <div className="text-center">Erro ao carregar os materiais</div>
      ) : result.data?.length === 0 ? (
        <div className="text-center">Nenhum material disponível</div>
      ) : (
        <Accordion className="mb-n2" defaultActiveKey="0">
          { result.data?.filter(material => material.material === 'plano_alimentar').length ? (<ClassicEatingPlans />) : null}

          { result.data?.filter(material => material.material === 'plano_alimentar_equivalente').length ? (<EquivalentEatingPlans />) : null}

          { result.data?.filter(material => material.material === 'receitas').length ? (<Recipes />) : null}

          { result.data?.filter(material => material.material === 'avaliacao_antropometrica').length ? (<AnthropometricAssessment />) : null}

          { result.data?.filter(material => material.material === 'exame').length ? (<RequestingExams />) : null}

          { result.data?.filter(material => material.material === 'formulas_manipuladas').length ? (<ManipuledFormulas />) : null}

          { result.data?.filter(material => material.material === 'plano_qualitativo').length ? (<QualitativeEatingPlans />) : null}

          { result.data?.filter(material => material.material === 'orientacao').length ? (<Orientations />) : null}
        </Accordion>
      )}
    </section>
  );
}
