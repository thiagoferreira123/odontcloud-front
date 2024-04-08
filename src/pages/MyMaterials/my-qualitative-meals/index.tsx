import React, { useEffect, useMemo, useState } from 'react';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import { Badge, Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useConfigQualitativeMealModalStore } from './hooks/ConfigQualitativeMealModal';
import { useDeleteQualitativeMealConfirmationModal } from './hooks/DeleteQualitativeMealConfirmationModal';
import ConfigQualitativeMealModal from './modals/ConfigQualitativeMealModal';
import { useFilterStore } from './hooks/FilterStore';
import { useMyQualitativeMealsStore } from './hooks/MyQualitativeMeals';
import CreateButtons from './CreateButtons';
import SearchInput from './SearchInput';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';

export default function MyQualitativeMeals() {
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useFilterStore((state) => state.query);

  const { getMyQualitativeMeals } = useMyQualitativeMealsStore();
  const { handleSelectMeal } = useConfigQualitativeMealModalStore();
  const { handleSelectMealToDelete } = useDeleteQualitativeMealConfirmationModal();

  const getMeals_ = async () => {
    try {
      const response = await getMyQualitativeMeals();

      if (response === false) throw new Error('Failed to get templates');

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

  const result = useQuery({ queryKey: ['my-qualitative-meals'], queryFn: getMeals_ });

  const filteredResults = result.data ? result.data.filter((meal) => String(meal.name).toLowerCase().includes(query.toLowerCase())) : [];

  const slicedResult = filteredResults ? filteredResults.slice(actualPage[0], actualPage[1]) : [];

  filteredResults?.length && selectedPage > Math.ceil(filteredResults.length / 7) && setSelectedPage(Math.ceil(filteredResults.length / 7));

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Row className="d-flex align-items-end mt-3 mb-3">
            <div className="me-3 mb-3">
              <label className="mb-1">Busque pela refeição</label>
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
            <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar refeições</div>
          ) : !slicedResult.length ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <Empty message="Nenhuma refeição encontrada" />
            </div>
          ) : (
            slicedResult.map((meal) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={meal.id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div>{meal.name}</div>
                    {meal.category ? (
                      <div>
                        <Badge bg="primary" className="me-1">
                          {' '}
                          <CsLineIcons icon="tag" className="me-1" size={15} />
                          {meal.category}
                        </Badge>
                      </div>
                    ) : null}
                  </Col>

                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-end">
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar refeição</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectMeal(meal)}>
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Remover refeição</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectMealToDelete(meal)}>
                            <CsLineIcons icon="bin" />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ))
          )}

          <div className="d-flex justify-content-center mt-4">
            {result.data && filteredResults.length > 7 ? (
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
                      disabled={page > Math.ceil(filteredResults.length / 7)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= filteredResults.length / 7}>
                    <CsLineIcons icon="chevron-right" />
                  </Pagination.Next>
                </Pagination>
              </nav>
            ) : null}
          </div>
        </Card.Body>
      </Card>

      <CreateButtons />

      <ConfigQualitativeMealModal />

      <DeleteConfirmationModal />
    </>
  );
}
