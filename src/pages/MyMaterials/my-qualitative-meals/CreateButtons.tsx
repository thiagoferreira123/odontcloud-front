import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { useConfigQualitativeMealModalStore } from './hooks/ConfigQualitativeMealModal';

export default function CreateButtons() {
  const { handleOpenConfigModal } = useConfigQualitativeMealModalStore();

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={handleOpenConfigModal}>
        <CsLineIcons icon="check" /> <span>Criar uma refeição</span>
      </Button>
    </Col>
  );
}
