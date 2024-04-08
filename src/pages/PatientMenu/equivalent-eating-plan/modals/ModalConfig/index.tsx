import React, { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import FormConfigClassicEatingPlan from './FormConfigClassicEatingPlan';

interface FormConfigClassicEatingPlanRef {
  handleSubmit: () => void;
}

interface ModalConfigProps {
  showModal: boolean;
  handleCloseModal: () => void;
}

const ModalConfig = (props: ModalConfigProps) => {
  const formRef = useRef<FormConfigClassicEatingPlanRef>();
  const [isLoading, setIsLoading] = useState(false);

  const chamarMetodoFilho = async () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
  };

  return (
    <Modal className="modal-right large" show={props.showModal} onHide={props.handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Configurações do plano alimentar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormConfigClassicEatingPlan ref={formRef} setIsLoading={setIsLoading} handleCloseModal={props.handleCloseModal}/>
      </Modal.Body>
      <Modal.Footer>
        {isLoading ? (
          <Button type="button" className="mb-1 btn btn-primary" disabled onClick={props.handleCloseModal}>
            <span className="spinner-border spinner-border-sm"></span> Salvando configurações...
          </Button>
        ) : (
          <Button type="button" className="mb-1 btn btn-primary" onClick={() => chamarMetodoFilho()}>
            Salvar configurações
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfig;
