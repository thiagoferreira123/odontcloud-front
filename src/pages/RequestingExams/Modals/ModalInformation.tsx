import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Alert, Modal, Row, Table } from 'react-bootstrap';
import { useModalInformationStore } from '../hooks/ModalInformationStore';
import { useRequestingExamStore } from '../hooks/RequestingExamStore';

const ModalInformation = () => {

  const showModal = useModalInformationStore((state) => state.showModal);
  const selectedExam = useModalInformationStore((state) => state.selectedExam);
  const patient = useRequestingExamStore((state) => state.patient);

  const { hideModal } = useModalInformationStore();

  const minRangeField = patient?.gender ? 'minRangeMale' : 'minRangeFemale';
  const maxRangeField = patient?.gender ? 'maxRangeMale' : 'maxRangeFemale';

  return (
    <Modal className="modal-close-out" size="lg" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes do exame</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped>
          <thead>
            <tr>
              <th scope="col" className="text-center">Abaixo da normalidade</th>
              <th scope="col" className="text-center">Dentro da normalidade</th>
              <th scope="col" className="text-center">Acima da normalidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">{selectedExam?.[minRangeField]} {selectedExam?.examMeasurementUnit}</td>
              <td className="text-center">{selectedExam?.[minRangeField]} e {selectedExam?.[maxRangeField]} {selectedExam?.examMeasurementUnit}</td>
              <td className="text-center">{selectedExam?.[maxRangeField]} {selectedExam?.examMeasurementUnit}</td>
            </tr>
          </tbody>
        </Table>

        <Row>
            <label className='text-center mb-2'>Situações/morbidades que determinam aumento/positividade:</label>
          <Alert variant="light">
            <p>
              {selectedExam?.situationsIndicatingIncreaseOrPositivity}
            </p>
          </Alert>
        </Row>
        <Row>
            <label className='text-center mb-2'>Situações/morbidades que determinam diminuição/negatividade:</label>
          <Alert variant="light">
            <p>
              {selectedExam?.situationsIndicatingDecreaseOrNegativity}
            </p>
          </Alert>
        </Row>
        <Row className='text-center'>
          <p>
            <CsLineIcons icon="book" className='me-2' />
            {selectedExam?.bloodDescription}
          </p>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ModalInformation;
