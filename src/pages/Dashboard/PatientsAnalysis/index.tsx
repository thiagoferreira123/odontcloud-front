import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ChartCustomLegendBar from './ChartPatientsAnalysis';
import { usePatientStoreAnalysisStore } from './hooks';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import SelectYear from './SelectYear';

export default function PatientsAnalysis() {

  const year = usePatientStoreAnalysisStore((state) => state.year);

  const { getPatientsAnalysis } = usePatientStoreAnalysisStore();

  const getPatientsAnalysis_ = async () => {
    try {
      const response = await getPatientsAnalysis(year);

      if (response === false) throw new Error('Error on getPatientsAnalysis');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['getPatientsAnalysis', year], queryFn: getPatientsAnalysis_ });

  return (
    <Card className="mb-1">
      <Card.Body>
        <Row className="g-0 mb-3">
          <Col xs="auto">
            <div className="d-inline-block d-flex">
              <div className="bg-gradient-light sw-6 sh-6 rounded-xl">
                <div className="text-white d-flex justify-content-center align-items-center h-100">
                  <Icon.PieChart size={20}/>
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <div className="d-flex flex-column pt-0 pb-0 ps-3 pe-4 h-100 justify-content-center">
              <div className="d-flex flex-column">
                <div className="text-alternate mt-n1 lh-1-25 d-flex">Análise de pacientes</div>
              </div>
            </div>
          </Col>
          <Col className="d-flex justify-content-end">
            <div className="w-40">
              <SelectYear />
            </div>
          </Col>
        </Row>
        {/* <ChartPatientControll /> */}
        {result.isLoading ? (
          <div className="sh-40 d-flex align-items-center">
            <StaticLoading />
          </div>
        ) : result.isError ? (
          <div className="sh-40 d-flex align-items-center">
            <StaticLoading />
          </div>
        ) : !result.data ? (
          <div className="sh-40 d-flex align-items-center">
            Erro ao carregar analise
          </div>
        ) : (
          <ChartCustomLegendBar data={result.data} />
        )}
      </Card.Body>
    </Card>
  );
}
