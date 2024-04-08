import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { useModalAddFormulatedStore } from '../../ManipulatedFormulas/hooks/modals/ModalAddFormulatedStore';

export default function CreateButtons() {

  const { showModalAddFormulated } = useModalAddFormulatedStore();

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={showModalAddFormulated}>
        <CsLineIcons icon="check" /> <span>Cadastrar uma fórmua manipulada</span>
      </Button>
    </Col>
  );
}
