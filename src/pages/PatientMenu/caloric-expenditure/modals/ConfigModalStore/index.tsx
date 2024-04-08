import React, { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import FormConfigAntropometricAssessment from './FormConfigAntropometricAssessment';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';

interface FormConfigAntropometricAssessmentRef {
  handleSubmit: () => void;
}

const ModalConfig = () => {
  const formRef = useRef<FormConfigAntropometricAssessmentRef>();
  const [isLoading, setIsLoading] = useState(false);

  const showModal = useConfigModalStore((state) => state.showModalConfig);

  const { hideConfigModal } = useConfigModalStore();

  const chamarMetodoFilho = async () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
  };

  return (
    <Modal className="modal-right large" show={showModal} onHide={hideConfigModal}>
      <Modal.Header closeButton>
        <Modal.Title>Configurações da predição de gasto calórico</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormConfigAntropometricAssessment ref={formRef} setIsLoading={setIsLoading} handleCloseModal={hideConfigModal}/>
      </Modal.Body>
      <Modal.Footer>
        {isLoading ? (
          <Button type="button" className="mb-1 btn btn-primary" disabled onClick={hideConfigModal}>
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
