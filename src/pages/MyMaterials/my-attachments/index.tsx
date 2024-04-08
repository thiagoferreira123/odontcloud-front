import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Card, Button, Alert, Row, Col, OverlayTrigger, Tooltip, Pagination, Badge } from 'react-bootstrap';
import AddAttachments from './modals/AddAttachments';
import { Attachment, useMyAttachmentStore } from './hooks';
import { useQuery } from '@tanstack/react-query';
import SearchInput from './SearchInput';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import { useDeleteAttachmentConfirmationModal } from './hooks/DeleteAttachmentConfirmationModal';
import { useAddAttachmentsModalStore } from './hooks/AddAttachmentsModalStore';
import AttachmentViewButton from './AttachmentViewButton';

export default function MyAttachments() {
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useMyAttachmentStore((state) => state.query);

  const { getAttachments } = useMyAttachmentStore();

  const { handleSelectAttachmentToDelete } = useDeleteAttachmentConfirmationModal();
  const { openModal, handleSelectAttachmentToEdit } = useAddAttachmentsModalStore();

  const getAttachments_ = useCallback(async () => {
    try {
      const response = await getAttachments();

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [getAttachments]);

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

  const result = useQuery({ queryKey: ['my-attachments'], queryFn: getAttachments_ });

  const filteredResults = result.data
    ? result.data.filter((attachment: Attachment) => String(attachment.name).toLowerCase().includes(query.toLowerCase()))
    : [];

  const slicedResult = filteredResults ? filteredResults.slice(actualPage[0], actualPage[1]) : [];

  useEffect(() => {
    filteredResults.length && selectedPage > Math.ceil(filteredResults.length / 7) && setSelectedPage(Math.ceil(filteredResults.length / 7));
  }, [filteredResults.length, selectedPage]);

  return (
    <>
      <Card>
        <Card.Body>
          <Alert className="p-3">
            Cadastre no OdontCloud materiais que são rotineiramente empregados durante suas consultas, tornando-os acessíveis a todos os seus pacientes. Esses
            materiais podem abranger diversos formatos, como PDFs, imagens, documentos de texto e até mesmo hiperlinks. Acesse o menu do paciente para
            disponibilizá-los.
          </Alert>

          <div className="me-3 mb-3">
            <label className="mb-1">Busque pelo material</label>
            <div className="w-100 w-md-auto search-input-container border border-separator">
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
                  </Col>
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-end">
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar material</Tooltip>}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="btn-icon btn-icon-only ms-1"
                            onClick={() => handleSelectAttachmentToEdit(attachment)}
                          >
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Remover material</Tooltip>}>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="btn-icon btn-icon-only ms-1"
                            onClick={() => handleSelectAttachmentToDelete(attachment)}
                          >
                            <CsLineIcons icon="bin" />
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

      <div className="text-center mt-3">
        <Button onClick={openModal}>Cadastrar material</Button>
      </div>

      <AddAttachments />
      <DeleteConfirmationModal />
    </>
  );
}
