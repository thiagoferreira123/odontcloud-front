import React from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { CustomAccordionToggle } from '../../CustomAccordionToggle';
import { useSendingMaterialsStore } from '../../hooks/sendingMaterialsStore';
import Material from './Material';

export default function RequestingExams() {
  const materials = useSendingMaterialsStore((state) => state.materials);

  return (
    <Card className="d-flex mb-2 flex-grow-1">
      <CustomAccordionToggle eventKey="exames">Solicitações de exame</CustomAccordionToggle>
      <Accordion.Collapse eventKey="exames">
        <Card.Body className="pt-0">
          {materials.filter(material => material.material === 'exame').map((material) => (
            <Material key={material.id} material={material} />
          ))}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
}
