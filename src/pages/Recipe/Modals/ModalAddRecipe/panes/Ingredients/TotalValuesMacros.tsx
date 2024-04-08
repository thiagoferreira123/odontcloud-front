import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { useModalAddRecipeStore } from '../../hooks/ModalAddRecipeStore';
import { buildRecipeCalories, buildRecipeCarbohydrate, buildRecipeGrams, buildRecipeProtein, buildReciptLipid } from './utils/MathHelper';

export default function TotalValuesMacros() {
  const foods = useModalAddRecipeStore((state) => state.foods);

  return (
    <div>
      <div className="d-flex mt-1">
        <div className="filled w-70"></div>

        <div className="filled w-70"></div>

        <div className="filled me-1 opacity-0">
          <CsLineIcons icon="content" />
          < NumericFormat className="form-control ms-1" placeholder="Qtd" fixedDecimalScale={false} decimalScale={1} />
        </div>

        <div className="row g-2 mx-1 filled">
          <div className="col">
            <Form.Control type="text" className="p-2" disabled value={buildRecipeGrams(foods)} placeholder="Gramas" readOnly={true} />
          </div>
          <div className="col">
            <Form.Control type="text" className="p-2" disabled value={buildRecipeCarbohydrate(foods)} readOnly={true} />
          </div>
          <div className="col">
            <Form.Control type="text" className="p-2" disabled value={buildRecipeProtein(foods)} readOnly={true} />
          </div>
          <div className="col">
            <Form.Control type="text" className="p-2" disabled value={buildReciptLipid(foods)} readOnly={true} />
          </div>
          <div className="col">
            <Form.Control type="text" className="p-2" disabled value={buildRecipeCalories(foods)} readOnly={true} />
          </div>
        </div>

        <div className="d-flex align-items-center">
            <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1 opacity-0" type="button">
              <CsLineIcons icon="bin" />
            </Button>
        </div>
      </div>
    </div>
  );
}
