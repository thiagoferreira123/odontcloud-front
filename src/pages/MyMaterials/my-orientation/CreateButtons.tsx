import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { OrientationTemplate } from '/src/types/PlanoAlimentarClassico';
import { useMyOrientationStore } from './hooks/MyOrientationStore';

export default function CreateButtons() {
  const { handleSelectOrientation } = useMyOrientationStore();

  const handleCreateOrientation = () => {
    const newList: OrientationTemplate = {
      nome: '',
      orientacao: '',
    };

    handleSelectOrientation(newList);
  };

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => handleCreateOrientation()}>
        <CsLineIcons icon="check" /> <span>Cadastrar uma orientação</span>
      </Button>
    </Col>
  );
}
