import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, ButtonGroup, Col, Collapse, Dropdown, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { PatternFormat } from 'react-number-format';
import { useEquivalentEatingPlanStore } from '../hooks/equivalentEatingPlanStore';
import { toast } from 'react-toastify';
import { useEquivalentEatingPlanListStore } from '../hooks/equivalentPlanListStore';
import { FoodListGroup } from '../hooks/equivalentPlanListStore/types';
import { useModalsStore } from '../hooks/modalsStore';
import { calories, carbohydrate, fat, protein } from './utils/MathHelpers';
import Comment from './Comment';
import { GripVertical } from 'react-bootstrap-icons';
import { EquivalentEatingPlanMeal, EquivalentEatingPlanMealFood } from '../../../types/PlanoAlimentarEquivalente';
import NotificationIcon, { notify } from '../../../components/toast/NotificationIcon';
import api from '../../../services/useAxios';
import { removeMealNotification } from '../../ClassicEatingPlan/services/NotificationService';
import { regexNumberFloat } from '../../../helpers/InputHelpers';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { parseFloatNumber } from '../../../helpers/MathHelpers';
import { averageCalories, averageCarbohydrate, averageFat, averageProtein } from '../modals/ModalReplacementLists/utils/MathHelpers';

interface CardMealProps {
  meal: EquivalentEatingPlanMeal;
  index: number;
  sortableEnabled: boolean;
}

type Task = () => Promise<void>;

