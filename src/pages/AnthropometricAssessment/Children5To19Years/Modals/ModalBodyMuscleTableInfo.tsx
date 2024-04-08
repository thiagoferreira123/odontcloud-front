import { Modal, Table } from 'react-bootstrap';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

interface ModalBodyMuscleTableInfoProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const ModalBodyMuscleTableInfo = ({ showModal, setShowModal }: ModalBodyMuscleTableInfoProps) => {
  return (
    <Modal className="modal-close-out" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Médias percentuais de massa muscular para homens e mulheres</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped style={{ textAlign: 'center' }}>
          <thead>
            <tr>
              <th scope="col">Idade</th>
              <th scope="col">Homens</th>
              <th scope="col">Mulheres</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>19 - 35 anos</th>
              <td>40% - 44%</td>
              <td>31% - 33%</td>
            </tr>
            <tr>
              <th>36 - 55 anos</th>
              <td>36% - 40%</td>
              <td>29% - 31%</td>
            </tr>
            <tr>
              <th>56 anos +</th>
              <td>32% - 35%</td>
              <td>27% - 30%</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <div className="text-center">
          <a href="https://journals.physiology.org/doi/full/10.1152/jappl.2000.89.1.81" target="_blank" rel="noopener noreferrer">
            <label className="my-custom-link me-1 text-center">Fonte: Journal of Applied Physiology</label>
            <CsLineIcons icon="link" />
          </a>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalBodyMuscleTableInfo;
