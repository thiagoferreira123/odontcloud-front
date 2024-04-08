import { useMemo, useState } from 'react';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import CreateButtons from './CreateButtons';
import SearchInput from './SearchInput';
import { useFilterStore } from './hooks/FilterStore';
import { useMyAnamnesisStore } from './hooks/MyAnamnesis';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import { useDeleteAnamnesisTemplateConfirmationModal } from './hooks/modals/DeleteAnamnesisTemplateConfirmationModal';
import AnamnesisModal from './modals';
import { useAnamnesisModalStore } from './hooks/modals/AnamnesisModalStore';

export default function MyAnamnesis() {
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useFilterStore((state) => state.query);

  const { getMyAnamnesis } = useMyAnamnesisStore();
  const { handleSelectAnamnesisToDelete } = useDeleteAnamnesisTemplateConfirmationModal();
  const { handleSelectAnamnesis } = useAnamnesisModalStore();

  const getAnamnesis_ = async () => {
    try {
      const response = await getMyAnamnesis();

      if (response === false) throw new Error('Failed to get templates');

      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;

      return [];
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

  const result = useQuery({ queryKey: ['my-anamnesis-templates'], queryFn: getAnamnesis_ });

  const filteredResults = result.data ? result.data.filter((meal) => String(meal.titulo).toLowerCase().includes(query.toLowerCase())) : [];

  const slicedResult = filteredResults ? filteredResults.slice(actualPage[0], actualPage[1]) : [];

  filteredResults.length && selectedPage > Math.ceil(filteredResults.length / 7) && setSelectedPage(Math.ceil(filteredResults.length / 7));

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Row className="d-flex align-items-end mt-3 mb-3">
            <div className="me-3 mb-3">
              <label className="mb-1">Busque pela anamnese</label>
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
            <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar anamneses</div>
          ) : !filteredResults.length ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <Empty message="Nenhuma anamnese encontrada" />
            </div>
          ) : (
            slicedResult.map((meal) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={meal.id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div>{meal.titulo}</div>
                  </Col>

                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-end">
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar refeição</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectAnamnesis(meal)}>
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Remover refeição</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectAnamnesisToDelete(meal)}>
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

      <DeleteConfirmationModal />
      <AnamnesisModal />
    </>
  );
}
