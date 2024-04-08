import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';

import ModalConfig from './modals/ModalConfig';
import DeleteConfirm from './modals/DeleteConfirm';
import { Link } from 'react-router-dom';

import useClassicPlans from './hooks/useClassicPlans';
import { useQuery } from '@tanstack/react-query';
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
import { AxiosError } from 'axios';
import api from '../../../services/useAxios';
import { ClassicPlan } from '../../../types/PlanoAlimentarClassico';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import Empty from '../../../components/Empty';
import StaticLoading from '../../../components/loading/StaticLoading';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import SearchInput from './SearchInput';
import { escapeRegexCharacters } from '../../../helpers/SearchFoodHelper';

export const HistoriesClassicEatingPlan = () => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const plans = useClassicPlans((state) => state.plans);
  const query = useClassicPlans((state) => state.query);
  const showModalConfig = useClassicPlans((state) => state.showModalConfig);

  const toastId = useRef<React.ReactText>();

  const getPlans = async () => {
    try {
      const response = await api.get('/plano_alimentar/template/professional/');
      setPlans(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          setPlans([]);
          return [];
        }
      }

      throw error;
    }
  };

  const { setShowModalConfig } = useClassicPlans();
  const { setPlans, addPlan, setSelectedPlan, setSelectedTemplate } = useClassicPlans();

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
        tipoPlano: 1,
      });

      addPlan(response.data);

      updateNotify(toastId.current, 'Plano alimentar clonado com sucesso!', 'Sucesso', 'check', 'success');
    } catch (error) {
      updateNotify(toastId.current, 'Erro ao clonar plano alimentar!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

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

  const result = useQuery({ queryKey: ['classic-plans'], queryFn: getPlans });

  const filteredResults = result.data?.length
    ? plans.filter((plan: ClassicPlan) => escapeRegexCharacters(String(plan.nome)).includes(escapeRegexCharacters(query)))
    : [];

  const slicedResult = filteredResults ? filteredResults.slice(actualPage[0], actualPage[1]) : [];

  filteredResults.length && selectedPage > Math.ceil(filteredResults.length / 4) && setSelectedPage(Math.ceil(filteredResults.length / 4));

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Row className="d-flex align-items-end mt-3 mb-3">
            <div className="me-3 mb-3">
              <label className="mb-1">Busque pelo plano alimentar</label>
              <div className="w-100 w-md-auto search-input-container border border-separator">
                <SearchInput />
              </div>
            </div>
          </Row>

          {result.isLoading ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <StaticLoading />
            </div>
          ) : result.isError ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar planos alimentares</div>
          ) : !filteredResults.length ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <Empty message="Nenhum plano alimentar encontrado" />
            </div>
          ) : (
            slicedResult.map((plan) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={plan.id}>
                <Row className="g-0">
                  <Col className="mb-2">
                    <div className="d-flex flex-column">
                      <div className="h5">
                        <strong>{plan.nome}</strong>
                      </div>
                      <div className="text-muted mt-1">Plano alimentar elaborado em {new Date(plan.data).toLocaleDateString()}</div>
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
                      <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar o plano alimentar</Tooltip>}>
                        <Link
                          to={{
                            pathname: '/app/modelo-plano-alimentar-classico/' + plan.id,
                          }}
                          className="btn btn-outline-secondary btn-sm btn-icon btn-icon-only ms-1"
                        >
                          <CsLineIcons icon="edit" />
                        </Link>
                      </OverlayTrigger>{' '}
                      <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Alterar as configurações</Tooltip>}>
                        <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleEditPlanConfig(plan)}>
                          <CsLineIcons icon="gear" />
                        </Button>
                      </OverlayTrigger>{' '}
                      <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Duplicar plano alimentar</Tooltip>}>
                        <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleDuplicatePlan(plan)}>
                          <CsLineIcons icon="duplicate" />
                        </Button>
                      </OverlayTrigger>{' '}
                      <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir plano alimentar</Tooltip>}>
                        <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleShowDeleteConfirm(plan)}>
                          <CsLineIcons icon="bin" />
                        </Button>
                      </OverlayTrigger>{' '}
                    </div>
                  </Col>
                </Row>
              </div>
            ))
          )}

          <div className="d-flex justify-content-center mt-4">
            {result.data && filteredResults.length > 4 ? (
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
                      disabled={page > Math.ceil(filteredResults.length / 4)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= filteredResults.length / 4}>
                    <CsLineIcons icon="chevron-right" />
                  </Pagination.Next>
                </Pagination>
              </nav>
            ) : null}
          </div>
        </Card.Body>
      </Card>

      <CreateButtons handleEditPlanConfig={handleEditPlanConfig} />

      <DeleteConfirm showModal={showDeleteConfirm} handleCloseModal={handleCloseDeleteConfirm} />
      <ModalConfig showModal={showModalConfig ?? false} handleCloseModal={handleCloseModalConfig} />
    </>
  );
};

export default HistoriesClassicEatingPlan;
