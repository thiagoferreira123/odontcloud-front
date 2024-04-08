import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, ProgressBar, Row, Tooltip } from 'react-bootstrap';
import CreateGoalsModal from './modals/CreateGoalsModal';
import { useParams } from 'react-router-dom';
import useGoalsStore from './hooks/GoalStore';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import { convertIsoToBrDate } from '../../../helpers/DateHelper';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { calculateFrequencyBetweenDates, getPercentage } from './helpers';
import { useCreateGoalModalStore } from './hooks/ModalCreateGoalsStore';
import { useDeleteConfirmationModalStore } from './hooks/DeleteConfirmationModalStore';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';

export default function Goals() {
  const { id } = useParams<{ id: string }>();

  const [selectedPage, setSelectedPage] = useState(1);

  const { getGoal } = useGoalsStore();
  const { handleShowCreateGoalModal, handleSelectGoal } = useCreateGoalModalStore();
  const { handleSelectGoalToRemove } = useDeleteConfirmationModalStore();

  const getGoals_ = async () => {
    try {
      if (!id) throw new Error('Id não informado');

      const response = await getGoal(+id);

      if (response === false) throw new Error('Erro ao buscar metas');

      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) return [];
      else throw error;
    }
  };

  const actualPage = useMemo(() => {
    const actualIndex = (selectedPage - 1) * 3;
    return [actualIndex, actualIndex + 3];
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

  const result = useQuery({ queryKey: ['goals', Number(id)], queryFn: getGoals_, enabled: !!id });

  const slicedResult = result.data ? (result.data.length > 3 ? result.data.slice(actualPage[0], actualPage[1]) : result.data) : [];

  useEffect(() => {
    result.data?.length && selectedPage > Math.ceil(result.data.length / 3) && setSelectedPage(Math.ceil(result.data.length / 3));
  }, [result.data?.length, selectedPage]);

  return (
    <>
      {result.isLoading ? (
        <div className="h-50 d-flex justify-content-center align-items-center">
          <StaticLoading />
        </div>
      ) : result.isError ? (
        <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar metas</div>
      ) : !result.data?.length ? (
        <div className="h-50 d-flex justify-content-center align-items-center">
          <Empty message="Nenhuma meta encontrada" classNames="m-0" />
        </div>
      ) : (
        slicedResult.map((goal, index) => {
          const requiredFrequency = calculateFrequencyBetweenDates(goal.start_date, goal.end_date, goal.frequency, goal.period);
          const percentage = getPercentage(goal.recordsPatient?.length ?? 0, requiredFrequency);

          return (
            <Row className="g-0" key={goal.id}>
              <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                {index ? (
                  <div className="w-100 d-flex sh-30 justify-content-center position-relative">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                ) : (
                  <div className="w-100 d-flex sh-30" />
                )}
                <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                  <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                </div>
                {index >= slicedResult.length - 1 ? (
                  <div className="w-100 d-flex h-100" />
                ) : (
                  <div className="w-100 d-flex h-100 justify-content-center position-relative">
                    <div className="line-w-1 bg-separator h-100 position-absolute" />
                  </div>
                )}
              </Col>

              <Col className="mb-2">
                <Card className="h-100">
                  <Card.Body>
                    <Row className="g-0">
                      <Col>
                        <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                          <div className="d-flex flex-column">
                            <div className="d-flex flex-column justify-content-center">
                              <Button variant="link" className="p-0 heading text-start">
                                {goal.name}
                              </Button>
                            </div>
                            <div className="text-alternate ">Inicio: {convertIsoToBrDate(goal.start_date)}</div>
                            <div className="text-alternate">Fim: {convertIsoToBrDate(goal.end_date)}</div>
                            <div className="text-alternate mt-3">Progresso do paciente: {percentage}%</div>
                          </div>
                          <div>
                            <ProgressBar className="sh-3 mt-3" now={Number(percentage)} label={`${percentage}%`} />
                            <div className="d-flex justify-content-between">
                              <Col xl={3}>
                                <p className="mt-1 text-center font-weight-bold">{goal.recordsPatient?.length ?? 0}</p>
                              </Col>
                              <Col xl={4}>
                                <p className="mt-1 text-center font-weight-bold">
                                  {' '}
                                  Em andamento {goal.recordsPatient?.length ?? 0} de {requiredFrequency} ({`${percentage}%`})
                                </p>
                              </Col>
                              <Col xl={3}>
                                <p className="mt-1 text-center font-weight-bold">{requiredFrequency}</p>
                              </Col>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end">
                            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="btn-icon btn-icon-only mb-1 me-1"
                                onClick={() => handleSelectGoalToRemove(goal)}
                              >
                                <CsLineIcons icon="bin" />
                              </Button>
                            </OverlayTrigger>{' '}
                            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Editar</Tooltip>}>
                              <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only mb-1 me-1" onClick={() => handleSelectGoal(goal)}>
                                <CsLineIcons icon="edit" />
                              </Button>
                            </OverlayTrigger>{' '}
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          );
        })
      )}

      <Row className="mt-3 mb-3 ms-5 justify-content-center">
        {result.data && result.data.length > 3 ? (
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
                  disabled={page > Math.ceil(result.data.length / 3)}
                >
                  {page}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= Math.ceil(result.data.length / 3)}>
                <CsLineIcons icon="chevron-right" />
              </Pagination.Next>
            </Pagination>
          </nav>
        ) : null}
      </Row>

      <div className="d-flex justify-content-center mt-3">
        <Button variant="primary" className="mb-1 hover-scale-up" onClick={handleShowCreateGoalModal}>
          Criar uma nova meta
        </Button>
      </div>

      <CreateGoalsModal />
      <DeleteConfirmationModal />
    </>
  );
}
