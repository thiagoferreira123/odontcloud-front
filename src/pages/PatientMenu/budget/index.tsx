import React, { useEffect, useMemo, useState } from 'react';
import {Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useDeleteConfirmationModalStore } from './hooks/DeleteConfirmationModalStore';
import { useConfigModalStore } from './hooks/ConfigModalStore';
import { Link } from 'react-router-dom';
import { appRoot } from '../../../routes';
import useCarePlanBudgetStore from './hooks/CarePlanBudgetStore';
import ConfigModal from './modals/ConfigModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';


export default function CarePlanBudget() {
  const [selectedPage, setSelectedPage] = useState(1);

  const { id } = useParams();

  const { getCarePlanBudgets } = useCarePlanBudgetStore();
  const { handleSelectCarePlanBudgetToRemove } = useDeleteConfirmationModalStore();
  const { handleShowModal, handleSelectCarePlanBudget } = useConfigModalStore();

  const getCarePlanBudgets_ = async () => {
    try {
      if (!id) throw new Error('Id is required');

      const response = await getCarePlanBudgets(id);

      if (response === false) throw new Error('Erro ao buscar orçamentos');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
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

  const result = useQuery({ queryKey: ['carePlanBudgets', id], queryFn: getCarePlanBudgets_, enabled: !!id});

  const slicedResult = result.data ? (result.data.length > 7 ? result.data.slice(actualPage[0], actualPage[1]) : result.data) : [];

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
            <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar orçamentos</div>
          ) : !result.data?.length ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <Empty message="Nenhuma orçamento encontrado" classNames="m-0" />
            </div>
          ) : (
            slicedResult.map((careplan) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={careplan.budget_id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-column">
                        <div>Identificação: {careplan.budget_name}</div>
                        <div>Plano de tratamento criado em: {new Date(careplan.budget_date_creation).toLocaleDateString()}</div>
                      </div>
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleSelectCarePlanBudgetToRemove(careplan)}
                          >
                            <CsLineIcons icon="bin" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar o plano alimentar</Tooltip>}>
                          <Link
                            to={{
                              pathname: `${appRoot}/orcamento/${careplan.budget_id}`,
                            }}
                            className="btn btn-outline-primary btn-sm btn-icon btn-icon-only mb-1 me-1"
                          >
                            <CsLineIcons icon="edit" />
                          </Link>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Alterar as configurações</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleSelectCarePlanBudget(careplan)}
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

      <DeleteConfirmationModal />
      <ConfigModal />
    </>
  );
}