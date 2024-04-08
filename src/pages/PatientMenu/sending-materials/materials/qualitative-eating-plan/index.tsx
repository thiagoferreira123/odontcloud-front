import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { CustomAccordionToggle } from '../../CustomAccordionToggle';
import { useSendingMaterialsStore } from '../../hooks/sendingMaterialsStore';
import Material from './QualitativeEatingPlan';

export default function QualitativeEatingPlans() {
  const materials = useSendingMaterialsStore((state) => state.materials);

  return (
    <Card className="d-flex mb-2 flex-grow-1">
      <CustomAccordionToggle eventKey="qualitative-eating-plan">Plano alimentar qualitativo</CustomAccordionToggle>
      <Accordion.Collapse eventKey="qualitative-eating-plan">
        <Card.Body className="pt-0">
          {materials.filter(material => material.material === 'plano_qualitativo').map((material) => (
            <Material key={material.id} material={material} />
          ))}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
