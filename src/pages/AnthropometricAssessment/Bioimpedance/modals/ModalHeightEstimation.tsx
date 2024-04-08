import { regexNumberFloat } from '/src/helpers/InputHelpers';
import { isValidNumber, parseFloatNumber, parseStringToNumberIfValidFloat } from '/src/helpers/MathHelpers';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { calculateEstimatedHeight } from '../Results/helpers/GeneralEquations';
import { useParametersStore } from '../hooks/ParametersStore';

interface ModalweightEstimationProps {
  showModal: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModal: (showModal: boolean) => void;
}

const ModalweightEstimation = ({ showModal, setShowModal }: ModalweightEstimationProps) => {
  const [kneeHeight, setKneeHeight] = useState<number | string>('');

  const { setHeight } = useParametersStore();

  const patientIsMale = useParametersStore((state) => state.patientIsMale);
  const patientAge = useParametersStore((state) => state.patientAge);

  const handleChangeKneeHeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = regexNumberFloat(event.target.value);
    setKneeHeight(parseStringToNumberIfValidFloat(value));
  };

  const handleConfirm = () => {
    setHeight(estimedHeight);
    setShowModal(false);
  }

  const estimedHeight = isValidNumber(kneeHeight) && Number(kneeHeight) ? calculateEstimatedHeight(Number(kneeHeight), patientAge, patientIsMale) : 0;

  return (
    <Modal className="modal-close-out" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Estimativa de altura</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="flex-fill ml-2 form-floating mt-1">
            <Form.Control type="text" value={kneeHeight} onChange={handleChangeKneeHeight} />
            <Form.Label>Altura do joelho direito (cm)</Form.Label>
          </div>
          {isValidNumber(kneeHeight) && Number(kneeHeight) ? (
            <label className="mt-3 text-center">
              A altura estimada do paciente é de <span>{parseFloatNumber(estimedHeight)} m</span> utilizando a fórmula de Cereda et al. (2010)
            </label>
          ) : null}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleConfirm}>Salvar e utilizar dados</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalweightEstimation;
