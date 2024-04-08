import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Modal, Table } from 'react-bootstrap';

interface ModalBodyMassIndexTableInfoProps {
  showModal: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModal: (showModal: boolean) => void;
}

const patientAge = 30;

const DataImcAdult = () => {
  return (
    <>
      <tr>
        <th>Abaixo de 18,5</th>
        <td>Abaixo do peso</td>
      </tr>
      <tr>
        <th>18.5 – 24.9</th>
        <td>Eutrófico</td>
      </tr>
      <tr>
        <th>25.0 – 29.9</th>
        <td>Sobrepeso</td>
      </tr>
      <tr>
        <th>30.0 – 34.9</th>
        <td>Obesidade classe I</td>
      </tr>
      <tr>
        <th>35.0 – 39.9</th>
        <td>Obesidade classe II</td>
      </tr>
      <tr>
        <th>Acima de 40</th>
        <td>Obesidade classe III</td>
      </tr>
    </>
  );
};

const DataImcAged = () => {
  return (
    <>
      <tr>
        <th>Abaixo de 22</th>
        <td>Abaixo do peso</td>
      </tr>
      <tr>
        <th>22 – 27</th>
        <td>Peso adequado </td>
      </tr>
      <tr>
        <th>A cima de 27</th>
        <td>Sobrepeso</td>
      </tr>
    </>
  );
};

const ModalBodyMassIndexTableInfo = ({ showModal, setShowModal }: ModalBodyMassIndexTableInfoProps) => {
  return (
    <Modal className="modal-close-out" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Índice de massa corporal - IMC</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped style={{ textAlign: 'center' }}>
          <thead>
            <tr>
              <th scope="col">IMC</th>
              <th scope="col">Estado nutricional</th>
            </tr>
          </thead>
          <tbody>
            {patientAge < 60 ? <DataImcAdult /> : <DataImcAged />}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <div className="text-center">
          <a href="https://www.who.int/europe/news-room/fact-sheets/item/a-healthy-lifestyle---who-recommendations" target="_blank" rel="noopener noreferrer">
            <label className="my-custom-link me-1 text-center">Fonte: Organização Mundial da Saúde</label>
            <CsLineIcons icon="link" />
          </a>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalBodyMassIndexTableInfo;
