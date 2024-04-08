import React from 'react';
import SearchFood from './SearchFood';
import SelectMeasure from './SelectMeasure';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { NumericFormat } from 'react-number-format';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ClassicPlanMealTemplateFood } from '/src/types/PlanoAlimentarClassico';
import { useModalStore } from '../../hooks/modalStore';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';

type FoodProps = {
  food: ClassicPlanMealTemplateFood;
};

const notify = (message: string, title: string, icon: string, status?: string) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

export default function Food(props: FoodProps) {
  const { updateSelectedMealFood, removerSelectedMealFood, updateSelectedMealFoodMacros, buildMealMacros } = useModalStore();

  const handleChangeQuantity = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number(e.target.value);

    updateSelectedMealFood({ ...props.food, quantidade_medida: parsedValue });
    updateSelectedMealFoodMacros({ ...props.food, quantidade_medida: parsedValue });

    buildMealMacros();
  };

  const removeFood = async () => {
    try {
      removerSelectedMealFood(props.food);

      buildMealMacros();
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <div className="d-flex mb-2">
      {/* Name Food */}
      <div className="filled w-70">
        <CsLineIcons icon="radish" />
        <SearchFood selectedFood={props.food} />
      </div>

      {/* Measure */}
      <div className="filled w-70">
        <CsLineIcons icon="tea" />
        <SelectMeasure selectedFood={props.food} />
      </div>

      {/* Amount */}
      <div className="filled me-1">
        <CsLineIcons icon="content" />
        < NumericFormat
          className="form-control ms-1"
          placeholder="Qtd"
          value={props.food.quantidade_medida}
          onChange={handleChangeQuantity}
          fixedDecimalScale={false}
          decimalScale={1}
        />
      </div>

      <div className="row g-2 mx-1 filled">
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
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bin">Excluir alimento da refeição</Tooltip>}>
          <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1" type="button" onClick={removeFood}>
            <CsLineIcons icon="bin" />
          </Button>
        </OverlayTrigger>
      </div>
    </div>
  );
}
