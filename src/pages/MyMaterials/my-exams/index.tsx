import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { useMyExamsStore } from './hooks/MyExamsStore';
import { useModalDeleteConfirmationStore } from './hooks/ModalDeleteConfirmationStore';
import DeleteConfirm from './modals/DeleteConfirm';
import CreateButtons from './CreateButtons';
import SearchInput from './SearchInput';
import { useModalAddExamBloodStore } from '../../RequestingExams/hooks/ModalAddExamBloodStore';
import { Exam } from '../../../types/RequestingExam';
import { escapeRegexCharacters } from '../../../helpers/SearchFoodHelper';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import ModalAddExamBlood from '../../RequestingExams/Modals/ModalAddExamBlood';

export default function MyExams() {
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useMyExamsStore((state) => state.query);

  const { getExams } = useMyExamsStore();
  const { handleDeleteExamConfirm } = useModalDeleteConfirmationStore();
  const { handleSelectExam } = useModalAddExamBloodStore();

  const getExams_ = useCallback(async () => {
    try {
      const response = await getExams();

      if (response === false) throw new Error('Erro ao buscar exames');

      return response;
    } catch (error) {
      return [];
    }
  }, [getExams]);

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

  const result = useQuery({ queryKey: ['my-exams'], queryFn: getExams_ });
  const filteredResults = result.data
    ? result.data?.filter((exam: Exam) => escapeRegexCharacters(String(exam.examName)).includes(escapeRegexCharacters(query)))
    : [];
  const slicedResult = result.data ? (filteredResults.length > 7 ? filteredResults.slice(actualPage[0], actualPage[1]) : filteredResults) : [];

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Row className="d-flex align-items-end mt-3 mb-3">
            <div className="me-3 mb-3">
              <label className="mb-1">Busque pelo exame</label>
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
              <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar por exames</div>
            </div>
          ) : !filteredResults.length ? (
            <Empty classNames="m-0" message="Nenhum exame encontrado" />
          ) : (
            slicedResult.map((exam) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={exam.id}>
                <Row className="g-0 sh-6">
                  <Col className="ms-2 d-flex align-items-center">
                    <div>{exam.examName}</div>
                  </Col>
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-end">
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar exame</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectExam(exam)}>
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Remover exame</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleDeleteExamConfirm(exam)}>
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

      <ModalAddExamBlood />
      <DeleteConfirm />
    </>
  );
}
