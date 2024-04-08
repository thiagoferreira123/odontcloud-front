import { useQuery } from '@tanstack/react-query';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useRecipeStore } from '../hooks/RecipeStore';
import { AxiosError } from 'axios';
import SearchInput from './SearchInput';
import { useFilterStore } from '../hooks/FilterStore';
import SelectMultiple from './SelectMultiple';
import ModalDetailsRecipe from '../Modals/ModalDetailsRecipe';
import { useModalDetailsRecipeStore } from '../hooks/ModalDetailsRecipeStore';
import { Form } from 'react-bootstrap';
import { Recipe, RecipeHistoryRecipe, RecipeHistoryRecipeFood, RecipeHistoryRecipeMethodOfPreparation } from '../../../types/ReceitaCulinaria';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import { parseFloatNumber } from '../../../helpers/MathHelpers';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { useAuth } from '../../Auth/Login/hook';

export default function Recipes() {
  const query = useFilterStore((state) => state.query);
  const selectedCategories = useFilterStore((state) => state.selectedCategories);
  const recipes = useRecipeStore((state) => state.recipes);
  const prescription = useRecipeStore((state) => state.prescription);
  const [showOnlyMyRecipes, setShowOnlyMyRecipes] = useState(false);

  const { id } = useParams<{ id: string }>();
  const user = useAuth((state) => state.user);

  const { getRecipes, addPrescriptionRecipe } = useRecipeStore();
  const { handleSelectRecipeDetails } = useModalDetailsRecipeStore();

  const handleSelectRecipe = (recipe: Recipe) => {
    if (prescription.receitas.find((obj) => obj.id == recipe.id || obj.id == btoa((recipe.id ? recipe.id : Math.random()).toString()))) return;

    const newSelectedRecipe: RecipeHistoryRecipe = { ...recipe, id: btoa((recipe.id ? recipe.id : Math.random()).toString()), data_cadastro: new Date() };

    newSelectedRecipe.alimentos = newSelectedRecipe.alimentos.map((food: RecipeHistoryRecipeFood) => {
      return { ...food, ...{ id: btoa(Math.random().toString()) } };
    });

    newSelectedRecipe.preparos = newSelectedRecipe.preparos.map((step: RecipeHistoryRecipeMethodOfPreparation) => {
      return { ...step, ...{ id: btoa(Math.random().toString()) } };
    });

    addPrescriptionRecipe(newSelectedRecipe);
  };

  const getRecipes_ = async () => {
    try {
      const recipes = await getRecipes();
      return recipes;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;
      return [];
    }
  };

  const result = useQuery({ queryKey: ['recipes', id], queryFn: getRecipes_, enabled: !!id });

  const filteredResults = result.data
    ? recipes.filter(
        (recipe: Recipe) =>
          String(recipe.nome).toLowerCase().includes(query.toLowerCase()) &&
          (!selectedCategories.length || recipe.categorias.find((obj) => selectedCategories.find((category) => Number(category.value) == obj.id_categoria))) &&
          (!showOnlyMyRecipes || (user && recipe.id_profissional == user.id))
      )
    : [];

  return (
    <Card>
      <Card.Body className="mb-3 border-last-none">
        <label className="mb-3 d-flex"> Selecione as receitas que deseja disponibilizar para o paciente</label>

        <Row className="mb-3">
          <Col xl="6">
            <div className="w-100 w-md-auto search-input-container border border-separator">
              <SearchInput />
            </div>
          </Col>
          <Col xl="6">
            <SelectMultiple />
          </Col>
        </Row>

        <section className="scroll-section" id="switch">
          <Form.Check
            className="mb-3"
            type="switch"
            id="customSwitch"
            label="Exibir apenas as minhas receitas"
            onChange={(e) => setShowOnlyMyRecipes(e.target.checked)}
            defaultChecked={showOnlyMyRecipes}
          />
        </section>

        <div className="scroll-out">
          <div className="override-native overflow-auto sh-50 pe-3">
            {result.isLoading ? (
              <div className="h-50 d-flex justify-content-center align-items-center">
                <StaticLoading />
              </div>
            ) : result.isError ? (
              <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar receitas</div>
            ) : !filteredResults.length ? (
              <div className="h-50 d-flex justify-content-center align-items-center">
                <Empty message="Nenhuma receita encontrada" />
              </div>
            ) : (
              filteredResults.map((recipe) => (
                <div className="border-bottom border-separator-light mb-2 pb-2" key={recipe.id}>
                  <Row className={`g-0 sh-6 ${prescription.receitas && prescription.receitas.find((r) => r.nome === recipe.nome) ? 'opacity-25' : ''}`}>
                    <Col xs="auto">
                      <img src={recipe.imagem ? recipe.imagem : '/img/product/large/product-2.webp'} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
                    </Col>
                    <Col>
                      <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                          <div>{recipe.nome}</div>
                          <div className="text-small text-muted">
                            {Number(recipe.carboidratos_por_porcao) ? `Carboidratos: ${parseFloatNumber(recipe.carboidratos_por_porcao)}g | ` : null}
                            {Number(recipe.proteinas_por_porcao) ? `Proteínas: ${parseFloatNumber(recipe.proteinas_por_porcao)}g | ` : null}
                            {Number(recipe.lipideos_por_porcao) ? `Lípideos: ${parseFloatNumber(recipe.lipideos_por_porcao)}g` : null}
                          </div>
                        </div>
                        <div className="d-flex">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="ms-1"
                            onClick={() => handleSelectRecipe(recipe)}
                            disabled={prescription.receitas && prescription.receitas.find((r) => r.nome === recipe.nome) ? true : false}
                          >
                            Selecionar
                          </Button>
                          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-view">Visualizar detalhes da receita</Tooltip>}>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="btn-icon btn-icon-only ms-1"
                              onClick={() => handleSelectRecipeDetails(recipe)}
                            >
                              <CsLineIcons icon="eye" />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))
            )}
          </div>
        </div>
      </Card.Body>

      <ModalDetailsRecipe />
    </Card>
  );
}
