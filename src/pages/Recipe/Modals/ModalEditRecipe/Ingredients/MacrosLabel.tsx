import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';

export default function MacrosLabel() {
  return (
    <div>
      <div className="d-flex mt-1">
        <Col xs="auto" className="position-relative pe-4 opacity-0">
          <CsLineIcons icon="sort" className="drag-meal-food-icon pointer position-absolute top-50 start-0 translate-middle-y" />
        </Col>

        <div className="filled w-70"></div>

        <div className="filled w-70"></div>

        <div className="filled me-1 opacity-0 sh-2">
          <CsLineIcons icon="content" />
          < NumericFormat className="form-control ms-1" placeholder="Qtd" fixedDecimalScale={false} decimalScale={1} />
        </div>

        <div className="row g-2 mx-1 filled mb-2">
          <div className="col text-center sh-2">
            <Form.Control type="text" className="p-2 hidden-input" />
            <div className="text-muted text-small me-3">PESO (g)</div>
          </div>
          <div className="col text-center sh-2">
            <Form.Control type="text" className="p-2 hidden-input" />
            <div className="text-muted text-small">CHO</div>
          </div>
          <div className="col text-center sh-2">
            <Form.Control type="text" className="p-2 hidden-input" />
            <div className="text-muted text-small">PTN</div>
          </div>
          <div className="col text-center sh-2">
            <Form.Control type="text" className="p-2 hidden-input" />
            <div className="text-muted text-small">LIP</div>
          </div>
          <div className="col text-center sh-2">
            <Form.Control type="text" className="p-2 hidden-input" />
            <div className="text-muted text-small">KCAL</div>
          </div>
        </div>

        <div className="d-flex align-items-center sh-2">
          <Button variant="primary" size="sm" className="btn-icon btn-icon-only mb-1 ms-1 opacity-0" type="button">
            <CsLineIcons icon="bin" />
          </Button>
        </div>
      </div>
    </div>
  );
}
