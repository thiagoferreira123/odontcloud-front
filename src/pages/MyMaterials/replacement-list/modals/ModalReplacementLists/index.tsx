import React, { useEffect } from 'react';
import { Col, Form, Modal, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import StaticLoading from '/src/components/loading/StaticLoading';
import { AxiosError } from 'axios';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import { ReplacementListFood } from '/src/types/Food';
import { EquivalentEatingPlanCustomList } from '/src/types/PlanoAlimentarEquivalente';
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
import { useMyReplacementListStore } from '../../hooks/MyReplacementListStore';
import { listGroups } from '/src/pages/EquivalentEatingPlan/hooks/equivalentPlanListStore/initialState';
import { FoodListGroup } from '/src/pages/EquivalentEatingPlan/hooks/equivalentPlanListStore/types';
import AsyncButton from '/src/components/AsyncButton';
import api from '/src/services/useAxios';

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

const compareFoods = (foodId: string, food: ReplacementListFood) => {
  return Number(foodId) === food.id;
};

const parseSelectedFoods = (
  foods: ReplacementListFood[],
  selectedList: EquivalentEatingPlanCustomList | null,
  grupo: FoodListGroup | null
): ReplacementListFood[] => {
  const foodIds = Object.entries(selectedList ?? {})
    .map((entry) => {
      if (entry[0].includes('grupo_' + (grupo ? grupo.id - 1 : 0))) {
        return entry[1] && typeof entry[1] === 'string' ? entry[1].split(',') : [];
      }

      return [];
    })
    .flat();

  const selectedFoodsParsed: Array<ReplacementListFood | null> = foodIds.map((foodId) => {
    return foods.find((f) => compareFoods(foodId, f)) ?? null;
  });

  return selectedFoodsParsed.filter(notEmpty);
};

const isSelected = (food: ReplacementListFood, selectedList: EquivalentEatingPlanCustomList | null, group: FoodListGroup | null) => {
  if (!selectedList || !group) return false;

  return Object.entries(selectedList).find((entry) => {
    if (entry[0] === 'grupo_' + (group ? group.id - 1 : 0)) {
      return entry[1] && typeof entry[1] === 'string' && entry[1].split(',').includes(String(food.id));
    }

    return false;
  });
};

const validateList = (list: EquivalentEatingPlanCustomList | null) => {
  if (!list) return null;

  Object.entries(list ?? {}).forEach((entry) => {
    if (entry[0].includes('grupo_')) {
      list[entry[0]] =
        entry[1] && typeof entry[1] === 'string'
          ? entry[1]
              .split(',')
              .filter((number) => number)
              .join(',')
          : null;
    }
  });

  return list;
};

export default function ModalReplacementLists() {
  const [isSaving, setIsSaving] = React.useState(false);

  const showModal = useMyReplacementListStore((state) => state.showModal);

  const selectedGroup = useMyReplacementListStore((state) => state.selectedGroup);
  const selectedList = useMyReplacementListStore((state) => state.selectedList);

  const validationSchema = Yup.object().shape({
    nome_lista: Yup.string().required('Insira um nome válido'),
  });

  const initialValues = { nome_lista: '' };

  const { setSelectedGroup, getGroupFoods, updateSelectedList, setShowModal, addList, updateList } = useMyReplacementListStore();

  const hansleClickFood = async (food: ReplacementListFood) => {
    if (!selectedGroup) return console.error('selectedGroup is undefined');
    if (!selectedList) return console.error('selectedList is undefined');

    const foodIds = Object.entries(selectedList ?? {})
      .map((entry) => {
        if (entry[0] === 'grupo_' + (selectedGroup.id - 1)) {
          return entry[1] && typeof entry[1] === 'string' ? entry[1].split(',') : [];
        }

        return [];
      })
      .flat();

    if (foodIds.includes(String(food.id))) {
      foodIds.splice(foodIds.indexOf(String(food.id)), 1);
    } else {
      foodIds.push(String(food.id));
    }

    updateSelectedList({ ...selectedList, ['grupo_' + (selectedGroup.id - 1)]: foodIds.join(',') });
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

  const onSubmit = async (values: { nome_lista: string }) => {

    if(!selectedList) return console.error('selectedList is undefined');

    setIsSaving(true);

    try {
      const validatedList = validateList(selectedList);

      if(selectedList.id) {
        await api.patch(`/plano-alimentar-equivalente-lista-personalizada/update/${selectedList.id}`, { ...validatedList, ...values });

        updateList({ ...validatedList, ...values });
      } else {
        const { data } = await api.post("/plano-alimentar-equivalente-lista-personalizada/", { ...validatedList, ...values });

        addList(data);
      }

      setIsSaving(false);
      notify('Lista de substituição salva com sucesso.', 'Sucesso', 'check', 'success');
      setShowModal(false);
    } catch (error) {
      setIsSaving(false);
      notify('Erro ao salvar lista de substituição.', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setValues, values, touched, errors } = formik;

  const resultFood = useQuery({ queryKey: ['list-group-foods', selectedGroup], queryFn: getFoods, enabled: showModal });

  const parsedSelectedFoods = resultFood.data ? parseSelectedFoods(resultFood.data, selectedList, selectedGroup) : [];

  useEffect(() => {
    setValues({ nome_lista: selectedList?.nome_lista ?? '' });
  }, [selectedList?.nome_lista, setValues]);

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" className="modalequivalent-eating-plan-replacement-lists" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Lista de substituições</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {/* Nome da refeição */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Control
                type="text"
                name="nome_lista"
                value={values.nome_lista}
                onChange={handleChange}
                placeholder="Digite um nome para essa lista de substituição"
              />
              {errors.nome_lista && touched.nome_lista && <div className="error">{errors.nome_lista}</div>}
            </Col>
          </Row>

          {/* selecionar lista */}
          <Row>
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
          <Row className="mb-3 text-center">
            <h5>
              Grupo {selectedGroup ? selectedGroup.id : ''} - <span dangerouslySetInnerHTML={{ __html: selectedGroup ? selectedGroup.title : '' }} />
            </h5>
          </Row>

          {/* alimentos */}
          <Row className="mb-3">
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
                        className={`pointer ${isSelected(food, selectedList, selectedGroup) ? 'bg-primary' : ''}`}
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
                            Uma boa lista de substituição, é aquela aonde todos os alimentos possuem o máximo de equivalência possível. Quanto menor for o
                            desvio padrão da lista de substituição, maior será a equivalência dos alimentos selecionados. Por tanto, assegure-se de sempre ter
                            um desvio padrão baixo.
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
            </Col>
          </Row>

          <Row>
            <Col md={12} className='d-flex justify-content-end'>
              <AsyncButton isSaving={isSaving} type="submit" className="mb-1 btn btn-primary">
                Salvar lista
              </AsyncButton>
            </Col>
          </Row>
        </form>
      </Modal.Body>
    </Modal>
  );
}
