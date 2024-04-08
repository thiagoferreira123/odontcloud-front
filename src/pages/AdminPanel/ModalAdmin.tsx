import React from 'react';
import { Badge, Button, Modal, Table } from 'react-bootstrap';

interface ModalAdminProps {
  showModal: boolean;
  onHide: () => void;
}

const ModalAdmin = ({ showModal, onHide }: ModalAdminProps) => {
  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da assinatura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped responsive>
          <tbody>
            <tr>
              <th>Select para alterar status</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
            <tr>
              <th>nome completo</th>
            </tr>
            <tr>
              <th>email</th>
            </tr>
          </tbody>
        </Table>
        <div className='text-center'>
          <Button>Salvar alterações</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAdmin;
