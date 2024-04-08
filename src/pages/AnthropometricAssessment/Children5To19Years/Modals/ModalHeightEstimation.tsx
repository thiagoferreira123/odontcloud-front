import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useParametersStore } from '../Parameters/hooks/ParametersStore';
import { regexNumberFloat } from '../../../../helpers/InputHelpers';
import { isValidNumber, parseFloatNumber, parseStringToNumberIfValidFloat } from '../../../../helpers/MathHelpers';
import { calculateEstimatedHeight } from '../Results/helpers/GeneralEquations';

interface ModalweightEstimationProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const ModalweightEstimation = ({ showModal, setShowModal }: ModalweightEstimationProps) => {
  const [kneeHeight, setKneeHeight] = useState<number | string>('');

  const { setHeight, updateData } = useParametersStore();

  const patientIsMale = useParametersStore((state) => state.patientIsMale);
  const patientAge = useParametersStore((state) => state.patientAge);
  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const estimedHeight = isValidNumber(kneeHeight) && Number(kneeHeight) ? calculateEstimatedHeight(Number(kneeHeight), patientAge, patientIsMale) : 0;

  const handleChangeKneeHeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = regexNumberFloat(event.target.value);
    setKneeHeight(parseStringToNumberIfValidFloat(value));
  };

  const handleConfirm = () => {
    setHeight(estimedHeight);
    updateData(apiAssessmentDataUrl, {
      altura: estimedHeight.toString(),
    });
    setShowModal(false);
  }

  if (!showModal) return null;

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
