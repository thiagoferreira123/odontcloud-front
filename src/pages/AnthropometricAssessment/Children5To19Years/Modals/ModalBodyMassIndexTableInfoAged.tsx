import { Modal, Table } from 'react-bootstrap';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

const DataImcAdult = () => {
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

interface ModalBodyMassIndexTableInfoAgedProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const ModalBodyMassIndexTableInfoAged = ({ showModal, setShowModal }: ModalBodyMassIndexTableInfoAgedProps) => {
  return (
    <Modal className="modal-close-out" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Índice de massa corporal para Idosos- IMC</Modal.Title>
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
            <DataImcAdult />
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <div className="text-center">
          <a
            href="http://tabnet.datasus.gov.br/cgi-win/SISVAN/CNV/notas_sisvan.html#:~:text=Valores%20de%20IMC%20menor%20ou,%2C0%3A%20idoso%20com%20sobrepeso."
            target="_blank"
            rel="noopener noreferrer"
          >
            <label className="my-custom-link me-1 text-center">Fonte: Ministério da Saúde</label>
            <CsLineIcons icon="link" />
          </a>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalBodyMassIndexTableInfoAged;
