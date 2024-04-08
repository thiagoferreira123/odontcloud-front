import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useManipulatedFormulas } from './hooks';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import ModalConfig from './modals/ConfigModalStore';
import { useConfigModalStore } from './hooks/ConfigModalStore';
import usePatientMenuStore from '../hooks/patientMenuStore';
import DeleteConfirmation from './modals/DeleteConfirmation';
import { useDeleteConfirmationStore } from './hooks/DeleteConfirmationStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

export default function ManipulatedFormulasHistory() {
  const idPaciente = usePatientMenuStore((state) => state.patientId);
  const [selectedPage, setSelectedPage] = useState(1);
  const { handleDeleteManipulatedFormula } = useDeleteConfirmationStore();

  const { getManipulatedFormulas } = useManipulatedFormulas();
  const { setShowModalConfig, handleSelectManipulatedFormula } = useConfigModalStore();

  const getManipulatedFormulas_ = async () => {
    try {
      const response = await getManipulatedFormulas(idPaciente);

      if (response === false) throw new Error('Erro ao buscar fórmulas manipuladas');

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

  const result = useQuery({ queryKey: ['manipulatedFormulas', idPaciente], queryFn: getManipulatedFormulas_ });

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
            <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar formulas manipuladas</div>
          ) : !result.data?.length ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <Empty message="Nenhuma formula manipulada encontrada" classNames="m-0" />
            </div>
          ) : (
            slicedResult.map((manipuledFormula) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={manipuledFormula.id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-column">
                        <div>Identificação: {manipuledFormula.nome}</div>
                        <div>Prescrição realizada em: {(new Date(manipuledFormula.dataCriacao)).toLocaleDateString()}</div>
                      </div>
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleDeleteManipulatedFormula(manipuledFormula)}
                          >
                            <CsLineIcons icon="bin" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Editar</Tooltip>}>
                          <Link to={'/app/formulas-manipuladas/' + manipuledFormula.id} className="btn btn-sm btn-outline-primary btn-icon btn-icon-only mb-1 me-1">
                            <CsLineIcons icon="edit" />
                          </Link>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Alterar as configurações</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleSelectManipulatedFormula(manipuledFormula)}
                          >
                            <CsLineIcons icon="gear" />
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
        <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => setShowModalConfig(true)}>
          <CsLineIcons icon="plus" /> <span>Iniciar uma prescrição</span>
        </Button>
      </div>

      <ModalConfig />
      <DeleteConfirmation />
    </>
  );
}
