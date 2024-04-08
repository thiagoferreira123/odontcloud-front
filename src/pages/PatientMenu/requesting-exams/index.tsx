import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import { useRequestingExamsStore } from './hooks/RequestingExamsStore';
import { useModalStore } from './hooks/ModalStore';
import DeleteConfirm from './modals/DeleteConfirm';
import ModalConfig from './modals/ConfigModalStore';
import { useConfigModalStore } from './hooks/ConfigModalStore';
import ModalUploadExamPDF from './modals/ModalUploadExamPDF';
import { RequestingExam, isRequestingExam } from '../../../types/RequestingExam';
import { notify, updateNotify } from '../../../components/toast/NotificationIcon';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';

export default function HistoryOfRequestingExams() {
  const { id } = useParams();

  const toastId = useRef<React.ReactText>();
  const [selectedPage, setSelectedPage] = useState(1);
  const [loadingDuplicateButtons, setLoadingDuplicateButtons] = useState<string[]>([]);
  const [showModalUploadExamPDF, setShowModalUploadExamPDF] = useState(false);

  const exams = useRequestingExamsStore((state) => state.exams);

  const { getExams, duplicateExam } = useRequestingExamsStore();
  const { handleDeleteExam } = useModalStore();
  const { handleSelectExam } = useConfigModalStore();

  const handleCreateExam = () => {
    try {
      if (!id) throw new Error('id is required');

      const paylosd: RequestingExam = {
        patientId: +id,
        requestDate: new Date(),
        examsSelected: [],
      };
      handleSelectExam(paylosd);
    } catch (error) {
      notify('Erro ao tentar criar solicitaçã ode exame', 'Erro', 'close', 'danger');
    }
  };

  const handleDuplicateExam = async (exam: RequestingExam) => {
    toastId.current = notify('Duplicando solicitação de exame, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      if (!exam.id) throw new Error('id is required');
      if (!isRequestingExam(exam)) throw new Error('exam is not a requesting exam');

      setLoadingDuplicateButtons([...loadingDuplicateButtons, exam.id]);

      const response = await duplicateExam(exam);

      if (response === false) throw new Error('Erro ao tentar duplicar solicitação de exame');

      updateNotify(toastId.current, 'Solicitação de exame duplicada com sucesso', 'Sucesso', 'check', 'success');
      setLoadingDuplicateButtons(loadingDuplicateButtons.filter((id) => id !== exam.id));
    } catch (error) {
      setLoadingDuplicateButtons(loadingDuplicateButtons.filter((id) => id !== exam.id));
      updateNotify(toastId.current, 'Erro ao tentar duplicar solicitação de exame', 'Erro', 'close', 'danger');
    }
  };

  const getExams_ = async () => {
    try {
      if (!id) throw new Error('id is required');

      const response = await getExams(+id);

      if (response === false) throw new Error('Erro ao buscar exames solicitados');

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return [];
        }

        if (error.response?.data?.message) {
          notify(error.response.data.message, 'Erro', 'close', 'danger');
        }
      }

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

  const result = useQuery({ queryKey: ['requesting-exams', id], queryFn: getExams_ });

  const slicedResult = result.data ? (result.data.length > 7 ? exams.slice(actualPage[0], actualPage[1]) : exams) : [];

  useEffect(() => {
    selectedPage > Math.ceil(exams.length / 7) && setSelectedPage(Math.ceil(exams.length / 7));
  }, [exams.length, selectedPage]);

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          {result.isLoading ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <StaticLoading />
            </div>
          ) : result.isError ? (
            <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar solicitações de exame</div>
          ) : !result.data?.length ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <Empty message="Nenhuma solicitação de  encontrada" classNames="m-0" />
            </div>
          ) : (
            slicedResult.map((exam) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={exam.id}>
                {isRequestingExam(exam) ? (
                  <Row className="g-0 sh-6">
                    <Col>
                      <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                          <div>Solicitação de exames realizada em: {new Date(exam.requestDate).toLocaleDateString()}</div>
                        </div>
                        <div className="d-flex">
                          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Liberar visualização no painel do paciente</Tooltip>}>
                            <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only mb-1 me-1">
                              <CsLineIcons icon="eye" />
                            </Button>
                          </OverlayTrigger>{' '}
                          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Duplicar solicitação</Tooltip>}>
                            <span>
                              <AsyncButton
                                isSaving={loadingDuplicateButtons.includes(exam.id ?? '')}
                                variant="outline-primary"
                                size="sm"
                                loadingText=" "
                                className="btn-icon btn-icon-only mb-1 me-1"
                                onClickHandler={() => handleDuplicateExam(exam)}
                              >
                                <CsLineIcons icon="duplicate" />
                              </AsyncButton>
                            </span>
                          </OverlayTrigger>{' '}
                          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
                            <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only mb-1 me-1" onClick={() => handleDeleteExam(exam)}>
                              <CsLineIcons icon="bin" />
                            </Button>
                          </OverlayTrigger>{' '}
                          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Editar</Tooltip>}>
                            <Link
                              to={{
                                pathname: '/app/solicitacao-exames/' + exam.id,
                              }}
                              className="btn btn-outline-primary btn-sm btn-icon btn-icon-only mb-1 me-1"
                            >
                              <CsLineIcons icon="edit" />
                            </Link>
                          </OverlayTrigger>{' '}
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row className="g-0 sh-6">
                    <Col>
                      <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                          <div>
                            {exam.fileName} - {new Date(exam.dataCreation).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="d-flex">
                          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Download PDF</Tooltip>}>
                            <Link to={exam.linkAwsS3} className="btn btn-outline-primary btn-sm btn-icon btn-icon-only mb-1 me-1">
                              <CsLineIcons icon="print" />
                            </Link>
                          </OverlayTrigger>{' '}
                          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
                            <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only mb-1 me-1" onClick={() => handleDeleteExam(exam)}>
                              <CsLineIcons icon="bin" />
                            </Button>
                          </OverlayTrigger>{' '}
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
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
                      disabled={page > Math.ceil(exams.length / 7)}
                    >
                      {page}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= Math.ceil(exams.length / 7)}>
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
          <Button className="btn btn-primary btn-icon btn-icon-start mb-2  me-2" onClick={handleCreateExam}>
            <CsLineIcons icon="plus" /> <span>Criar uma solicitação</span>
          </Button>
          <Button className="btn btn-primary btn-icon btn-icon-start mb-2" onClick={() => setShowModalUploadExamPDF(true)}>
            <CsLineIcons icon="upload" /> <span>Anexar o PDF de exames anteriores</span>
          </Button>
        </Col>
      </div>

      <ModalUploadExamPDF showModal={showModalUploadExamPDF} setShowModal={setShowModalUploadExamPDF} />
      <DeleteConfirm />
      <ModalConfig />
    </>
  );
}
