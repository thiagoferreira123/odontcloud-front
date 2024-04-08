import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { useMyReplacementListStore } from './hooks/MyReplacementListStore';
import ModalReplacementLists from './modals/ModalReplacementLists';
import DeleteConfirm from './DeleteConfirm';
import { useModalStore } from './hooks/ModalStore';
import CreateButtons from './CreateButtons';
import SearchInput from './SearchInput';
import { EquivalentEatingPlanCustomList } from '../../../types/PlanoAlimentarEquivalente';
import { escapeRegexCharacters } from '../../../helpers/SearchFoodHelper';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

export default function ReplacementList() {
  const lists = useMyReplacementListStore((state) => state.lists);
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useMyReplacementListStore((state) => state.query);

  const { getEquivalentEatingPlanCustomList, handleSelectList } = useMyReplacementListStore();
  const { handleShowDeleteConfirmationModal } = useModalStore();

  const getEquivalentEatingPlanCustomList_ = useCallback(async () => {
    try {
      const response = await getEquivalentEatingPlanCustomList();

      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) return [];

      console.error(error);

      throw error;
    }
  }, [getEquivalentEatingPlanCustomList]);

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

  const result = useQuery({ queryKey: ['my-replacement-lists'], queryFn: getEquivalentEatingPlanCustomList_ });

  const filteredResults = result.data
    ? lists.filter((list: EquivalentEatingPlanCustomList) => escapeRegexCharacters(String(list.nome_lista)).includes(escapeRegexCharacters(query)))
    : [];

  const slicedResult = filteredResults ? filteredResults.slice(actualPage[0], actualPage[1]) : [];

  filteredResults.length && selectedPage > Math.ceil(filteredResults.length / 7) && setSelectedPage(Math.ceil(filteredResults.length / 7));

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Row className="d-flex align-items-end mt-3 mb-3">
            <div className="me-3 mb-3">
              <label className="mb-1">Busque pela lista</label>
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
            <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar listas</div>
          ) : !filteredResults.length ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <Empty message='Nenhuma lista encontrada' />
            </div>
          ) : (
            slicedResult.map((list) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={list.id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div>{list.nome_lista}</div>
                  </Col>
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-end">
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar lista</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectList(list)}>
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Remover lista</Tooltip>}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="btn-icon btn-icon-only ms-1"
                            onClick={() => handleShowDeleteConfirmationModal(list)}
                          >
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
                  <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= result.data.length / 7}>
                    <CsLineIcons icon="chevron-right" />
                  </Pagination.Next>
                </Pagination>
              </nav>
            ) : null}
          </div>
        </Card.Body>
      </Card>

      <CreateButtons />

      <ModalReplacementLists />
      <DeleteConfirm />
    </>
  );
}
