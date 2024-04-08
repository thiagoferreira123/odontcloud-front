import React, { useCallback, useMemo, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import CreateButtons from './CreateButtons';
import SearchInput from './SearchInput';
import { useMyRecipesStore } from './hooks/MyRecipesStore';
import { useModalDeleteConfirmationStore } from './hooks/ModalDeleteConfirmationStore';
import DeleteConfirm from './modals/DeleteConfirm';
import { Recipe } from '../../../types/ReceitaCulinaria';
import { useModalAddRecipeStore } from '../../Recipe/Modals/ModalAddRecipe/hooks/ModalAddRecipeStore';
import { useRecipeFormikStore } from '../../Recipe/Modals/ModalAddRecipe/hooks/RecipeFormikStore';
import { escapeRegexCharacters } from '../../../helpers/SearchFoodHelper';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import ModalAddRecipe from '../../Recipe/Modals/ModalAddRecipe';

export default function MyMeals() {
  const recipes = useMyRecipesStore((state) => state.recipes);
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useMyRecipesStore((state) => state.query);

  const { getRecipes, updateRecipe, addRecipe } = useMyRecipesStore();
  const { handleSelectRecipe } = useModalAddRecipeStore();
  const { setShowDeleteConfirmation, setSelectedRecipe } = useModalDeleteConfirmationStore();
  const { setRecipe } = useRecipeFormikStore();

  const getRecipes_ = useCallback(async () => {
    try {
      const response = await getRecipes();

      return response;
    } catch (error) {
      return [];
    }
  }, [getRecipes]);

  const handleShowDeleteConfirm = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowDeleteConfirmation(true);
  };

  const handleSelectRecipe_ = (recipe: Recipe) => {
    handleSelectRecipe(recipe);
    setRecipe(recipe);
  };

  const onSubmitModal = (recipe: Recipe) => {
    if (recipes.find((f) => f.id === recipe.id)) {
      updateRecipe(recipe);
    } else {
      addRecipe(recipe);
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

  const result = useQuery({ queryKey: ['my-recipes'], queryFn: getRecipes_ });

  const filteredResults = result.data
    ? recipes.filter((recipe: Recipe) => escapeRegexCharacters(String(recipe.nome)).includes(escapeRegexCharacters(query)))
    : [];

  const slicedResult = filteredResults ? filteredResults.slice(actualPage[0], actualPage[1]) : [];

  filteredResults.length && selectedPage > Math.ceil(filteredResults.length / 7) && setSelectedPage(Math.ceil(filteredResults.length / 7));

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Row className="d-flex align-items-end mt-3 mb-3">
            <div className="me-3 mb-3">
              <label className="mb-1">Busque pela receita</label>
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
            <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar receitas</div>
          ) : !filteredResults.length ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <Empty message="Nenhuma receita encontrada" classNames="m-0" />
            </div>
          ) : (
            slicedResult.map((recipe) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={recipe.id}>
                <Row className="g-0 sh-6">
                  <Col xs="auto">
                    <img src={recipe.imagem ? recipe.imagem : '/img/product/large/product-2.webp'} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
                  </Col>
                  <Col className="ms-2 d-flex align-items-center">
                    <div>{recipe.nome}</div>
                  </Col>
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-end">
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar receita</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectRecipe_(recipe)}>
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Remover receita</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleShowDeleteConfirm(recipe)}>
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

      <ModalAddRecipe onAddRecipe={onSubmitModal} />

      <DeleteConfirm />
    </>
  );
}
