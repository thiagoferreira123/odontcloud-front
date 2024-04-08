import { Alert, Badge, Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import SearchInput from './SearchInput';
import useAttachmentMaterialsStore from './hooks/AttachmentMaterialsStore';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import AttachmentViewButton from '../../MyMaterials/my-attachments/AttachmentViewButton';

export default function AttachmentMaterials() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useAttachmentMaterialsStore((state) => state.query);

  const { getAttachmentMaterials, postMaterialToPatient, deleteMaterialFromPatient } = useAttachmentMaterialsStore();

  const getAttachmentMaterials_ = useCallback(async () => {
    try {
      if (!id) throw new Error('Id not found');

      const response = await getAttachmentMaterials(+id);

      if(response === false) throw new Error('Erro ao buscar materiais');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [getAttachmentMaterials]);

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

  const result = useQuery({ queryKey: ['patient-attachments', id], queryFn: getAttachmentMaterials_ });

  const filteredResults = result.data ? result.data.filter((attachment) => String(attachment.name).toLowerCase().includes(query.toLowerCase())) : [];

  const slicedResult = filteredResults ? filteredResults.slice(actualPage[0], actualPage[1]) : [];

  useEffect(() => {
    result.data?.length && selectedPage > Math.ceil(result.data.length / 7) && setSelectedPage(Math.ceil(result.data.length / 7));
  }, [result.data?.length, selectedPage]);

  return (
    <>
      <Card>
        <Card.Body className="mb-n3">
          <Row>
          <div className="mb-3">
            <Row className="g-0 sh-6 text-center">
              <Alert className="mb-2">Escolha os materiais para compartilhar com o paciente através do aplicativo móvel e do painel do paciente.</Alert>
            </Row>
          </div>

          </Row>

          <div className="mb-3 mt-3">
            <div className="w-100 w-md-auto search-input-container border border-separator mt-3">
              <SearchInput />
            </div>
          </div>

          {result.isLoading ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <StaticLoading />
            </div>
          ) : result.isError ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar materiais</div>
          ) : !filteredResults.length ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <Empty message="Nenhum material encontrado" />
            </div>
          ) : (
            slicedResult.map((attachment) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={attachment.id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-column">
                        <div>{attachment.name}</div>
                        <div>
                          {attachment.tags.map((tag) => (
                            <Badge bg="primary" className="me-1" key={tag.id}>
                              {' '}
                              <CsLineIcons icon="tag" className="me-1" size={15} />
                              {tag.tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="d-flex">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id="tooltip-filter">Ficará visivel para o paciente através do app mobile e painel do paciente</Tooltip>}
                        >
                          <Button
                            variant={attachment.selecoesPaciente[0]?.active ? 'primary' : 'outline-secondary'}
                            size="sm"
                            className="ms-1"
                            onClick={() =>
                              id &&
                              (attachment.selecoesPaciente[0]?.active
                                ? deleteMaterialFromPatient(attachment, queryClient)
                                : postMaterialToPatient(attachment, +id, queryClient))
                            }
                          >
                            {attachment.selecoesPaciente[0]?.active ? 'Descompatilhar' : 'Compatilhar'}
                          </Button>
                        </OverlayTrigger>
                        <AttachmentViewButton attachment={attachment} />
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
    </>
  );
}
