import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useEquivalentEatingPlanStore } from './hooks/equivalentEatingPlanStore';
import { useEquivalentEatingPlanListStore } from './hooks/equivalentPlanListStore';
import ListGroupOverlay from './meal/ListGroupOverlay';

const FoodGroups = () => {
  const selectedFoods = useEquivalentEatingPlanStore((state) => state.selectedFoods);
  const listGroups = useEquivalentEatingPlanListStore((state) => state.listGroups);

  const { getSelectedGroups } = useEquivalentEatingPlanListStore();

  return (
    <Row className="d-flex my-2 mb-0 align-items-end">
      <Col md={3}></Col>
      <Col className="col-auto ps-1 pe-0 d-flex align-items-start pb-2">
        {getSelectedGroups(selectedFoods, listGroups).map((group) => (
          <div className="position-relative" key={group.id}>
            <ListGroupOverlay group={group} />
            <img src={`/img/equivalent-groups/g-${group.id}.webp`} alt={group.name} className="card-img qnt-equivalente ms-1 sh-4" />
          </div>
        ))}
      </Col>
      <Col className='col ps-1'>
        <div className="row ms-1 filled me-0">
          <div className="col px-0 text-muted text-center">cho</div>
          <div className="col pe-0 ps-1 text-muted text-center">ptn</div>
          <div className="col pe-0 ps-1 text-muted text-center">lip</div>
          <div className="col pe-0 ps-1 text-muted text-center">kcal</div>
        </div>
      </Col>

      {/* Actions */}
      <Col md="auto" className="d-flex justify-content-end col-md-auto ps-1 pe-0">
        <Button
          size="sm"
          className="btn-icon btn-icon-only ms-1 opacity-0"
        ></Button>
        <Button
          size="sm"
          className="btn-icon btn-icon-only ms-1 opacity-0"
        ></Button>
      </Col>
    </Row>
  );
};

export default FoodGroups;
