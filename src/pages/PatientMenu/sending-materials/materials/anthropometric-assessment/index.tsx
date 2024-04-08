import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { CustomAccordionToggle } from '../../CustomAccordionToggle';
import { useSendingMaterialsStore } from '../../hooks/sendingMaterialsStore';
import Material from './Material';

export default function AnthropometricAssessment() {
  const materials = useSendingMaterialsStore((state) => state.materials);

  return (
    <Card className="d-flex mb-2 flex-grow-1">
      <CustomAccordionToggle eventKey="anthropometric-assessments">Avaliações antropométricas</CustomAccordionToggle>
      <Accordion.Collapse eventKey="anthropometric-assessments">
        <Card.Body className="pt-0">
          {materials.filter(material => material.material === 'avaliacao_antropometrica').map((material) => (
            <Material key={material.id} material={material} />
          ))}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
