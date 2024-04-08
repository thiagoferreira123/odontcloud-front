import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ModalAgeGroup from './modals/ModalAgeGroup';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import usePatientMenuStore from '../hooks/patientMenuStore';
import { useAntropometricAssessmentStore } from './hooks/AntropometricAssessmentStore';
import ModalConfig from './modals/ConfigModalStore';
import { useConfigModalStore } from './hooks/ConfigModalStore';
import { useDeletConfirmationModalStore } from './hooks/DeletConfirmationModalStore';
import DeleteConfirmation from './modals/DeleteConfirmation';
import { getAntropometricPageLink, getComparativePageLink } from './helpers';
import { AntropometricAssessmentHistory } from '../../../types/AntropometricAssessment';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

export default function HistoryOfAnthropometric() {
  const patientId = usePatientMenuStore((state) => state.patientId);
  const assessments = useAntropometricAssessmentStore((state) => state.assessments);
  const [selectedPage, setSelectedPage] = useState(1);

  const [showModalAgeGroup, setShowModalAgeGroup] = useState(false);

  const { getAssessments } = useAntropometricAssessmentStore();
  const { handleSelectAssessment } = useConfigModalStore();
  const { handleDeleteAssessment } = useDeletConfirmationModalStore();

  const getAssessments_ = async () => {
    try {
      const assessments = await getAssessments(patientId);

      if (assessments === false) throw new Error('Erro ao buscar avaliações antropométricas');

      return assessments;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;
      return [];
    }
  };

  const handleDisplayForPatient = (assessment: AntropometricAssessmentHistory<unknown>) => {
    console.log(assessment);
  };

  const actualPage = useMemo(() => {
    const actualIndex = (selectedPage - 1) * 7;
    return [actualIndex, actualIndex + 7];
  }, [selectedPage]);

  const pages = useMemo(() => {
    const pagesArray = [];
    let page = selectedPage;

    if (page === 1) {
      page = 2;
    }

    for (let i = page - 1; i < page - 1 + 4; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  }, [selectedPage]);

  const result = useQuery({ queryKey: ['antropometric-ssessment', patientId], queryFn: getAssessments_, enabled: !!patientId });

  const slicedResult = assessments ? (assessments.length > 7 ? assessments.slice(actualPage[0], actualPage[1]) : assessments) : [];

  useEffect(() => {
    result.data?.length && selectedPage > Math.ceil(result.data.length / 7) && setSelectedPage(Math.ceil(result.data.length / 7));
  }, [result.data?.length, selectedPage]);

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          {result.isLoading ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <StaticLoading />
            </div>
          ) : result.isError ? (
            <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar avaliações antropometricas</div>
          ) : !assessments.length ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <Empty classNames="m-0" />
            </div>
          ) : (
            slicedResult.map((assessment) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={assessment.dados_geral_id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-column">
                        <div>Realizada em: {new Date(assessment.data_registro * 1000).toLocaleDateString()}</div>
                      </div>
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Exibir no painel do paciente</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleDisplayForPatient(assessment)}
                          >
                            <CsLineIcons icon="eye" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="tooltip-filter">Realize o comparativo entre as antropometrias do paciente, e análise a evolução.</Tooltip>}
                        >
                          <Link
                            to={getComparativePageLink(assessment)}
                            className="btn btn-outline-primary btn-sm btn-icon btn-icon-only mb-1 me-1"
                          >
                            <CsLineIcons icon="chart-down" />
                          </Link>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleDeleteAssessment(assessment)}
                          >
                            <CsLineIcons icon="bin" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Editar</Tooltip>}>
                          <Link
                            to={{
                              pathname: getAntropometricPageLink(assessment),
                            }}
                            className="btn-outline-primary btn-sm btn-icon btn-icon-only mb-1 me-1"
                          >
                            <CsLineIcons icon="edit" />
                          </Link>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Alterar as configurações</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleSelectAssessment(assessment)}
                          >
                            <CsLineIcons icon="gear" />
                          </Button>
                        </OverlayTrigger>{' '}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ))
          )}

          <Row className="mt-3 mb-3 justify-content-center">
            {result.data && result.data.length > 7 ? (
              <nav>
                <Pagination className="bordered">
                  <Pagination.Prev onClick={() => setSelectedPage(selectedPage - 1)} disabled={selectedPage === 1}>
                    <CsLineIcons icon="chevron-left" />
                  </Pagination.Prev>
                  {pages.map((page) => (
                    <Pagination.Item
                      key={page}
                      onClick={() => setSelectedPage(page)}
                      active={selectedPage === page}
                      disabled={page > Math.ceil(result.data.length / 7)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= Math.ceil(result.data.length / 7)}>
                    <CsLineIcons icon="chevron-right" />
                  </Pagination.Next>
                </Pagination>
              </nav>
            ) : null}
          </Row>
        </Card.Body>
      </Card>

      <Col className="d-flex justify-content-center gap-2 mt-4">
        <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => setShowModalAgeGroup(true)}>
          <CsLineIcons icon="check" /> <span>Criar uma avaliação antropométrica</span>
        </Button>
      </Col>

      <ModalAgeGroup showModal={showModalAgeGroup} setShowModal={setShowModalAgeGroup} />
      <ModalConfig />
      <DeleteConfirmation />
    </>
  );
}
