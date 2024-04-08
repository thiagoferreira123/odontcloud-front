import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, Card, Col, Form, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';

import ModalConfig from './modals/ModalConfig';
import DeleteConfirm from './modals/DeleteConfirm';
import { Link } from 'react-router-dom';

import useClassicPlans from './hooks/useClassicPlans';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import usePatientMenuStore from '../hooks/patientMenuStore';
import ModalTemplates from './modals/modalTemplates';
import CreateButtons from './CreateButtons';
import {
  getPlanCalories,
  getPlanCarbohydrates,
  getPlanCarbohydratesGrams,
  getPlanCarbohydratesGramsByWeight,
  getPlanCarbohydratesPercentage,
  getPlanLipids,
  getPlanLipidsGrams,
  getPlanLipidsGramsByWeight,
  getPlanLipidsPercentage,
  getPlanProteins,
  getPlanProteinsGrams,
  getPlanProteinsGramsByWeight,
  getPlanProteinsPercentage,
} from './utils/macrosHelpers';
import api from '../../../services/useAxios';
import { ClassicPlan } from '../../../types/PlanoAlimentarClassico';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import StaticLoading from '../../../components/loading/StaticLoading';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import Empty from '../../../components/Empty';
import { convertToDate, converterDias, isCurrentDateBetween } from '../../../services/useDateHelpers';

