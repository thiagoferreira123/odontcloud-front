import React, { useState } from 'react';
import { Col, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import SearchReplacementLists from './SearchReplacementLists';
import { useEquivalentEatingPlanListStore } from '/src/pages/EquivalentEatingPlan/hooks/equivalentPlanListStore';
import api from '/src/services/useAxios';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '/src/components/loading/StaticLoading';
import { AxiosError } from 'axios';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import { ReplacementListFood } from '/src/types/Food';
import { EquivalentEatingPlanGrupoSelectedFood } from '/src/types/PlanoAlimentarEquivalente';
import { useEquivalentEatingPlanStore } from '/src/pages/EquivalentEatingPlan/hooks/equivalentEatingPlanStore';
import { notEmpty } from '/src/helpers/Utils';
import {
  averageCalories,
  averageCarbohydrate,
  averageFat,
  averageProtein,
  deviationCalories,
  deviationCarbohydrate,
  deviationFat,
  deviationProtein,
} from './utils/MathHelpers';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';

interface ModalReplacementListsProps {
  show: boolean;
  onClose: () => void;
}

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

const compareFoods = (selectedFood: EquivalentEatingPlanGrupoSelectedFood, food: ReplacementListFood, group: string) => {
  return selectedFood.idAlimento === food.id && selectedFood.grupo === group;
};

const parseSelectedFoods = (foods: ReplacementListFood[], selectedFoods: EquivalentEatingPlanGrupoSelectedFood[], grupo: string): ReplacementListFood[] => {
  const selectedFoodsParsed: Array<ReplacementListFood | null> = selectedFoods.map((food) => {
    return foods.find((f) => compareFoods(food, f, grupo)) ?? null;
  });

  return selectedFoodsParsed.filter(notEmpty);
};

export default function ModalReplacementLists(props: ModalReplacementListsProps) {
  const [isSelecting, setIsSelecting] = useState(false);

  const planId = useEquivalentEatingPlanStore((state) => state.planId);
  const selectedFoods = useEquivalentEatingPlanStore((state) => state.selectedFoods);
  const { setSelectedFoods, addSelectedFood } = useEquivalentEatingPlanStore();

  const listGroups = useEquivalentEatingPlanListStore((state) => state.listGroups);
  const selectedGroup = useEquivalentEatingPlanListStore((state) => state.selectedGroup);

  const { setSelectedGroup, getGroupFoods } = useEquivalentEatingPlanListStore();

  const hansleClickFood = async (food: ReplacementListFood) => {
    if (!selectedGroup) return console.error('selectedGroup is undefined');

    const loadedFood = selectedFoods.find((f) => compareFoods(f, food, selectedGroup.name));

    if (loadedFood) {
      setSelectedFoods(selectedFoods.filter((f) => f !== loadedFood));

      if (typeof loadedFood.id === 'string') return;

      api.delete('/plano-alimentar-equivalente-grupo-alimento-selecionado/remove/' + loadedFood.id);
    } else {

      if(!food.id) return console.error('food.id is undefined');

      const payload: EquivalentEatingPlanGrupoSelectedFood = {
        id: btoa(String(Math.random())),
        idPae: planId,
        grupo: selectedGroup.name,
        idAlimento: food.id,
      };

      addSelectedFood(payload);

      const request = await api.post('/plano-alimentar-equivalente-grupo-alimento-selecionado', { ...payload, id: undefined });

      selectedFoods.map((f) => {
        if (f.id === payload.id) {
          return { ...f, id: request.data.id };
        }

        return f;
      });
    }
  };

  const getFoods = async () => {
    try {
      if (!selectedGroup) return console.error('selectedGroup is undefined');

      return await getGroupFoods(selectedGroup.id);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) return [];

      if (error instanceof AxiosError && error.response?.data?.message) {
        notify(error.response.data.message, 'Erro', 'close', 'danger');
        return;
      }

      console.error(error);
      notify('Erro os alimentos do grupo.', 'Erro', 'close', 'danger');
      return [];
    }
  };

  const resultFood = useQuery({ queryKey: ['list-group-foods', selectedGroup], queryFn: getFoods, enabled: props.show });

  const parsedSelectedFoods = resultFood.data ? parseSelectedFoods(resultFood.data, selectedFoods, selectedGroup?.name ?? '') : [];

  return (
    <Modal show={props.show} onHide={props.onClose} backdrop="static" className="modalequivalent-eating-plan-replacement-lists" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Lista de substituições</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* selecionar lista */}
        <Row>
          <Col md={12}>
            <SearchReplacementLists setIsSelecting={setIsSelecting} />
          </Col>

          {/* selecionar grupo */}
          <Col md={12} className="d-flex justify-content-between align-items-center text-center py-4">
            {listGroups
              .filter((group) => group.nutrient)
              .map((group) => (
                <img
                  key={group.id}
                  src={`/img/equivalent-groups/g-${group.id}.webp`}
                  alt="group-image"
                  className={`card-img qnt-equivalente pointer ${selectedGroup && selectedGroup.id === group.id ? 'opacity-25' : ''}`}
                  onClick={() => setSelectedGroup(group)}
                />
              ))}
          </Col>
        </Row>

        {/* titulo grupo */}
        <Row className="mt-2 mb-2 text-center">
          <h5>
            Grupo {selectedGroup ? selectedGroup.id : ''} - <span dangerouslySetInnerHTML={{ __html: selectedGroup ? selectedGroup.title : '' }} />
          </h5>
        </Row>

        {/* alimentos */}
        <Row>
          <Col md={12} className="d-flex justify-content-center align-items-center text-center position-relative">
            <Table striped>
              <thead>
                <tr>
                  <th scope="col">
                    Alimento <small>g</small>
                  </th>
                  <th scope="col">
                    Medida caseira <small>g</small>
                  </th>
                  <th scope="col">
                    PTN <small>g</small>
                  </th>
                  <th scope="col">
                    CHO <small>g</small>
                  </th>
                  <th scope="col">
                    LIP <small>g</small>
                  </th>
                  <th scope="col">KCAL</th>
                </tr>
              </thead>
              <tbody>
                {resultFood.isLoading ? (
                  <tr>
                    <td colSpan={6}>
                      <StaticLoading />
                    </td>
                  </tr>
                ) : resultFood.isError ? (
                  <tr>
                    <td colSpan={6}>Ocorreu um erro ao buscar alimentos</td>
                  </tr>
                ) : !resultFood.data || !resultFood.data.length ? (
                  <tr>
                    <td colSpan={6}>Nenhum alimento encontrado</td>
                  </tr>
                ) : (
                  resultFood.data.map((food: ReplacementListFood) => (
                    <tr
                      key={food.id}
                      className={`pointer ${selectedFoods.find((f) => compareFoods(f, food, selectedGroup?.name ?? '')) ? 'bg-primary' : ''}`}
                      onClick={() => hansleClickFood(food)}
                    >
                      <td className="text-start">{food.descricao_dos_alimentos}</td>
                      <td>
                        {Number(Number(food.unidade).toFixed(1))} {food.medidas_caseiras} ({Number(Number(food.gramas).toFixed(1))}g)
                      </td>
                      <td>{Number(Number(food.proteina).toFixed(1))}</td>
                      <td>{Number(Number(food.carboidrato).toFixed(1))}</td>
                      <td>{Number(Number(food.lipideos).toFixed(1))}</td>
                      <td>{Number(Number(food.energia).toFixed(1))}</td>
                    </tr>
                  ))
                )}

                <tr>
                  <th></th>
                  <td className="text-start">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-top">
                          Todos os alimentos do grupo alimentar, mesmo que em quantidades diferentes, possuem quantidades equivalentes do nutriente chave. Ao
                          selecionar os alimentos que irão compor a lista de substituição do seu paciente, é feito uma média dos macronutrientes. A média é
                          utilizada para realizar a distribuição de porções conforme as necessidades do paciente.
                        </Tooltip>
                      }
                    >
                      <span>
                        <CsLineIcons className="me-1  text-primary" icon="info-hexagon" size={16} />
                      </span>
                    </OverlayTrigger>
                    Média μ :
                  </td>
                  <td>{averageProtein(parsedSelectedFoods)}g</td>
                  <td>{averageCarbohydrate(parsedSelectedFoods)}g</td>
                  <td>{averageFat(parsedSelectedFoods)}g</td>
                  <td>{averageCalories(parsedSelectedFoods)}kcal</td>
                </tr>
                <tr>
                  <th></th>
                  <td className="text-start">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-top">
                          Uma boa lista de substituição, é aquela aonde todos os alimentos possuem o máximo de equivalência possível. Quanto menor for o desvio
                          padrão da lista de substituição, maior será a equivalência dos alimentos selecionados. Por tanto, assegure-se de sempre ter um desvio
                          padrão baixo.
                        </Tooltip>
                      }
                    >
                      <span>
                        <CsLineIcons className="me-1  text-primary" icon="info-hexagon" size={16} />
                      </span>
                    </OverlayTrigger>
                    Desvrio padrão σ :
                  </td>
                  <td>{deviationProtein(parsedSelectedFoods)}</td>
                  <td>{deviationCarbohydrate(parsedSelectedFoods)}</td>
                  <td>{deviationFat(parsedSelectedFoods)}</td>
                  <td>{deviationCalories(parsedSelectedFoods)}</td>
                </tr>
              </tbody>
            </Table>

            {isSelecting ? (
              <div className="position-absolute h-100 w-100 d-flex pt-5">
                <StaticLoading className="mt-5" />
              </div>
            ) : null}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
