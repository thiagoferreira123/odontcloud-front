import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { useMyManipulatedFormulasStore } from './hooks/MyManipulatedFormulasStore';
import { useModalDeleteConfirmationStore } from './hooks/ModalDeleteConfirmationStore';
import DeleteConfirm from './modals/DeleteConfirm';
import CreateButtons from './CreateButtons';
import SearchInput from './SearchInput';
import { ITemplate, useTemplateStore } from '../../ManipulatedFormulas/hooks/TemplateStore';
import { useModalAddFormulatedStore } from '../../ManipulatedFormulas/hooks/modals/ModalAddFormulatedStore';
import ModalAddFormulated from '../../ManipulatedFormulas/modals/ModalAddFormulated';
import { escapeRegexCharacters } from '../../../helpers/SearchFoodHelper';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

export default function MyTemplates() {
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useMyManipulatedFormulasStore((state) => state.query);

  const { getMyTemplates } = useTemplateStore();
  const { handleDeleteTemplateConfirm } = useModalDeleteConfirmationStore();
  const { handleSelectTemplate } = useModalAddFormulatedStore();

  const getMyTemplates_ = useCallback(async () => {
    try {
      const response = await getMyTemplates();

      if (response === false) throw new Error('Erro ao buscar modelos de fórmulas manipuladas');

      return response;
    } catch (error) {
      return [];
    }
  }, [getMyTemplates]);

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

  const result = useQuery({ queryKey: ['my-manipulated-formula-templates'], queryFn: getMyTemplates_ });
  const filteredResults = result.data
    ? result.data?.filter((tempalte: ITemplate) => escapeRegexCharacters(String(tempalte.nome)).includes(escapeRegexCharacters(query)))
    : [];
  const slicedResult = result.data ? (filteredResults.length > 7 ? filteredResults.slice(actualPage[0], actualPage[1]) : filteredResults) : [];

  filteredResults.length && selectedPage > Math.ceil(filteredResults.length / 7) && setSelectedPage(Math.ceil(filteredResults.length / 7));

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Row className="d-flex align-items-end mt-3 mb-3">
            <div className="me-3 mb-3">
              <label className="mb-1">Busque pela fórmula manipulada</label>
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
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar por fórmulas manipuladas</div>
            </div>
          ) : !filteredResults.length ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <Empty classNames="m-0" message="Nenhuma fórmula manipulada encontrada" />
            </div>
          ) : (
            slicedResult.map((tempalte) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={tempalte.id}>
                <Row className="g-0 sh-6">
                  <Col className="ms-2 d-flex align-items-center">
                    <div>{tempalte.nome}</div>
                  </Col>
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-end">
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar fórmula manipulada</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectTemplate(tempalte)}>
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Remover fórmula manipulada</Tooltip>}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="btn-icon btn-icon-only ms-1"
                            onClick={() => handleDeleteTemplateConfirm(tempalte)}
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

      <ModalAddFormulated />
      <DeleteConfirm />
    </>
  );
}
