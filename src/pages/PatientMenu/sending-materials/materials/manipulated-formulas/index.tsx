import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { CustomAccordionToggle } from '../../CustomAccordionToggle';
import { useSendingMaterialsStore } from '../../hooks/sendingMaterialsStore';
import Material from './Material';

export default function ManipuledFormulas() {
  const materials = useSendingMaterialsStore((state) => state.materials);

  return (
    <Card className="d-flex mb-2 flex-grow-1">
      <CustomAccordionToggle eventKey="manipuled-formulas">Fórmulas Manipuladas</CustomAccordionToggle>
      <Accordion.Collapse eventKey="manipuled-formulas">
        <Card.Body className="pt-0">
          {materials.filter(material => material.material === 'formulas_manipuladas').map((material) => (
            <Material key={material.id} material={material} />
          ))}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
