import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { CustomAccordionToggle } from '../../CustomAccordionToggle';
import { useSendingMaterialsStore } from '../../hooks/sendingMaterialsStore';
import Material from './Material';

export default function EquivalentEatingPlans() {
  const materials = useSendingMaterialsStore((state) => state.materials);

  return (
    <Card className="d-flex mb-2 flex-grow-1">
      <CustomAccordionToggle eventKey="equivalent-eating-plans">Plano alimentar por grupos</CustomAccordionToggle>
      <Accordion.Collapse eventKey="equivalent-eating-plans">
        <Card.Body className="pt-0">
          {materials.filter(material => material.material === 'plano_alimentar_equivalente').map((material) => (
            <Material key={material.id} material={material} />
          ))}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