export default function CardMeal(props: CardMealProps) {
  const [showButtonRemoveImage, setShowButtonRemoveImage] = useState(false);
  const [pendentChanges, setPendentChanges] = useState(false);
  const [foodsCloapse, setFoodsColapse] = useState(false);

  const [queue, setQueue] = useState<Task[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const processQueue = async () => {
    if (isProcessing || queue.length === 0) return;
    setIsProcessing(true);
    const currentTask = queue[0];
    await currentTask();
    setQueue((prevQueue) => prevQueue.slice(1));
    setIsProcessing(false);
  };

  const toastId = useRef<React.ReactText>();

  const selectedFoods = useEquivalentEatingPlanStore((state) => state.selectedFoods);

  const listGroups = useEquivalentEatingPlanListStore((state) => state.listGroups);

  const { cloneMeal, updateMeal, updateMealMacros, addMealFood, updateMealFood, removeMealFood } = useEquivalentEatingPlanStore();
  const { getSelectedGroups, getGroupFoods, setSelectedGroup } = useEquivalentEatingPlanListStore();
  const {
    setShowModalFoodOptions,
    setShowModalSeparateFoods,
    setShowModalObservationMeal,
    setShowModalPhotoMeal,
    setShowModalDeleteMeal,
    setSelectedFood,
    setSelectedMeal,
  } = useModalsStore();

  const handleRemoveMealImage = async () => {
    console.error('handleRemoveMealImage');
    const payload = {
      linkImagem: null,
    };

    updateMeal({ ...payload, id: props.meal.id });

    try {
      await api.patch('/plano-alimentar-equivalente-refeicao/' + props.meal.id, payload);
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleHorario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      horario: e.target.value,
    };

    updateMeal({ ...payload, id: props.meal.id });

    setPendentChanges(true);
  };

  const handleNome = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      nome: e.target.value,
    };

    updateMeal({ ...payload, id: props.meal.id });

    setPendentChanges(true);
  };

  const handleChangeMealText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      textoDaRefeicao: e.target.value,
    };

    updateMeal({ ...payload, id: props.meal.id });

    setPendentChanges(true);
  };

  const handleUpdadeMeal = async () => {
    if (!pendentChanges) return;
    if (!props.meal.id) throw new Error('Refeição não definida');

    setPendentChanges(false);

    const payload = {
      horario: props.meal.horario,
      nome: props.meal.nome,
      textoDaRefeicao: props.meal.textoDaRefeicao,
    };

    try {
      await api.patch('/plano-alimentar-equivalente-refeicao/' + props.meal.id, payload);

      await removeMealNotification([props.meal.id], true);
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleUpdateFoodAmount = async (value: string, group: FoodListGroup, index: number) => {
    if (!props.meal.id) throw new Error('Refeição não definida');

    const selectedFood = selectedFoods.find((food) => {
      return food.grupo === group.name;
    });

    if (!selectedFood) return console.error('Food not found');

    const payload = {
      amounts: [...props.meal.amounts],
    };

    payload.amounts[index] = regexNumberFloat(value);

    updateMeal({ ...payload, id: props.meal.id });
    updateMealMacros(props.meal);

    const groupFoods = await getGroupFoods(group.id);
    const actualFood = groupFoods[0];
    const parsedSelectedFoods = groupFoods.filter((food) => selectedFoods.findIndex((f) => f.idAlimento === food.id && f.grupo === group.name) !== -1);

    const parsedValue = Number(regexNumberFloat(value) as string);

    if (!props.meal.alimentos.find((food) => food.grupo === group.name)) {
      if (!props.meal.alimentos.find((food) => food.id === actualFood.id)) {
        const newFood = {
          id_alimento: null,
          nome: actualFood.descricao_dos_alimentos,
          quantidade: Number(parsedValue),
          medida_caseira: actualFood.medidas_caseiras,
          gramas: Number(actualFood.gramas),
          carboidratos: Number(averageCarbohydrate(parsedSelectedFoods)) * Number(parsedValue),
          proteinas: Number(averageProtein(parsedSelectedFoods)) * Number(parsedValue),
          lipideos: Number(averageFat(parsedSelectedFoods)) * Number(parsedValue),
          kcal: Number(averageCalories(parsedSelectedFoods)) * Number(parsedValue),
          id_refeicao: props.meal.id,
          grupo: group.name,
          is_avulso: 0,
          id_avulso: null,
          unidade: Number(actualFood.unidade),
          key: btoa(actualFood.id + group.name),
        };

        addToQueue(async () => {
          const response = await api.post('/plano-alimentar-equivalente-refeicao-alimento', newFood);

          addMealFood(response.data);
        });
      }
    } else {
      const food = props.meal.alimentos.find((food) => food.grupo === group.name);

      if (food && Number(value) > 0) {
        const payload = { ...food, quantidade: parsedValue, gramas: Number(food.unidade) * food.quantidade * Number(actualFood.gramas) };

        updateMealFood(payload);

        api.patch('/plano-alimentar-equivalente-refeicao-alimento/update/' + food.id, payload);
      } else if (food) {
        removeMealFood(food);
        updateMeal({ id: props.meal.id, alimentosSubstitutos: props.meal.alimentosSubstitutos.filter((f) => f.grupoAlimentoSubstituto !== food.grupo) });

        const substitutos = props.meal.alimentosSubstitutos.filter((f) => f.grupoAlimentoSubstituto == food.grupo);

        for (const substituto of substitutos) {
          await api.delete('/plano-alimentar-equivalente-refeicao-alimento-substituto/' + substituto.id);
        }

        await api.delete('/plano-alimentar-equivalente-refeicao-alimento/' + food.id);
      }
    }
  };

  const handleRemoveMeal = async () => {
    if (!props.meal.id) throw new Error('Refeição não definida');

    setShowModalDeleteMeal(true);
    setSelectedMeal(props.meal);
  };

  const handleRemoveSeparateFood = async (food: EquivalentEatingPlanMealFood) => {
    try {
      removeMealFood(food);
      updateMealMacros(props.meal);

      if (food.id) await api.delete(`/plano-alimentar-equivalente-refeicao-alimento/${food.id}`);
    } catch (error) {
      notify('Erro ao remover alimento avulso', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleToogleTextMode = async () => {
    const payload = {
      tipoTexto: props.meal.tipoTexto === 'SIM' ? 'NAO' : 'SIM',
    };

    updateMeal({ ...payload, id: props.meal.id });

    try {
      await api.patch('/plano-alimentar-equivalente-refeicao/' + props.meal.id, payload);
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleShowModalFoodOptions = (food: EquivalentEatingPlanMealFood) => {
    setSelectedMeal(props.meal);
    setSelectedFood(food);
    setShowModalFoodOptions(true);
  };

  const handleOpenModalSeparateFoods = () => {
    setSelectedMeal(props.meal);
    setShowModalSeparateFoods(true);
  };

  const handleOpenModalObservation = () => {
    setSelectedMeal(props.meal);
    setShowModalObservationMeal(true);
  };

  const handleOpenModalPhotoMeal = () => {
    setSelectedMeal(props.meal);
    setShowModalPhotoMeal(true);
  };

  const handleDuplicateMeal = async () => {
    if (!props.meal.id) throw new Error('Refeição não definida');

    toastId.current = notify('Clonando refeição, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      await cloneMeal(props.meal.id);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Refeição duplicada com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });
    } catch (error) {
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao duplicar refeição!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  const handleRemoveMealFromCalcularion = useCallback(async () => {
    const payload = {
      calculavel: props.meal.calculavel ? 0 : 1,
    };

    updateMeal({ ...payload, id: props.meal.id });

    try {
      await api.patch('/plano-alimentar-equivalente-refeicao/' + props.meal.id, payload);
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  }, [props.meal, updateMeal]);

  const updateMealOrder = useCallback(async () => {
    const payload = {
      id_refeicao: props.meal.id,
      posicao: props.index,
    };

    try {
      if (props.meal.ordens.length) api.patch('/plano-alimentar-equivalente-refeicao-ordem/' + props.meal.ordens[0].id, payload);
      else {
        const response = await api.post('/plano-alimentar-equivalente-refeicao-ordem', payload);
        updateMeal({ ...props.meal, ordens: [response.data] });
      }
    } catch (error) {
      console.error(error);
    }
  }, [props.index, props.meal, updateMeal]);

  useEffect(() => {
    if (!props.sortableEnabled) return;

    updateMealOrder();
  }, [props.sortableEnabled, updateMealOrder]);

  useEffect(() => {
    processQueue();
  }, [queue, isProcessing]);

  // Função para adicionar tarefas à fila
  const addToQueue = (task: Task) => {
    setQueue((prevQueue) => [...prevQueue, task]);
  };

  return (
    <div className={`mb-1 p-2 pt-0 ${!props.meal.calculavel ? 'bg-light-danger rounded' : false}`}>
      <Row>
        <Col md={12} className="d-flex px-1 sh-4-4 equivalent-meal-plan-meal-row">
          <Col md={3} className="d-flex align-items-center">
            {/* Image */}
            <Col xs="auto" className="h-100 col-auto d-flex align-items-center position-relative">
              <img
                src={props.meal.linkImagem ?? ''}
                alt="product-2"
                className={`card-img card-img-horizontal sw-7 sh-5 ${!props.meal.linkImagem ? 'd-none' : ''}`}
                style={{ transform: 'translateX(-75%)', marginRight: '-2.5rem' }}
                onMouseOver={() => setShowButtonRemoveImage(true)}
                onFocus={() => setShowButtonRemoveImage(true)}
                onMouseOut={() => setShowButtonRemoveImage(false)}
                onBlur={() => setShowButtonRemoveImage(false)}
              />

              <Button
                onClick={handleRemoveMealImage}
                className={`position-absolute bottom-0 end-0 btn btn-sm btn-icon btn-icon-only btn-secondary ms-1 ${
                  !showButtonRemoveImage || !props.meal.linkImagem ? 'd-none' : false
                }`}
                style={{ transform: 'translateX(-75%)' }}
                type="button"
              >
                <CsLineIcons icon="bin" />
              </Button>

              <GripVertical width={24} height={24} className="drag-meal-icon all-scroll" />
            </Col>

            {/* Horário/Nome */}
            <div className="d-flex flex-row align-items-center h-100">
              <div className="d-flex flex-column justify-content-center w-50 h-100 filled">
                <CsLineIcons icon="clock" />
                <PatternFormat
                  className="form-control h-100"
                  format="##:##"
                  mask="_"
                  placeholder="HH:MM"
                  value={props.meal.horario !== '00:00:00' ? props.meal.horario : ''}
                  onChange={handleHorario}
                  onBlur={handleUpdadeMeal}
                />
              </div>

              <div className="d-flex flex-column justify-content-center ms-1 h-100 filled">
                <CsLineIcons icon="form" />
                <Form.Control
                  className="h-100"
                  placeholder="Digite o nome da refeição"
                  type="text"
                  value={props.meal.nome}
                  onChange={handleNome}
                  onBlur={handleUpdadeMeal}
                />
              </div>
            </div>
          </Col>

          {/* Food Groups */}
          {!props.meal.tipoTexto || props.meal.tipoTexto != 'SIM' ? (
            <>
              {getSelectedGroups(selectedFoods, listGroups).map((group, index) => (
                <input
                  key={group.id}
                  value={props.meal.amounts[index] ? props.meal.amounts[index] : ''}
                  onChange={(e) => handleUpdateFoodAmount(e.target.value, group, index)}
                  className="form-control ms-1 qnt-equivalente no-arrows"
                  onFocus={() => setSelectedGroup(group)}
                  onBlur={() => setSelectedGroup(null)}
                />
              ))}
            </>
          ) : null}

          {/* Macros */}
          <Col className="text-start">
            <div className="row ms-1 filled me-0">
              <div className="col px-0">
                <Form.Control type="text" className="p-0" disabled value={parseFloatNumber(carbohydrate(props.meal.alimentos))} />
                {/* cho */}
              </div>
              <div className="col pe-0 ps-1">
                <Form.Control type="text" className="p-0" disabled value={parseFloatNumber(protein(props.meal.alimentos))} />
                {/* ptn */}
              </div>
              <div className="col pe-0 ps-1">
                <Form.Control type="text" className="p-0" disabled value={parseFloatNumber(fat(props.meal.alimentos))} />
                {/* lip */}
              </div>
              <div className="col pe-0 ps-1">
                <Form.Control type="text" className="p-0" disabled value={parseFloatNumber(calories(props.meal.alimentos))} />
                {/* kcal */}
              </div>
            </div>
          </Col>

          {/* Actions */}
          <Col md="auto" className="d-flex justify-content-end">
            <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip-bin">Expandir refeição para visualizar os alimentos</Tooltip>}>
              <Button
                onClick={() => setFoodsColapse(!foodsCloapse)}
                aria-controls="example-collapse-text"
                aria-expanded={foodsCloapse}
                size="sm"
                variant="primary"
                type="button"
                className="btn-icon btn-icon-only  ms-1"
              >
                <CsLineIcons icon="eye" />
              </Button>
            </OverlayTrigger>

            <Dropdown as={ButtonGroup} autoClose={true}>
              <Dropdown.Toggle variant="primary" className="ms-1" size="sm" id="dropdown-autoclose-true"></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleOpenModalSeparateFoods}>
                  <CsLineIcons icon="radish" /> Inserir alimento avulso
                </Dropdown.Item>
                <Dropdown.Item onClick={handleOpenModalObservation}>
                  <CsLineIcons icon="message" /> Inserir uma observação na refeição
                </Dropdown.Item>
                <Dropdown.Item onClick={handleOpenModalPhotoMeal}>
                  <CsLineIcons icon="image" /> Inserir uma imagem na refeição
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDuplicateMeal}>
                  <CsLineIcons icon="duplicate" /> Duplicar refeição
                </Dropdown.Item>
                <Dropdown.Item onClick={handleToogleTextMode}>
                  <CsLineIcons icon="text" /> {props.meal.tipoTexto === 'SIM' ? 'Retornar refeição para modo clássico' : 'Alterar refeição para modo texto'}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleRemoveMealFromCalcularion()}>
                  <CsLineIcons icon="abacus" /> {`${props.meal.calculavel ? 'Retirar refeição do cálculo' : 'Adicionar refeição ao cálculo'}`}
                </Dropdown.Item>
                <Dropdown.Item onClick={handleRemoveMeal}>
                  <CsLineIcons icon="bin" /> Remover refeição
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Col>

        <Collapse in={foodsCloapse}>
          <Row className="m-0">
            {!props.meal.tipoTexto || props.meal.tipoTexto != 'SIM' ? (
              <>
                <Col md={6}>
                  {props.meal.alimentos
                    .filter((food) => Number(food.quantidade))
                    .map((food) => (
                      <div className="mt-2" key={food.id}>
                        {food.is_avulso ? (
                          <Button
                            className="btn-icon btn-icon-only mb-1 me-2"
                            variant="outline-primary"
                            type="button"
                            size="sm"
                            onClick={() => handleRemoveSeparateFood(food)}
                          >
                            <CsLineIcons icon="bin" />
                          </Button>
                        ) : (
                          <Button
                            className="btn-icon btn-icon-only mb-1 me-2"
                            variant="outline-primary"
                            size="sm"
                            type="button"
                            onClick={() => handleShowModalFoodOptions(food)}
                          >
                            <CsLineIcons icon="sync-horizontal" />
                          </Button>
                        )}
                        <span>
                          {food.nome} - {parseFloatNumber(food.quantidade * Number(food.unidade))} {food.medida_caseira} ({parseFloatNumber(food.gramas)}g)
                        </span>
                      </div>
                    ))}
                </Col>
              </>
            ) : (
              <Form.Control
                as="textarea"
                rows={4}
                className="mt-4"
                onChange={handleChangeMealText}
                onBlur={handleUpdadeMeal}
                value={props.meal.textoDaRefeicao}
              />
            )}

            <Comment meal={props.meal} />
          </Row>
        </Collapse>
      </Row>
    </div>
  );
}
