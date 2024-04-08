import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { useMealStore } from './hooks/mealStore';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useModalStore } from './hooks/modalStore';
import MealModal from './modals/MealModal';
import DeleteConfirm from './modals/DeleteConfirm';
import CreateButtons from './CreateButtons';
import ModalDialog, { ModalDialogRef } from '../../../components/modals/ModalDialog';
import { ClassicPlanMealTemplate } from '../../../types/PlanoAlimentarClassico';
import StaticLoading from '../../../components/loading/StaticLoading';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { parseFloatNumber } from '../../../helpers/MathHelpers';
import Empty from '../../../components/Empty';
import { escapeRegexCharacters } from '../../../helpers/SearchFoodHelper';
import SearchInput from './SearchInput';

export default function MyMeals() {
  const [selectedPage, setSelectedPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const meals = useMealStore((state) => state.meals);
  const query = useMealStore((state) => state.query);

  const modalDialog = useRef<ModalDialogRef>();

  const { getMeals } = useMealStore();
  const { handleSelectMeal, setSelectMeal } = useModalStore();

  const getMeals_ = async () => {
    try {
      const response = await getMeals();

      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;

      return [];
    }
  };

  const handleCloseDeleteConfirm = () => setShowDeleteConfirm(false);
  const handleShowDeleteConfirm = (meal: ClassicPlanMealTemplate) => {
    setSelectMeal(meal);
    setShowDeleteConfirm(true);
  };
  const handleEditMealConfig = async () => {
    const nome = await modalDialog.current?.showQuestion<string>();

    if (!nome) return;

    const payload: ClassicPlanMealTemplate = {
      nome,
      horario: '00:00',
      idPlanoAlimentar: '',
      obs: '',
      carboidratos: '',
      lipideos: '',
      proteinas: '',
      kcal: '',
      calculavel: 0,
      html: '',
      tipoTexto: '',
      textoDaRefeicao: '',
      linkImagem: null,
      modeloId: null,
      alimentos: [],
      substituicoes: [],
      ordens: [],
    };

    handleSelectMeal(payload);
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

  const result = useQuery({ queryKey: ['my-meals'], queryFn: getMeals_ });

  const filteredResults = result.data?.length
    ? meals.filter((plan: ClassicPlanMealTemplate) => escapeRegexCharacters(String(plan.nome)).includes(escapeRegexCharacters(query)))
    : [];

  const slicedResult = filteredResults ? filteredResults.slice(actualPage[0], actualPage[1]) : [];

  filteredResults.length && selectedPage > Math.ceil(filteredResults.length / 7) && setSelectedPage(Math.ceil(filteredResults.length / 7));

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Row className="d-flex align-items-end mt-3 mb-3">
            <div className="me-3 mb-3">
              <label className="mb-1">Busque pelo plano alimentar</label>
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
            <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar refeições</div>
          ) : !filteredResults.length ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <Empty message="Nenhuma refeição encontrada" />
            </div>
          ) : (
            slicedResult.map((meal) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={meal.id}>
                <Row className="g-0">
                  <Col>
                    <div>{meal.nome}</div>
                  </Col>
                  <Col className="mb-2">
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-row flex-fill justify-content-center text-small text-muted">
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">CHO</div>
                          <div className="text-alternate">{Number(meal.kcal) ? parseFloatNumber(Number(meal.carboidratos) / Number(meal.kcal)) : 0} g</div>
                          <div className="text-alternate">{parseFloatNumber(Number(meal.carboidratos))} kcal </div>
                        </div>
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">PTN</div>
                          <div className="text-alternate">{Number(meal.kcal) ? parseFloatNumber(Number(meal.proteinas) / Number(meal.kcal)) : 0} g</div>
                          <div className="text-alternate">{parseFloatNumber(Number(meal.proteinas))} kcal </div>
                        </div>
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">LIP</div>
                          <div className="text-alternate">{Number(meal.kcal) ? parseFloatNumber(Number(meal.lipideos) / Number(meal.kcal)) : 0} g</div>
                          <div className="text-alternate">{parseFloatNumber(Number(meal.lipideos))} kcal </div>
                        </div>
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">KCAL</div>
                          <div className="text-alternate">{parseFloatNumber(meal.kcal)} kcal</div>
                        </div>
                      </div>

                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar a refeição</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectMeal(meal)}>
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>{' '}
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir refeição</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleShowDeleteConfirm(meal)}>
                            <CsLineIcons icon="bin" />
                          </Button>
                        </OverlayTrigger>{' '}
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

      <MealModal />

      <CreateButtons handleEditMealConfig={handleEditMealConfig} />

      <DeleteConfirm showModal={showDeleteConfirm} handleCloseModal={handleCloseDeleteConfirm} />

      <ModalDialog
        ref={modalDialog}
        title="Criar refeição"
        label="Digite um nome para a refeição"
        placeholder="Nome da refeição"
        icon="cupcake"
        confirmText="Criar Refeição"
        cancelText="Cancelar"
      />
    </>
  );
}
