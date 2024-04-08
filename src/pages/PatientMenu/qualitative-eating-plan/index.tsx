import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, Card, Col, Form, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import CreateButtons from './CreateButtons';
import ConfigModal from './modals/ConfigModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import usePatientMenuStore from '../hooks/patientMenuStore';
import useQualitativeEatingPlans from './hooks/eating-plan';
import { useConfigModalStore } from './hooks/ConfigModalStore';
import { useDeletConfirmationModalStore } from './hooks/DeletConfirmationModalStore';
import { QualitativeEatingPlan } from './hooks/eating-plan/types';
import { convertIsoToBrDate } from '../../../helpers/DateHelper';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import { parseQualitativePlanToWeekdaysString, simpleIsCurrentDateBetween } from '../../../services/useDateHelpers';

export const QualitativeEatingPlans = () => {
  const patientId = usePatientMenuStore((state) => state.patientId);
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState(1);

  const toastId = useRef<React.ReactText>();

  const actualPage = useMemo(() => {
    const actualIndex = (selectedPage - 1) * 4;
    return [actualIndex, actualIndex + 4];
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

  const { handleSelectQualitativeEatingPlan } = useConfigModalStore();
  const { handleDeleteQualitativeEatingPlan } = useDeletConfirmationModalStore();
  const { getPlans, clone, updatePlan } = useQualitativeEatingPlans();

  const getPlans_ = async () => {
    try {
      const response = await getPlans(patientId);

      if (response === false) throw new Error('Could not find qualitative eating plan');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDuplicatePlan = async (plan: QualitativeEatingPlan) => {
    toastId.current = notify('Clonando plano alimentar, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const response = await clone(plan, queryClient);

      if (response === false) throw new Error('Erro ao clonar plano alimentar');
      updateNotify(toastId.current, 'Plano alimentar clonado com sucesso!', 'Sucesso', 'check', 'success');
    } catch (error) {
      updateNotify(toastId.current, 'Erro ao clonar plano alimentar!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleTogglePlanVisibility = async (plan: QualitativeEatingPlan) => {
    try {
      const payload: Partial<QualitativeEatingPlan> = {
        id: plan.id,
        visivel: plan.visivel ? 0 : 1,
        patient_id: plan.patient_id,
      };

      const response = await updatePlan(payload as QualitativeEatingPlan & { id: number }, queryClient, true);

      if (!response) throw new Error('Erro ao inativar plano');

      notify(`Plano alimentar ${!Number(plan.visivel) ? 'ativado' : 'inativado'} com sucesso`, 'Sucesso', 'check', 'success');
    } catch (error) {
      console.error(error);
      notify(`Ocorreu um erro ao ${!Number(plan.visivel) ? 'ativar' : 'inativar'} o plano alimentar`, 'Erro', 'close', 'danger');
    }
  };

  const result = useQuery({ queryKey: ['qualitative-eating-plans', patientId], queryFn: getPlans_ });

  const slicedResult = result.data ? (result.data.length > 4 ? result.data.slice(actualPage[0], actualPage[1]) : result.data) : [];

  useEffect(() => {
    result.data?.length && selectedPage > Math.ceil(result.data.length / 4) && setSelectedPage(Math.ceil(result.data.length / 4));
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
            <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar planos alimentares</div>
          ) : !result.data?.length ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <Empty message="Nenhum plano alimentar encontrado" classNames="m-0" />
            </div>
          ) : (
            <>
              {slicedResult.map((plan) => (
                <div className="border-bottom border-separator-light mb-2 pb-2" key={plan.id}>
                  <Row className="g-0" key={plan.id}>
                    <Col>
                      <div className="d-flex flex-column">
                        <div className="h5">
                          <strong>{plan.name}</strong>
                        </div>
                        {plan.periodizationEnd && plan.periodizationStart ? (
                          <div className="h6">
                            <p className="mb-1">
                              {' '}
                              - Plano alimentar elaborado em <strong> {new Date(plan.creationDate).toLocaleDateString()}</strong>{' '}
                            </p>
                            <p className="mb-1">
                              {' '}
                              - Para ser realizado nos dias: <strong> {parseQualitativePlanToWeekdaysString(plan)}</strong>
                            </p>
                            <p className="mb-1">
                              {' '}
                              - Periodização com início em <strong> {convertIsoToBrDate(plan.periodizationStart)}</strong> e término em
                              <strong> {convertIsoToBrDate(plan.periodizationEnd)}</strong>
                            </p>
                            <p className="mb-1">
                              {' '}
                              - Status da periodização:{' '}
                              <Badge
                                bg={`${simpleIsCurrentDateBetween(String(plan.periodizationStart), String(plan.periodizationEnd)) ? 'success' : 'danger'}`}
                              >
                                {' '}
                                {simpleIsCurrentDateBetween(String(plan.periodizationStart), String(plan.periodizationEnd))
                                  ? 'Dentro do período de periodização'
                                  : 'Fora do período de periodização'}{' '}
                              </Badge>
                            </p>
                          </div>
                        ) : (
                          <div className="h6">
                            <p className="mb-1">
                              {' '}
                              - Plano alimentar elaborado em <strong> {new Date(plan.creationDate).toLocaleDateString()}</strong>{' '}
                            </p>
                            <p className="mb-1">
                              {' '}
                              - Para ser realizado nos dias: <strong> {parseQualitativePlanToWeekdaysString(plan)}</strong>
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-end mt-2 ">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Plano alimentar {plan.visivel ? 'visível' : 'invisível'} no painel e aplicativo de celular</Tooltip>}>
                          <Form.Check
                            type="switch"
                            id="customSwitch"
                            defaultChecked={plan.visivel ? true : false}
                            onChange={() => handleTogglePlanVisibility(plan)}
                            className="ms-2 mb-2 d-flex align-items-center"
                          />
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar o plano alimentar</Tooltip>}>
                          <Link
                            to={{
                              pathname: '/app/plano-alimentar-qualitativo/' + plan.id,
                            }}
                            className="btn btn-primary btn-sm btn-icon btn-icon-only mb-1 ms-1 hover-scale-up"
                          >
                            <CsLineIcons icon="edit" />
                          </Link>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Alterar as configurações</Tooltip>}>
                          <Button
                            variant="primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 ms-1 hover-scale-up"
                            onClick={() => handleSelectQualitativeEatingPlan(plan)}
                          >
                            <CsLineIcons icon="gear" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Duplicar plano alimentar</Tooltip>}>
                          <Button
                            variant="primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 ms-1 hover-scale-up"
                            onClick={() => handleDuplicatePlan(plan)}
                          >
                            <CsLineIcons icon="duplicate" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir plano alimentar</Tooltip>}>
                          <Button
                            variant="primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 ms-1 hover-scale-up"
                            onClick={() => handleDeleteQualitativeEatingPlan(plan)}
                          >
                            <CsLineIcons icon="bin" />
                          </Button>
                        </OverlayTrigger>{' '}
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </>
          )}

          <Row className="mt-3 mb-3 justify-content-center">
            {result.data && result.data.length > 4 ? (
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
                      disabled={page > Math.ceil(result.data.length / 4)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= Math.ceil(result.data.length / 4)}>
                    <CsLineIcons icon="chevron-right" />
                  </Pagination.Next>
                </Pagination>
              </nav>
            ) : null}
          </Row>
        </Card.Body>
      </Card>

      <CreateButtons />

      <ConfigModal />
      <DeleteConfirmationModal />
      {/* <ModalTemplates show={showModalTemplates} closeModal={() => setShowModalTemplates(false)} /> */}
    </>
  );
};

export default QualitativeEatingPlans;
