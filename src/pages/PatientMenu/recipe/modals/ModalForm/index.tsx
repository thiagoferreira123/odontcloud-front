import React, { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Form from './Form';
import { useModalStore } from '../../hooks/ModalStore';

interface FormRef {
  handleSubmit: () => void;
}

const ConfigurationModal = () => {
  const formRef = useRef<FormRef>();
  const [isLoading, setIsLoading] = useState(false);

  const showConfigurationModalRecipe = useModalStore((state) => state.showConfigurationModalRecipe);

  const { hideConfigurationModalRecipe } = useModalStore();

  const chamarMetodoFilho = async () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
  };

  return (
    <Modal className="modal-right large" show={showConfigurationModalRecipe} onHide={hideConfigurationModalRecipe}>
      <Modal.Header closeButton>
        <Modal.Title>Identificação da prescrição</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form ref={formRef} setIsLoading={setIsLoading} handleCloseModal={hideConfigurationModalRecipe} />
      </Modal.Body>
      <Modal.Footer>
        {isLoading ? (
          <Button type="button" className="mb-1 btn btn-primary" disabled onClick={hideConfigurationModalRecipe}>
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

export default ConfigurationModal;
