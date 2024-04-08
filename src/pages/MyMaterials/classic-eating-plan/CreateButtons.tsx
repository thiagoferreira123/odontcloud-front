import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col } from 'react-bootstrap';

interface CreateButtonsProps {
  className?: string;

  handleEditPlanConfig: () => void;
}

export default function CreateButtons(props: CreateButtonsProps) {
  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => props.handleEditPlanConfig()}>
        <CsLineIcons icon="check" /> <span>Criar um plano alimentar</span>
      </Button>
    </Col>
  );
}
