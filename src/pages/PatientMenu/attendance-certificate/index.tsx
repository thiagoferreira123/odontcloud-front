import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import ModalCreateAttendanceCertificate from './modals/ModalCreateAttendanceCertificate';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useCreateAndEditModalStore } from './hooks/CreateAndEditModalStore';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import { useDeleteConfirmationModalStore } from './hooks/DeleteConfirmationModalStore';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';
import useCertificateStore from './hooks/CertificateStore';

export default function AttendanceCertificate() {
  const [selectedPage, setSelectedPage] = useState(1);

  const { id } = useParams();

  const { getCertificates } = useCertificateStore();
  const { openModal, handleSelectCertificateToEdit } = useCreateAndEditModalStore();
  const { handleSelectCertificateToRemove } = useDeleteConfirmationModalStore();

  const getCertificates_ = async () => {
    try {
      if (!id) throw new AppException('Id is required');

      const response = await getCertificates(id);

      if (response === false) throw new Error('Erro ao buscar atestados');

      return response;
    } catch (error) {
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
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

  const result = useQuery({ queryKey: ['patient-certificate', id], queryFn: getCertificates_, enabled: !!id });

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
            <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar atestados</div>
          ) : !result.data?.length ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <Empty message="Nenhuma atestado encontrada" classNames="m-0" />
            </div>
          ) : (
            slicedResult.map((attendance) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={attendance.certificate_id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-column">
                        <div>Emitido em: {attendance.certificate_date_emission}</div>
                      </div>
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleSelectCertificateToRemove(attendance)}
                          >
                            <CsLineIcons icon="bin" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Editar</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleSelectCertificateToEdit(attendance)}
                          >
                            <CsLineIcons icon="edit" />
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

      <div className="d-flex justify-content-center mt-3">
        <Button variant="primary" className="mb-1 hover-scale-up" onClick={openModal}>
          Criar um novo atestado
        </Button>
      </div>

      <DeleteConfirmationModal />
      <ModalCreateAttendanceCertificate />
    </>
  );
}
