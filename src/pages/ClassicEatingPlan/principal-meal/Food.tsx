import React, { useCallback, useEffect, useState } from 'react';
import SearchFood from './SearchFood';
import SelectMeasure from './SelectMeasure';
import { Collapse, Button, Form, OverlayTrigger, Tooltip, Col } from 'react-bootstrap';
import useClassicPlan from '../hooks/useClassicPlan';
import { NumericFormat } from 'react-number-format';
import EquivalentFood from './EquivalentFood';
import useFilterDisplayStore from '../hooks/useFilterDisplayStore';
import { GripVertical } from 'react-bootstrap-icons';
import { notify } from '../../../components/toast/NotificationIcon';
import { ClassicPlanMealFood } from '../../../types/PlanoAlimentarClassico';
import api from '../../../services/useAxios';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

interface FoodProps {
  food: ClassicPlanMealFood;
  sortableEnabled: boolean;
  index: number;
  handlePersistMacros: () => void;
}

const Food = (props: FoodProps) => {
  const { updateMealFood, removeMealFood, handleOpenModalEquivalentFood } = useClassicPlan();
  const showNutrients = useFilterDisplayStore((state) => state.showNutrients);

  const [quantity, setQuantity] = useState(props.food.quantidade_medida);
  const [showEquivalentFoods, setShowEquivalentFoods] = useState(false);

  const handleChangeQuantity = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (Number(e.target.value) && props.food.quantidade_medida === Number(e.target.value)) return;

      const quantity = Number(e.target.value);
      const gramas = props.food.measure ? Number(props.food.measure.gramas) * quantity : 0;

      const payload: Partial<ClassicPlanMealFood> = {
        id: props.food.id,
        id_refeicao: props.food.id_refeicao,
        carbohydrate: ((Number(props.food.food?.carboidrato) * Number(gramas)) / 100).toFixed(1),
        protein: ((Number(props.food.food?.proteina) * Number(gramas)) / 100).toFixed(1),
        lipid: ((Number(props.food.food?.lipideos) * Number(gramas)) / 100).toFixed(1),
        calories: ((Number(props.food.food?.energia) * Number(gramas)) / 100).toFixed(1),
        gramas: gramas,
        quantidade_medida: quantity,
        alimentoequivalentes: [],
      };

      updateMealFood(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlurQuantity = async (event: React.FocusEvent<HTMLInputElement>) => {
    if (quantity == Number(event.target.value)) return;

    setQuantity(props.food.quantidade_medida);

    try {
      await api.patch('/plano-alimentar-classico-refeicao-alimento/' + props.food.id, {
        quantidade_medida: props.food.quantidade_medida,
        gramas: props.food.gramas,
      });

      await api.delete(`/plano-alimentar-classico-refeicao-alimento/${props.food.id}/equivalents`);

      props.handlePersistMacros();
    } catch (error) {
      notify('Erro ao atualizar alimento', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const removeFood = async () => {
    try {
      removeMealFood(props.food);

      if (typeof props.food.id === 'string') return;
      await api.delete('/plano-alimentar-classico-refeicao-alimento/' + props.food.id);

      props.handlePersistMacros();
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const updateFoodOrder = useCallback(async () => {
    if (!props.food.id || !props.food.id_refeicao) return;

    const payload = {
      id_refeicao: props.food.id_refeicao,
      id_refeicao_alimento: props.food.id,
      posicao: props.index,
    };

    try {
      if (props.food.ordens.length) api.patch('/plano-alimentar-classico-refeicao-alimento-order/' + props.food.ordens[0].id, payload);
      else {
        const response = await api.post('/plano-alimentar-classico-refeicao-alimento-order', payload);

        updateMealFood({ ...props.food, ordens: [response.data] });
      }
    } catch (error) {
      console.error(error);
    }
  }, [props.food, props.index, updateMealFood]);

  useEffect(() => {
    if (!props.sortableEnabled) return;

    updateFoodOrder();
  }, [props.sortableEnabled, updateFoodOrder]);

  return (
    <div>
      <div className="d-flex mt-1">
        <Col xs="auto" className="position-relative pe-4">
          <GripVertical width={24} height={24} className="drag-meal-food-icon all-scroll position-absolute top-50 start-0 translate-middle-y" />
        </Col>

        <div className="filled w-70">
          <CsLineIcons icon="radish" />
          <SearchFood selectedFood={props.food} handlePersistMacros={props.handlePersistMacros} />
        </div>

        <div className="filled w-70">
          <CsLineIcons icon="tea" />
          <SelectMeasure selectedFood={props.food} handlePersistMacros={props.handlePersistMacros} />
        </div>

        <div className="filled me-1">
          <CsLineIcons icon="content" />
          <NumericFormat
            className="form-control ms-1"
            placeholder="Qtd"
            value={Number(props.food.quantidade_medida)}
            onChange={handleChangeQuantity}
            onBlur={handleBlurQuantity}
            fixedDecimalScale={false}
            decimalScale={1}
          />
        </div>

        <div>
          <div className={`filled me-1 w-100 d-flex ${!showNutrients ? 'opacity-0' : ''}`}>
            <div className="d-flex flex-fill">
              <div className="row g-2 mx-1">
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.gramas ?? ''} placeholder="Gramas" readOnly={true} />
                </div>
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.carbohydrate ?? ''} readOnly={true} />
                </div>
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.protein ?? ''} readOnly={true} />
                </div>
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.lipid ?? ''} readOnly={true} />
                </div>
                <div className="col">
                  <Form.Control type="text" className="p-2" disabled value={props.food.calories ?? ''} readOnly={true} />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-sync-horizontal">Insira alimentos substitutos e equivalentes</Tooltip>}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="btn-icon btn-icon-only mb-1 ms-1"
                    type="button"
                    onClick={() => handleOpenModalEquivalentFood(props.food)}
                  >
                    <CsLineIcons icon="sync-horizontal" />
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bin">Excluir alimento da refeição</Tooltip>}>
                  <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={removeFood}>
                    <CsLineIcons icon="bin" />
                  </Button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Button
          onClick={() => setShowEquivalentFoods(!showEquivalentFoods)}
          size="sm"
          className={`mt-1 ms-4 ${props.food.alimentoequivalentes && props.food.alimentoequivalentes.length ? '' : 'd-none'}`}
        >
          Visualizar alimentos equivalentes
        </Button>
        <Collapse in={showEquivalentFoods}>
          <div className="col-6 p-2">
            {props.food.alimentoequivalentes &&
              props.food.alimentoequivalentes.map((equivalentFood) => (
                <EquivalentFood key={equivalentFood.id} equivalentFood={equivalentFood} mealId={props.food.id_refeicao ?? 0} />
              ))}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default React.memo(Food);
