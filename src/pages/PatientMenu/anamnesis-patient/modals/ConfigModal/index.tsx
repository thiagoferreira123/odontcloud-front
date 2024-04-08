import React, { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import FormConfigAntropometricAnamnesis from './FormConfigAntropometricAnamnesis';
import { useConfigModalStore } from '../../hooks/ConfigModalStore';

interface FormConfigAntropometricAnamnesisRef {
  handleSubmit: () => void;
}

const ConfigModal = () => {
  const formRef = useRef<FormConfigAntropometricAnamnesisRef>();
  const [isLoading, setIsLoading] = useState(false);

  const showModal = useConfigModalStore((state) => state.showModal);

  const { hideConfigModal } = useConfigModalStore();

  const callChildFormComponentSubmitMethod = async () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
  };

  return (
    <Modal className="modal-right large" show={showModal} onHide={hideConfigModal}>
      <Modal.Header closeButton>
        <Modal.Title>Configurações da anamnese</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormConfigAntropometricAnamnesis ref={formRef} setIsLoading={setIsLoading} handleCloseModal={hideConfigModal}/>
      </Modal.Body>
      <Modal.Footer>
        {isLoading ? (
          <Button type="button" className="mb-1 btn btn-primary" disabled onClick={hideConfigModal}>
            <span className="spinner-border spinner-border-sm"></span> Salvando configurações...
          </Button>
        ) : (
          <Button type="button" className="mb-1 btn btn-primary" onClick={() => callChildFormComponentSubmitMethod()}>
            Salvar configurações
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ConfigModal;
