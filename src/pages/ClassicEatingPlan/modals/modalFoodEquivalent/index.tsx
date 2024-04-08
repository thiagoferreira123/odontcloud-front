import React, { useEffect, useMemo } from 'react';
import { Form, Badge, Modal, Pagination, Spinner, Row, Table, ToggleButton } from 'react-bootstrap';
import SelectMultiple from './SelectMultiple';
import SelectMeasure from './SelectMeasure';
import useClassicPlan from '../../hooks/useClassicPlan';
import { useQuery } from '@tanstack/react-query';
import SearchInput from './SearchInput';
import { toast } from 'react-toastify';
import { ClassicPlanMealFoodEquivalent } from '../../../../types/PlanoAlimentarClassico';
import api from '../../../../services/useAxios';
import { EquivalentFoodSugestion, Food, MedidaCaseira } from '../../../../types/foods';
import { Option } from '../../../../types/inputs';
import { notify } from '../../../../components/toast/NotificationIcon';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

interface ModalFoodEquivalent {
  show: boolean;
  onClose: () => void;
}

const ModalFoodEquivalent: React.FC<ModalFoodEquivalent> = ({ show, onClose }) => {
  const { selectedMealId, selectedFood, selectedNutrients, equivalentFoodsQuery } = useClassicPlan((state) => state);

  const { setSelectedNutrients, updateMealFoodEquivalents, updateReplacementMealFoodEquivalents } = useClassicPlan();

  const [isSaving, setIsSaving] = React.useState(false);
  const [selectedPage, setSelectedPage] = React.useState(1);
  const [selectedFoods, setSelectedFoods] = React.useState<ClassicPlanMealFoodEquivalent[]>([]);

  const actualPage = useMemo(() => {
    const actualIndex = (selectedPage - 1) * 5;
    return [actualIndex, actualIndex + 5];
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

  const getSugestedFoods = async () => {
    if (!selectedFood || !selectedFood.id || !selectedFood.tabela || !selectedFood.food) return [];

    try {
      const payload = {
        alimento_id: selectedFood.id_alimento,
        tabela: selectedFood.tabela.toLowerCase(),
        gramas: selectedFood.gramas,
        id_grupo_alimento: selectedFood.food.grupo_id,
      };
      const response = await api.post('/sugestao-alimento', payload);

      const sugestedFoods: EquivalentFoodSugestion[] = response.data;

      if (selectedFood.alimentoequivalentes) {
        const filteredSelectedFoods = selectedFood.alimentoequivalentes.filter(
          (food) => !selectedFoods.find((f) => f.id == food.idAlimentoEquivalente) && sugestedFoods.find((f) => f.id == food.idAlimentoEquivalente)
        );

        const sugestedSlectedFoods: Array<ClassicPlanMealFoodEquivalent | null> = filteredSelectedFoods.map((food) => {
          const sugestedFood = sugestedFoods.find((f) => f.id == food.idAlimentoEquivalente);

          if (!sugestedFood) {
            return null; // ou outro valor apropriado que represente um item não encontrado
          }

          const payload: ClassicPlanMealFoodEquivalent = {
            idRefeicaoAlimento: Number(selectedFood.id),
            idAlimentoEquivalente: sugestedFood.id,
            nomeAlimento: sugestedFood.nome,
            tabelaEquivalente: sugestedFood.tabela,
            nutrienteEquivalente: sugestedFood.nutriente_equivalente,
            medidaCaseiraEquivalente: sugestedFood.medida_caseira,
            gramasUnidade: Number(sugestedFood.gramas),
            quantidade: food.quantidade,
            gramasNutriente: Number(sugestedFood[sugestedFood.nutriente_equivalente]),
          };

          return payload;
        });

        const filteredSugestedFoods: ClassicPlanMealFoodEquivalent[] = sugestedSlectedFoods.filter(
          (food): food is ClassicPlanMealFoodEquivalent => food !== null
        );

        setSelectedFoods([
          ...selectedFoods.filter((f) => !filteredSugestedFoods.find((ff) => ff.idAlimentoEquivalente === f.idAlimentoEquivalente)),
          ...filteredSugestedFoods,
        ]);
      }

      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getAlimentosEquivalentes = async () => {
    if (!selectedNutrients.length || !selectedFood || !selectedFood.id || !selectedFood.tabela || !selectedFood.food) return [];

    const nutrientes = selectedNutrients.map((n: Option) => n.value);

    const payload = {
      alimento_id: selectedFood.id_alimento,
      tabela: selectedFood.tabela,
      gramas: selectedFood.gramas,
      id_grupo_alimento: selectedFood.food.grupo_id,
      nutrientes_requisitados: nutrientes,
    };

    const response = await api.post('/alimento', payload);

    const equivalentFoods: Food[] = response.data;

    if (selectedFood.alimentoequivalentes) {
      const filteredSelectedFoods = selectedFood.alimentoequivalentes.filter(
        (food) => !selectedFoods.find((f) => f.idAlimentoEquivalente == food.idAlimentoEquivalente && f.tabelaEquivalente == food.tabelaEquivalente)
      );

      const previousSelectedFoods: Food[] = filteredSelectedFoods.map((food) => {
        const food_index = equivalentFoods.findIndex((f) => f.id == food.idAlimentoEquivalente && f.tabela == food.tabelaEquivalente);

        const sliced = equivalentFoods.splice(food_index, 1)[0];

        const payload: Food = {
          ...sliced,
          quantidade: food.quantidade.toString(),
          gramas: food.gramasNutriente,
          medida_selecionada: { nome: food.medidaCaseiraEquivalente, gramas: food.gramasUnidade },
        };

        return payload;
      });

      const previousSelectedSugestedFoods: Food[] = selectedFoods.map((food) => {
        const food_index = equivalentFoods.findIndex((f) => f.id == food.idAlimentoEquivalente && f.tabela == food.tabelaEquivalente);

        const sliced = equivalentFoods.splice(food_index, 1)[0];

        const payload: Food = {
          ...sliced,
          quantidade: food.quantidade.toString(),
          gramas: food.gramasNutriente,
          medida_selecionada: { nome: sliced.medidaCaseira1, gramas: food.gramasUnidade },
        };

        return payload;
      });

      equivalentFoods.unshift(...previousSelectedFoods, ...previousSelectedSugestedFoods);

      const parsedSelectedFoods: ClassicPlanMealFoodEquivalent[] = previousSelectedFoods
        .map((food) => {
          const gramasUnidade = food.medida_selecionada ? food.medida_selecionada.gramas : Number(food.gramas1);

          const payload: ClassicPlanMealFoodEquivalent = {
            idRefeicaoAlimento: Number(selectedFood.id),
            idAlimentoEquivalente: food.id,
            nomeAlimento: String(food.nome),
            tabelaEquivalente: food.tabela,
            nutrienteEquivalente: String(food.nutriente_equivalente),
            medidaCaseiraEquivalente: String(food.medida_selecionada?.nome),
            gramasUnidade: gramasUnidade,
            quantidade: Number(food.quantidade ?? 0),
            gramasNutriente: Number(food[String(food.nutriente_equivalente)]),
          };

          return payload;
        })
        .filter((food): food is ClassicPlanMealFoodEquivalent => food !== null);

      // setSelectedFoods([...selectedFoods, ...parsedSelectedFoods]);

      setSelectedFoods([
        ...selectedFoods.filter((f) => !parsedSelectedFoods.find((ff) => ff.idAlimentoEquivalente === f.idAlimentoEquivalente)),
        ...parsedSelectedFoods,
      ]);
    }

    return equivalentFoods;
  };

  const handleClickEquivalentFood = (food: Food) => {
    if (!selectedFood || !selectedFood.id || !selectedFood.tabela || !selectedFood.food) return;

    if (selectedFoods.find((f) => f.idAlimentoEquivalente == food.id && f.tabelaEquivalente == food.tabela)) {
      const selected = selectedFoods.filter((f) => f.idAlimentoEquivalente != food.id || f.tabelaEquivalente != food.tabela);
      return setSelectedFoods(selected);
    } else {
      const payload: ClassicPlanMealFoodEquivalent = {
        idRefeicaoAlimento: Number(selectedFood.id),
        idAlimentoEquivalente: food.id,
        nomeAlimento: String(food.nome),
        tabelaEquivalente: food.tabela,
        nutrienteEquivalente: String(food.nutriente_equivalente),
        medidaCaseiraEquivalente: food.medidaCaseira1,
        gramasUnidade: Number(food.gramas1),
        quantidade: Number(food.quantidade),
        gramasNutriente: Number(food[String(food.nutriente_equivalente)]),
      };

      if (!food.medida_selecionada) {
        payload.medida_selecionada = { nome: food.medidaCaseira1, gramas: Number(food.gramas1) };
      }

      setSelectedFoods([...selectedFoods, payload]);
    }
  };

  const handleClickSugestedFood = (food: EquivalentFoodSugestion) => {
    if (!selectedFood) return;

    if (selectedFoods.find((f) => f.idAlimentoEquivalente == food.id && f.tabelaEquivalente == food.tabela)) {
      const selected = selectedFoods.filter((f) => f.idAlimentoEquivalente != food.id || f.tabelaEquivalente != food.tabela);
      return setSelectedFoods(selected);
    } else {
      const payload: ClassicPlanMealFoodEquivalent = {
        idRefeicaoAlimento: Number(selectedFood.id),
        idAlimentoEquivalente: food.id,
        nomeAlimento: food.nome,
        tabelaEquivalente: food.tabela,
        nutrienteEquivalente: food.nutriente_equivalente,
        medidaCaseiraEquivalente: String(food.medida_caseira),
        gramasUnidade: Number(food.gramas),
        quantidade: food.quantidade,
        gramasNutriente: Number(food[food.nutriente_equivalente]),
      };

      if (!food.medida_selecionada) {
        payload.medida_selecionada = { nome: String(food.medidaCaseira1), gramas: Number(food.gramas1) };
      }

      setSelectedFoods([...selectedFoods, payload]);
    }
  };

  const saveEquivalentFoods = async () => {
    try {
      if (!selectedFood) return;

      setIsSaving(true);

      for (const food of selectedFoods) {
        if (!food.medidaCaseiraEquivalente || food.medidaCaseiraEquivalente === 'undefined') throw new Error('Medida caseira não definida');
      }

      if (!selectedMealId) {
        const response = await api.post(`/plano-alimentar-classico-refeicao-alimento/${selectedFood.id}/sync-equivalents`, selectedFoods);

        const equivalentes = response.data;

        updateMealFoodEquivalents(selectedFood, equivalentes);
      } else {
        if (!selectedMealId) return console.error('Refeição não definida');

        const response = await api.post(`/plano-alimentar-classico-refeicao-substituta-alimento/${selectedFood.id}/sync-equivalents`, selectedFoods);

        const equivalentes = response.data;

        updateReplacementMealFoodEquivalents(selectedFood, selectedMealId, equivalentes);
      }

      onClose();
      setIsSaving(false);
      notify('Alimentos equivalentes atualizados com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      notify('Erro ao atualizar alimento', 'Erro', 'close', 'danger');
    }
  };

  const handleChangeMeasure = (measure: MedidaCaseira, food: Food) => {
    if (!equivalentFoodsResult.data || !selectedFood) return;

    const index = equivalentFoodsResult.data.findIndex((f) => f.id == food.id && f.tabela == food.tabela);

    const targetFood: Food = equivalentFoodsResult.data[index!];

    if (!targetFood) return console.error('Alimento não encontrado');

    const updatedSelectedFoods = selectedFoods.map((actualFood: ClassicPlanMealFoodEquivalent) => {
      if (targetFood.id == actualFood.idAlimentoEquivalente && targetFood.tabela == actualFood.tabelaEquivalente) {
        const gramasUnidade = Number(measure.gramas);

        const gramasNutriente = Number(Number(targetFood[`${targetFood.nutriente_equivalente}_unidade`]) * gramasUnidade * actualFood.quantidade) / 100;

        const medidaCaseiraEquivalente = measure.nome;

        return { ...actualFood, gramasUnidade, gramasNutriente, medidaCaseiraEquivalente };
      }
      return actualFood;
    });

    equivalentFoodsResult.data[index!].medida_selecionada = measure;

    setSelectedFoods(updatedSelectedFoods);
  };

  const handleChangeFoodQuantity = (newQuantity: string, food: Food) => {
    if (!equivalentFoodsResult.data || !selectedFood) return;

    const index = equivalentFoodsResult.data.findIndex((f) => f.id == food.id && f.tabela == food.tabela);

    const targetFood: Food = equivalentFoodsResult.data[index!];

    if (!targetFood) return console.error('Alimento não encontrado');

    newQuantity = newQuantity.replace(',', '.');

    const updatedSelectedFoods = selectedFoods.map((actualFood: ClassicPlanMealFoodEquivalent) => {
      if (targetFood.id == actualFood.idAlimentoEquivalente && targetFood.tabela == actualFood.tabelaEquivalente) {
        const gramasUnidade = Number(targetFood.medida_selecionada ? targetFood.medida_selecionada.gramas : targetFood.gramas1);

        const quantidade = Number(newQuantity);

        const gramasNutriente = Number(Number(targetFood[String(targetFood.nutriente_equivalente)]) * gramasUnidade * quantidade) / 100;

        return { ...actualFood, gramasUnidade, quantidade, gramasNutriente };
      }
      return actualFood;
    });

    equivalentFoodsResult.data[index!].quantidade = newQuantity;

    setSelectedFoods(updatedSelectedFoods);
  };

  useEffect(() => {
    setSelectedNutrients([]);
    setSelectedFoods([]);
    setSelectedPage(1);
  }, [selectedFood?.id]);

  const sugestionFoodsResult = useQuery({ queryKey: ['sugested-foods', selectedFood?.id], queryFn: getSugestedFoods });

  const equivalentFoodsResult = useQuery({ queryKey: ['equivalent-foods', selectedFood?.id, selectedNutrients], queryFn: getAlimentosEquivalentes });

  const filteredEquivalentFoods = equivalentFoodsResult.data
    ? equivalentFoodsResult.data.filter((food: Food) => String(food.nome).toLowerCase().includes(equivalentFoodsQuery.toLowerCase()))
    : [];

  const slicedEquivalentFoods = filteredEquivalentFoods ? filteredEquivalentFoods.slice(actualPage[0], actualPage[1]) : [];

  const getLabelDiferenca = (food: Food, nutrient: Option) => {
    if (!selectedFood || !selectedFood.food) return;

    const index = slicedEquivalentFoods.findIndex((f) => f.id == food.id && f.tabela == food.tabela);

    const gramas = Number(food.medida_selecionada ? food.medida_selecionada.gramas : food.gramas1);

    food[nutrient.value] = Number(food[nutrient.value + `_unidade`]) * Number(food.quantidade) * gramas;

    const nutrientReference = (Number(selectedFood.food[nutrient.value]) * selectedFood.gramas) / 100;

    const diferenca = Number(food[nutrient.value]) - nutrientReference;

    const symbol = diferenca > 1 ? '+' : '-';

    if (diferenca >= 1 || diferenca <= -1) slicedEquivalentFoods[index].equivalent = false;
    else slicedEquivalentFoods[index].equivalent = true;

    return diferenca >= 1 || diferenca <= -1 ? (
      <Badge bg="danger" pill>
        <CsLineIcons icon={diferenca >= 1 ? 'trend-up' : 'trend-down'} /> {symbol + Math.abs(diferenca).toFixed(1)}
      </Badge>
    ) : (
      <Badge bg="success" pill>
        <CsLineIcons icon="check-circle" /> {'Equivalente'}
      </Badge>
    );
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" size="xl" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Selecione alimentos equivalentes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label className="mb-2">Sugestões automáticas:</label>
        <div>
          {sugestionFoodsResult.isLoading || sugestionFoodsResult.isFetching || sugestionFoodsResult.isPending ? (
            <div className="w-100 text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : sugestionFoodsResult.isError ? (
            <div className="w-100 text-center">Erro ao carregar os alimentos equivalentes</div>
          ) : sugestionFoodsResult.data.length ? (
            sugestionFoodsResult.data.map((food: EquivalentFoodSugestion) => (
              <ToggleButton
                id="tbg-check-1"
                key={food.id + food.tabela}
                value={food.id + food.tabela}
                variant={`${
                  selectedFoods.find((f) => f.idAlimentoEquivalente == food.id && f.tabelaEquivalente == food.tabela) ? 'primary text-white' : 'outline-primary'
                } ms-1 mb-2`}
                onClick={() => handleClickSugestedFood(food)}
              >
                {food.nome}
              </ToggleButton>
            ))
          ) : (
            <div className="w-100 text-center">Nenhuma sugestão de alimento encontrada</div>
          )}
        </div>

        <Row className="d-flex align-items-end mt-3">
          <div className="me-3">
            <label className="mb-1">Filtre por nutriente</label>
            <SelectMultiple />
          </div>
        </Row>

        <Row className="d-flex align-items-end mt-3 mb-3">
          <div className="me-3">
            <label className="mb-1">Busque pelo alimento</label>
            <div className="w-100 w-md-auto search-input-container border border-separator">
              <SearchInput />
            </div>
          </div>
        </Row>

        <Table striped>
          <thead>
            <tr>
              <th>Alimento</th>
              <th>Quantidade</th>
              <th>Medida caseira</th>
              <th>Gramas</th>
              {selectedNutrients.map((nutrient) => (
                <th scope="col" key={nutrient.value}>
                  {nutrient.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {equivalentFoodsResult.isLoading || equivalentFoodsResult.isFetching || equivalentFoodsResult.isPending ? (
              // Renderiza skeletons durante o carregamento
              <tr>
                <td colSpan={4 + selectedNutrients.length} className="text-center p-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </td>
              </tr>
            ) : equivalentFoodsResult.isError ? (
              <tr>
                <td colSpan={4 + selectedNutrients.length}>Erro ao carregar os dados</td>
              </tr>
            ) : equivalentFoodsResult.data && equivalentFoodsResult.data.length > 0 ? (
              slicedEquivalentFoods.map((food: Food) => (
                <tr
                  key={food.id + food.tabela}
                  role="button"
                  onClick={() => handleClickEquivalentFood(food)}
                  className={selectedFoods.find((f) => f.idAlimentoEquivalente == food.id && f.tabelaEquivalente == food.tabela) ? 'bg-primary text-white' : ''}
                >
                  <th className="text-reset col-4">{food.nome}</th>
                  <td className="text-reset w-10" onClick={(e) => e.stopPropagation()}>
                    <Form.Control
                      type="text"
                      className="p-2 text-center"
                      value={food.quantidade}
                      onChange={(e) => handleChangeFoodQuantity(e.target.value, food)}
                    />
                  </td>
                  <td className="text-reset" onClick={(e) => e.stopPropagation()}>
                    <SelectMeasure food={food} onChange={(measure) => handleChangeMeasure(measure, food)} />
                  </td>

                  <td className="text-reset">{Number(food.quantidade) * Number(food.medida_selecionada ? food.medida_selecionada.gramas : food.gramas1)}</td>

                  {selectedNutrients.map((nutrient) => (
                    <td key={nutrient.value}>{getLabelDiferenca(food, nutrient)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  Nenhum resultado encontrado
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Footer */}
        <div className="d-flex justify-content-center mt-4 mb-0">
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
                  disabled={page > filteredEquivalentFoods.length / 5}
                >
                  {page}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= filteredEquivalentFoods.length / 5}>
                <CsLineIcons icon="chevron-right" />
              </Pagination.Next>
            </Pagination>
          </nav>
        </div>

        <div className="w-100 d-flex justify-content-end">
          {isSaving ? (
            <button type="button" className="btn btn-primary" onClick={saveEquivalentFoods} disabled>
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              Salvando...
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={saveEquivalentFoods}>
              Salvar
            </button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalFoodEquivalent;
