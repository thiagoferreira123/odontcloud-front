import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { CustomAccordionToggle } from '../../CustomAccordionToggle';
import { useSendingMaterialsStore } from '../../hooks/sendingMaterialsStore';
import Material from './Material';

export default function ClassicEatingPlans() {
  const materials = useSendingMaterialsStore((state) => state.materials);

  return (
    <Card className="d-flex mb-2 flex-grow-1">
      <CustomAccordionToggle eventKey="classic-eating-plans">Plano alimentar clássico</CustomAccordionToggle>
      <Accordion.Collapse eventKey="classic-eating-plans">
        <Card.Body className="pt-0">
          {materials.filter(material => material.material === 'plano_alimentar').map((material) => (
            <Material key={material.id} material={material} />
          ))}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
