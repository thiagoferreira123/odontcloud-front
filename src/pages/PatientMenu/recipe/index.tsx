import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRecipeStore } from './hooks/RecipeStore';
import { AxiosError } from 'axios';
import usePatientMenuStore from '../hooks/patientMenuStore';
import { useQuery } from '@tanstack/react-query';
import { useModalStore } from './hooks/ModalStore';
import ModalForm from './modals/ModalForm';
import DeleteConfirm from './modals/DeleteConfirm';
import { RecipeHistory } from '../../../types/ReceitaCulinaria';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';

export default function Recipes() {
  const patientId = usePatientMenuStore((state) => state.patientId);
  const recipes = useRecipeStore((state) => state.recipes);
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useRecipeStore((state) => state.query);

  const { getRecipes } = useRecipeStore();
  const { handleSelectRecipe, handleDeleteRecipe } = useModalStore();

  const getRecipes_ = async () => {
    try {
      window.localStorage.setItem('prescription', '');
      const recipes = await getRecipes(patientId);
      return recipes;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;
      return [];
    }
  };

  const handleCreateRecipe = () => {
    const payload: RecipeHistory = {
      nome: '',
      data_cadastro: new Date().toString(),
      id_paciente: patientId,
      receitas: [],
    };
    handleSelectRecipe(payload);
  };

  const handleDisplayForPatient = (recipe: RecipeHistory) => {
    const payload = { ...recipe, id_paciente: patientId };
    handleSelectRecipe(payload);
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

  const result = useQuery({ queryKey: ['patient-recipe-history', patientId], queryFn: getRecipes_, enabled: !!patientId });

  const filteredResults = result.data ? recipes.filter((recipe: RecipeHistory) => String(recipe.nome).toLowerCase().includes(query.toLowerCase())) : [];

  const slicedResult = filteredResults ? (filteredResults.length > 7 ? filteredResults.slice(actualPage[0], actualPage[1]) : filteredResults) : [];

  useEffect(() => {
    filteredResults?.length && selectedPage > Math.ceil(filteredResults.length / 7) && setSelectedPage(Math.ceil(filteredResults.length / 7));
  }, [recipes.length, selectedPage]);

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          {result.isLoading ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <StaticLoading />
            </div>
          ) : result.isError ? (
            <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar receitas</div>
          ) : !result.data?.length ? (
            <div className="h-50 d-flex justify-content-center align-items-center">
              <Empty message="Nenhuma receita encontrada" classNames="m-0" />
            </div>
          ) : (
            slicedResult.map((recipe) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={recipe.id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-column">
                        <div>Prescrição: {recipe.nome}</div>
                        <div>Realizada em: {new Date(recipe.data_cadastro.split('T')[0] + ' 00:00:00').toLocaleDateString()}</div>
                      </div>
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Exibir no painel do paciente</Tooltip>}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-icon btn-icon-only mb-1 me-1"
                            onClick={() => handleDisplayForPatient(recipe)}
                          >
                            <CsLineIcons icon="eye" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir</Tooltip>}>
                          <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only mb-1 me-1" onClick={() => handleDeleteRecipe(recipe)}>
                            <CsLineIcons icon="bin" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Editar</Tooltip>}>
                          <Link
                            to={{
                              pathname: '/app/receita-culinaria/' + recipe.id,
                            }}
                            className="btn-outline-primary btn-sm btn-icon btn-icon-only mb-1 me-1"
                          >
                            <CsLineIcons icon="edit" />
                          </Link>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">Alterar as configurações</Tooltip>}>
                          <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only mb-1 me-1" onClick={() => handleSelectRecipe(recipe)}>
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
            {filteredResults && filteredResults.length > 7 ? (
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
                  <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= Math.ceil(filteredResults.length / 7)}>
                    <CsLineIcons icon="chevron-right" />
                  </Pagination.Next>
                </Pagination>
              </nav>
            ) : null}
          </Row>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-center gap-2 mt-4">
        <Button className="btn btn-primary btn-icon btn-icon-start mb-2" onClick={handleCreateRecipe}>
          <CsLineIcons icon="plus" /> <span>Criar uma prescrição de receitas</span>
        </Button>
      </div>

      <ModalForm />
      <DeleteConfirm />
    </>
  );
}
