import { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ConfigFormModalForm from './ConfigFormModalForm';
import { useConfigFormModalStore } from '../../hooks/ConfigFormModalStore';

interface ConfigFormModalFormRef {
  handleSubmit: () => void;
}

const ConfigFormModal = () => {
  const formRef = useRef<ConfigFormModalFormRef>();
  const [isLoading, setIsLoading] = useState(false);
  const showModal = useConfigFormModalStore((state) => state.showModal);

  const { hideModal } = useConfigFormModalStore();

  const chamarMetodoFilho = async () => {
    if (!formRef.current) return;

    formRef.current.handleSubmit();
  };

  return (
    <Modal className="modal-right large" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Configurações do formulário</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ConfigFormModalForm ref={formRef} setIsLoading={setIsLoading} hideModal={hideModal}/>
      </Modal.Body>
      <Modal.Footer>
        {isLoading ? (
          <Button type="button" className="mb-1 btn btn-primary" disabled onClick={hideModal}>
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

export default ConfigFormModal;
