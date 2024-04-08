import { Modal, Table } from 'react-bootstrap';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

interface ModalweightEstimationProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const ModalBodyFatTableInfo = ({ showModal, setShowModal }: ModalweightEstimationProps) => {
  return (
    <Modal className="modal-close-out" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Percentuais de gordura corporal saudável para homens e mulheres</Modal.Title>
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
              <th>19 - 39 anos</th>
              <td>8% - 19%</td>
              <td>21% - 32%</td>
            </tr>
            <tr>
              <th>40 - 59 anos</th>
              <td>11% - 21%</td>
              <td>23% - 33%</td>
            </tr>
            <tr>
              <th>60 - 79 anos</th>
              <td>13% - 24%</td>
              <td>24% - 35%</td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <div className="text-center">
          <a href="https://pubmed.ncbi.nlm.nih.gov/10966886/" target="_blank" rel="noopener noreferrer">
            <label className="my-custom-link me-1 text-center">Fonte: American Journal of Clinical Nutrition</label>
            <CsLineIcons icon="link" />
          </a>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalBodyFatTableInfo;
