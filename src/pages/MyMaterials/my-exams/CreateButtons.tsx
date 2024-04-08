import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useModalAddExamBloodStore } from '/src/pages/RequestingExams/hooks/ModalAddExamBloodStore';
import React from 'react';
import { Button, Col } from 'react-bootstrap';

export default function CreateButtons() {

  const { handleShowModal } = useModalAddExamBloodStore();

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={handleShowModal}>
        <CsLineIcons icon="check" /> <span>Cadastrar um exame</span>
      </Button>
    </Col>
  );
}
