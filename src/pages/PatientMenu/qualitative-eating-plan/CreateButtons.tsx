import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { useConfigModalStore } from './hooks/ConfigModalStore';

// to={"/app/plano-alimentar-qualitativo/123"}

export default function CreateButtons() {

  const { setShowModalConfig } = useConfigModalStore();

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={setShowModalConfig}>
        <CsLineIcons icon="check" /> <span>Criar um plano alimentar</span>
      </Button>
      {/* <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => setShowModalTemplates(true)}>
        <CsLineIcons icon="check" /> <span>Usar modelo pronto</span>
      </Button> */}
    </Col>
  );
}
