import { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import usePatientFolderStore from './hooks/PatientFolderStore';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import PatientFolderDropzone from './PatientFolderDropzone';
import AsyncButton from '../../../components/AsyncButton';
import DeleteConfirmationModal from './modals/DeleteConfirmation';
import { useDeleteConfirmationModalStore } from './hooks/modals/DeleteConfirmationModalStore';
import EditFileNameModal from './modals/EditFileNameModal';
import { useEditFileNameModalStore } from './hooks/modals/EditFileNameModalStore';
import { Link } from 'react-router-dom';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { AppException } from '../../../helpers/ErrorHelpers';

export default function HistoryPatientFolder() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const uploadedFiles = usePatientFolderStore((state) => state.uploadedFiles);
  const loadingCount = usePatientFolderStore((state) => state.loadingCount);

  const [selectedPage, setSelectedPage] = useState(1);

  const { getPatientFiles, addPatientFile } = usePatientFolderStore();
  const { handleSelectPatientFileToRemove } = useDeleteConfirmationModalStore();
  const { handleSelectFile } = useEditFileNameModalStore();

  const getPatientFiles_ = async () => {
    try {
      if (!id) throw new AppException('Id do paciente não encontrado');

      const response = await getPatientFiles(id);

      if (response === false) throw new Error('Erro ao buscar arquivos');

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

  const result = useQuery({ queryKey: ['patientFolders', id], queryFn: getPatientFiles_ });
  const slicedResult = result.data ? (result.data.length > 7 ? result.data.slice(actualPage[0], actualPage[1]) : result.data) : [];

  useEffect(() => {
    result.data?.length && selectedPage > Math.ceil(result.data.length / 7) && setSelectedPage(Math.ceil(result.data.length / 7));
  }, [result.data?.length, selectedPage]);

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Alert className="text-center">
            Use essa área para salvar arquivos importantes, como resultado de exames, foto de remédios ou suplementos, etc. Os materiais inseridos nessa área
            não serão compartilhados com o paciente.
          </Alert>
          {result.isLoading ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <StaticLoading />
            </div>
          ) : result.isError ? (
            <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar protuários</div>
          ) : !result.data?.length ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <Empty message="Nenhum arquivo encontrado" classNames="m-0" />
            </div>
          ) : (
            slicedResult.map((file) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={file.documents_id}>
                <Row className="g-0 sh-6 mt-3">
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-column">
                        <div>
                          <CsLineIcons icon="attachment" /> {file.documents_folder_name} - anexado em{' '}
                          {file.documents_upload_date && new Date(file.documents_upload_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Visualizar</Tooltip>}>
                          <Link
                            to={file.documents_aws_link ?? '#'}
                            target="_blank"
                            className="btn btn-sm btn-outline-primary btn-icon btn-icon-only mb-1 me-1"
                            rel="noreferrer"
                          >
                            <CsLineIcons icon="eye" />
                          </Link>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleSelectPatientFileToRemove(file)}
                          >
                            <CsLineIcons icon="bin" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Editar</Tooltip>}>
                          <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only mb-1 me-1" onClick={() => handleSelectFile(file)}>
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

          <div className="filled mt-5">
            <CsLineIcons icon="upload" />
            <PatientFolderDropzone />
          </div>

          <div className="mt-1 text-center">
            <AsyncButton
              onClickHandler={async () => {
                uploadedFiles?.length && uploadedFiles.map((uploadedFile) => addPatientFile(uploadedFile, queryClient));
              }}
              isSaving={loadingCount > 0}
              variant="primary"
              className="btn-icon btn-icon-start mb-1"
              disabled={!uploadedFiles?.length}
            >
              <CsLineIcons icon="check" /> <span>Fazer upload</span>
            </AsyncButton>{' '}
          </div>
        </Card.Body>
      </Card>

      <DeleteConfirmationModal />
      <EditFileNameModal />
    </>
  );
}
