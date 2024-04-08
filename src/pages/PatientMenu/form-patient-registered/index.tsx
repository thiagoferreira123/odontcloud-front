import { useState } from 'react';
import { Button, Card, Col, Pagination, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ModalFormSelectTemplate from './Modals/ModalFormSelectTemplate';
import ListItem from './ListItem';
import StaticLoading from '../../../components/loading/StaticLoading';
import { useQuery } from '@tanstack/react-query';
import { useAnsweredByPatiendFormStore } from './hooks/AnsweredByPatiendFormStore';
import ConfirmDeleteAnswerModal from '../../FormLoose/Modals/ConfirmDeleteAnswerModal';
import usePagination from '../../../hooks/usePagination';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useConfigFormModalStore } from './hooks/ConfigFormModalStore';
import ConfigFormModal from './Modals/ModalConfig';

export default function Forms() {
  const { id } = useParams<{ id?: string }>();

  const [showModalFormSelectTemplate, setShowModalFormSelectTemplate] = useState(false);

  const { getPatientAnswers } = useAnsweredByPatiendFormStore();

  const { selectedPage, setSelectedPage, actualPage, pages } = usePagination();
  const { showConfigFormModal } = useConfigFormModalStore();

  const getPatientAnswers_ = async () => {
    if (!id) throw new Error('Id do paciente não informado');

    const response = await getPatientAnswers(id);

    if (response === false) throw new Error('Erro ao buscar formulários do paciente');

    return response;
  };

  const result = useQuery({
    queryKey: ['patient-forms', id],
    queryFn: getPatientAnswers_,
    enabled: !!id,
  });
  const slicedResult = result.data ? (result.data.length > 7 ? result.data.slice(actualPage[0], actualPage[1]) : result.data) : [];

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          {!slicedResult.length ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <Empty classNames="m-0" message="Nenhum formulários encontrado" />
            </div>
          ) : result.isLoading ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <StaticLoading />
            </div>
          ) : (
            <Row>
              {slicedResult.map((answer, index) => (
                <ListItem answer={answer} key={index} />
              ))}
            </Row>
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

      <div className="d-flex justify-content-center">
        <Col className="d-flex justify-content-center mt-2">
          <Button size="lg" className="btn btn-primary btn-icon btn-icon-start mb-2 me-1" onClick={showConfigFormModal}>
            <CsLineIcons icon="plus" /> <span>Criar um novo formulário</span>
          </Button>

          <Button size="lg" className="btn btn-primary btn-icon btn-icon-start mb-2" onClick={() => setShowModalFormSelectTemplate(true)}>
            <CsLineIcons icon="star" /> <span>Usar um modelo de formulário</span>
          </Button>
        </Col>
      </div>

      <ModalFormSelectTemplate showModal={showModalFormSelectTemplate} setShowModal={setShowModalFormSelectTemplate} />
      <ConfirmDeleteAnswerModal />
      <ConfigFormModal />
    </>
  );
}
