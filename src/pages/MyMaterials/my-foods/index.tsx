import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, OverlayTrigger, Pagination, Row, Tooltip } from 'react-bootstrap';
import { useMyFoodStore } from './hooks/MyFoodStore';
import { useQuery } from '@tanstack/react-query';
import { useEditCustomFoodModalStore } from './hooks/EditCustomFoodModalStore';
import EditCustomFoodModal from './modals/EditCustomFoodModal';
import { useModalStore } from './hooks/ModalStore';
import SearchInput from './SearchInput';
import { Food } from '../../../types/foods';
import StaticLoading from '../../../components/loading/StaticLoading';
import { parseFloatNumber } from '../../../helpers/MathHelpers';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import Empty from '../../../components/Empty';
import CreateButtons from './CreateButtons';
import DeleteConfirm from './modals/DeleteConfirm';
import { escapeRegexCharacters } from '../../../helpers/SearchFoodHelper';

export default function MyMeals() {
  const myFoods = useMyFoodStore((state) => state.myFoods);
  const [selectedPage, setSelectedPage] = useState(1);
  const query = useMyFoodStore((state) => state.query);

  const { getFoods } = useMyFoodStore();
  const { handleSelectFood } = useEditCustomFoodModalStore();
  const { setShowDeleteConfirmation, setSelectedFood } = useModalStore();

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

  const getFoods_ = useCallback(async () => {
    try {
      const response = await getFoods();

      return response;
    } catch (error) {
      return [];
    }
  }, [getFoods]);

  const handleShowDeleteConfirm = (food: Food) => {
    setSelectedFood(food);
    setShowDeleteConfirmation(true);
  };

  const onSubmitModal = () => {
    result.refetch();
  };

  const result = useQuery({ queryKey: ['my-foods'], queryFn: getFoods_ });

  const filteredResults = result.data
    ? myFoods.filter((food: Food) => escapeRegexCharacters(String(food.descricaoDoAlimento)).includes(escapeRegexCharacters(query)))
    : [];

  const slicedResult = result.data ? filteredResults.slice(actualPage[0], actualPage[1]) : [];

  filteredResults?.length && selectedPage > Math.ceil(filteredResults.length / 7) && setSelectedPage(Math.ceil(filteredResults.length / 7));

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <Row className="d-flex align-items-end mt-3 mb-3">
            <div className="me-3 mb-3">
              <label className="mb-1">Busque pelo alimento</label>
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
            <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar alimentos</div>
          ) : !filteredResults.length ? (
            <div className="sh-30 d-flex align-items-center justify-content-center">
              <Empty message="Nenhum alimento encontrado" />
            </div>
          ) : (
            slicedResult.map((food) => (
              <div className="border-bottom border-separator-light mb-2 pb-2" key={food.id}>
                <Row className="g-0 sh-6">
                  <Col>
                    <div>{food.descricaoDoAlimento}</div>
                  </Col>
                  <Col>
                    <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-row flex-fill justify-content-center text-small text-muted">
                        <div className="d-flex flex-column align-items-center">
                          <div className="text-muted text-small">CHO</div>
                          <div className="text-alternate">{parseFloatNumber((food.carboidrato * Number(food.gramas1)) / 100)} g</div>
                          <div className="text-alternate">{parseFloatNumber(((food.carboidrato * Number(food.gramas1)) / 100) * 4)} kcal </div>
                        </div>
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">PTN</div>
                          <div className="text-alternate">{parseFloatNumber((food.proteina * Number(food.gramas1)) / 100)} g</div>
                          <div className="text-alternate">{parseFloatNumber(((food.proteina * Number(food.gramas1)) / 100) * 4)} kcal </div>
                        </div>
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">LIP</div>
                          <div className="text-alternate">{parseFloatNumber((food.lipideos * Number(food.gramas1)) / 100)} g</div>
                          <div className="text-alternate">{parseFloatNumber(((food.lipideos * Number(food.gramas1)) / 100) * 9)} kcal </div>
                        </div>
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">KCAL</div>
                          <div className="text-alternate">{parseFloatNumber((food.energia * Number(food.gramas1)) / 100)} kcal</div>
                        </div>
                      </div>
                      <div className="d-flex">
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Editar alimento</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectFood(food)}>
                            <CsLineIcons icon="edit" />
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Remover alimento</Tooltip>}>
                          <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleShowDeleteConfirm(food)}>
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

      <EditCustomFoodModal onSubmit={onSubmitModal} />
      <DeleteConfirm />
    </>
  );
}
