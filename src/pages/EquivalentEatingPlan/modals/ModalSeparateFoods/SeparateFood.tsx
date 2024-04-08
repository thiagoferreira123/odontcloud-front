import React from 'react';
import SearchFood from './SearchFood';
import SelectMeasure from './SelectMeasure';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { NumericFormat } from 'react-number-format';
import { EquivalentEatingPlanMealFood } from '/src/types/PlanoAlimentarEquivalente';
import { Form } from 'react-bootstrap';
import { useModalsStore } from '/src/pages/EquivalentEatingPlan/hooks/modalsStore';

type SeparateFoodProps = {
  food: EquivalentEatingPlanMealFood;
};

export default function SeparateFood(props: SeparateFoodProps) {

  const { updateSelectedMealFood, updateSelectedMealFoodMacros } = useModalsStore();

  const handleChangeQuantity = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = Number(e.target.value);

    updateSelectedMealFood({ ...props.food, quantidade: parsedValue});
    updateSelectedMealFoodMacros({ ...props.food, quantidade: parsedValue});
  }

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
          value={props.food.quantidade}
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
          <Form.Control type="text" className="p-2" disabled value={props.food.carboidratos ?? ''} readOnly={true} />
        </div>
        <div className="col">
          <Form.Control type="text" className="p-2" disabled value={props.food.proteinas ?? ''} readOnly={true} />
        </div>
        <div className="col">
          <Form.Control type="text" className="p-2" disabled value={props.food.lipideos ?? ''} readOnly={true} />
        </div>
        <div className="col">
          <Form.Control type="text" className="p-2" disabled value={props.food.kcal ?? ''} readOnly={true} />
        </div>
      </div>
    </div>
  );
}