export const HistoriesClassicEatingPlan = () => {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState(1);
  const patientId = usePatientMenuStore((state) => state.patientId);
  const showModalConfig = useClassicPlans((state) => state.showModalConfig);

  const [showModalTemplates, setShowModalTemplates] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toastId = useRef<React.ReactText>();

  const getPlans = async () => {
    const response = await api.get<ClassicPlan[]>('/plano_alimentar/paciente/' + patientId);
    setPlans(response.data);
    return response.data;
  };

  const { setShowModalConfig } = useClassicPlans();
  const { setPlans, addPlan, setSelectedPlan, setSelectedTemplate, updatePlan } = useClassicPlans();

  const handleCloseModalConfig = () => setShowModalConfig(false);
  const handleEditPlanConfig = (plan?: ClassicPlan) => {
    setSelectedTemplate(undefined);
    setSelectedPlan(plan);
    setShowModalConfig(true);
  };

  const handleCloseDeleteConfirm = () => setShowDeleteConfirm(false);
  const handleShowDeleteConfirm = (plan: ClassicPlan) => {
    setSelectedPlan(plan);
    setShowDeleteConfirm(true);
  };

  const handleDuplicatePlan = async (plan: ClassicPlan) => {
    toastId.current = notify('Clonando plano alimentar, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const response = await api.post('/plano_alimentar/clone/' + plan.id, {
        nome: plan.nome + ' (clone)',
        tipoPlano: 0,
      });

      addPlan(response.data, queryClient);

      updateNotify(toastId.current, 'Plano alimentar clonado com sucesso!', 'Sucesso', 'check', 'success');
    } catch (error) {
      updateNotify(toastId.current, 'Erro ao clonar plano alimentar!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleTogglePlanVisibility = async (plan: ClassicPlan) => {
    try {

      if(!plan.id) throw new Error('Erro ao inativar plano');

      const payload: Partial<ClassicPlan> = {
        id: plan.id,
        visivel: plan.visivel ? 0 : 1,
        idPaciente: plan.idPaciente,
      };

      const response = await updatePlan(payload as ClassicPlan & { id: number }, queryClient);

      if (!response) throw new Error('Erro ao inativar plano');

      notify(`Plano alimentar ${!Number(plan.visivel) ? 'ativado' : 'inativado'} com sucesso`, 'Sucesso', 'check', 'success');
    } catch (error) {
      console.error(error);
      notify(`Ocorreu um erro ao ${!Number(plan.visivel) ? 'ativar' : 'inativar'} o plano alimentar`, 'Erro', 'close', 'danger');
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

  const result = useQuery({ queryKey: ['classic-plans', patientId], queryFn: getPlans, enabled: !!patientId });

  const slicedResult = result.data ? (result.data.length > 3 ? result.data.slice(actualPage[0], actualPage[1]) : result.data) : [];

  useEffect(() => {
    result.data?.length && selectedPage > Math.ceil(result.data.length / 3) && setSelectedPage(Math.ceil(result.data.length / 3));
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
            slicedResult.map((plan) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={plan.id}>
                <Row className="g-0">
                  <Col className="mb-2">
                    <div className="d-flex flex-column">
                      <div className="h5">
                        <strong>{plan.nome} {plan.visivel}</strong>
                      </div>
                      {plan.periodizacaoFim && plan.periodizacaoInicio ? (
                        <div className="h6">
                          <p className="mb-1">
                            {' '}
                            - Plano alimentar elaborado em <strong> {new Date(plan.data).toLocaleDateString()}</strong>{' '}
                          </p>
                          <p className="mb-1">
                            {' '}
                            - Para ser realizado nos dias: <strong> {plan.dias?.length ? converterDias(plan.dias[0]) : ''}</strong>
                          </p>
                          <p className="mb-1">
                            {' '}
                            - Periodização com início em <strong> {convertToDate(plan.periodizacaoInicio)?.toLocaleDateString()}</strong> e término em
                            <strong> {convertToDate(plan.periodizacaoFim)?.toLocaleDateString()}</strong>
                          </p>
                          <p className="mb-1">
                            {' '}
                            - Status da periodização:{' '}
                            <Badge bg={`${isCurrentDateBetween(plan) ? 'success' : 'danger'}`}>
                              {' '}
                              {isCurrentDateBetween(plan) ? 'Dentro do período de periodização' : 'Fora do período de periodização'}{' '}
                            </Badge>
                          </p>
                          <p className="mb-1"> - Resumo de macronutrientes e calorias: </p>
                        </div>
                      ) : (
                        <div className="text-muted mt-1">
                          Plano alimentar elaborado em {new Date(plan.data).toLocaleDateString()} destinado a ser aplicado às: segundas, terças, quartas,
                          sextas.
                        </div>
                      )}
                    </div>

                    <div className="d-flex flex-row mt-3">
                      <div className="d-flex flex-column align-items-center ms-5">
                        <div className="text-muted text-small">CHO</div>
                        <div className="text-alternate">
                          {getPlanCarbohydratesGrams(plan.meals)} g (<small>{getPlanCarbohydratesGramsByWeight(plan.meals, Number(plan.vrPeso))} g/kg</small>)
                        </div>
                        <div className="text-alternate">
                          {getPlanCarbohydrates(plan.meals)} kcal <small>({getPlanCarbohydratesPercentage(plan.meals)}%)</small>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-center ms-5">
                        <div className="text-muted text-small">PTN</div>
                        <div className="text-alternate">
                          {getPlanProteinsGrams(plan.meals)} g (<small>{getPlanProteinsGramsByWeight(plan.meals, Number(plan.vrPeso))} g/kg</small>)
                        </div>
                        <div className="text-alternate">
                          {getPlanProteins(plan.meals)} kcal <small>({getPlanProteinsPercentage(plan.meals)}%)</small>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-center ms-5">
                        <div className="text-muted text-small">LIP</div>
                        <div className="text-alternate">
                          {getPlanLipidsGrams(plan.meals)} g (<small>{getPlanLipidsGramsByWeight(plan.meals, Number(plan.vrPeso))} g/kg</small>)
                        </div>
                        <div className="text-alternate">
                          {getPlanLipids(plan.meals)} kcal <small>({getPlanLipidsPercentage(plan.meals)}%)</small>
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-center ms-5">
                        <div className="text-muted text-small">KCAL</div>
                        <div className="text-alternate">{getPlanCalories(plan.meals)} kcal</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-2 ">
                      <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Plano alimentar {plan.visivel ? 'visível' : 'invisível'} no painel</Tooltip>}>
                        <Form.Check
                          type="switch"
                          id="customSwitch"
                          defaultChecked={plan.visivel ? true : false}
                          onChange={() => handleTogglePlanVisibility(plan)}
                          className="ms-2 mb-2 d-flex align-items-center"
                        />
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
                          onClick={() => handleShowDeleteConfirm(plan)}
                        >
                          <CsLineIcons icon="bin" />
                        </Button>
                      </OverlayTrigger>{' '}
                      <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar o plano alimentar</Tooltip>}>
                        <Link
                          to={{
                            pathname: '/app/plano-alimentar-classico/' + plan.id,
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
                          onClick={() => handleEditPlanConfig(plan)}
                        >
                          <CsLineIcons icon="gear" />
                        </Button>
                      </OverlayTrigger>{' '}
                    </div>
                  </Col>
                </Row>
              </div>
            ))
          )}

          <Row className="mt-3 mb-3 justify-content-center">
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
        </Card.Body>
      </Card>

      <CreateButtons handleEditPlanConfig={handleEditPlanConfig} setShowModalTemplates={setShowModalTemplates} />

      <DeleteConfirm showModal={showDeleteConfirm} handleCloseModal={handleCloseDeleteConfirm} />
      <ModalConfig showModal={showModalConfig ?? false} handleCloseModal={handleCloseModalConfig} />
      <ModalTemplates show={showModalTemplates} closeModal={() => setShowModalTemplates(false)} />
    </>
  );
};

export default HistoriesClassicEatingPlan;
