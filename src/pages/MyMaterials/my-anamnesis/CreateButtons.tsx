import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { useAnamnesisModalStore } from './hooks/modals/AnamnesisModalStore';

export default function CreateButtons() {
  const { showAnamnesisModal } = useAnamnesisModalStore();

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={showAnamnesisModal}>
        <CsLineIcons icon="check" /> <span>Cadastrar uma anamnese</span>
      </Button>
    </Col>
  );
}
