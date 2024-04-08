import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useParametersStore } from '../Parameters/hooks/ParametersStore';
import { regexNumberFloat } from '../../../../helpers/InputHelpers';
import { isValidNumber, parseFloatNumber, parseStringToNumberIfValidFloat } from '../../../../helpers/MathHelpers';
import { calculateEstimatedWeight } from '../Results/helpers/GeneralEquations';

interface ModalHeightEstimationProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const ModalHeightEstimation = ({ showModal, setShowModal }: ModalHeightEstimationProps) => {
  const [kneeHeight, setKneeHeight] = useState<number | string>('');
  const [armCircumference, setArmCircumference] = useState<number | string>('');
  const [calfCircumference, setCalfCircumference] = useState<number | string>('');
  const [subscapularSkinfold, setSubscapularSkinfold] = useState<number | string>('');

  const patientIsMale = useParametersStore((state) => state.patientIsMale);
  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const { setWeight, updateData } = useParametersStore();

  const handleChangeCalfCircumference = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = regexNumberFloat(event.target.value);
    setCalfCircumference(parseStringToNumberIfValidFloat(value));
  };
  const handleChangeArmCircumference = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = regexNumberFloat(event.target.value);
    setArmCircumference(parseStringToNumberIfValidFloat(value));
  };
  const handleChangeKneeHeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = regexNumberFloat(event.target.value);
    setKneeHeight(parseStringToNumberIfValidFloat(value));
  };
  const handleChangeSubscapularSkinfold = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = regexNumberFloat(event.target.value);
    setSubscapularSkinfold(parseStringToNumberIfValidFloat(value));
  };

  const estimedWeigth =
    isValidNumber(kneeHeight) &&
    Number(kneeHeight) &&
    isValidNumber(armCircumference) &&
    Number(armCircumference) &&
    isValidNumber(calfCircumference) &&
    Number(calfCircumference) &&
    isValidNumber(subscapularSkinfold) &&
    Number(subscapularSkinfold)
      ? calculateEstimatedWeight(patientIsMale, Number(armCircumference), Number(calfCircumference), Number(subscapularSkinfold), Number(kneeHeight))
      : 0;

  const handleConfirm = () => {
    updateData(apiAssessmentDataUrl, {
      peso: parseFloatNumber(estimedWeigth).toString(),
    });
    setWeight(estimedWeigth);
    hideModal();
  };

  const hideModal = () => {
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <Modal className="modal-close-out" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Estimativa de peso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="flex-fill ml-2 form-floating mt-1">
            <Form.Control type="text" value={calfCircumference} onChange={handleChangeCalfCircumference} />
            <Form.Label>Circunferência da panturrilha direita (cm)</Form.Label>
          </div>
          <div className="flex-fill ml-2 form-floating mt-1">
            <Form.Control type="text" value={armCircumference} onChange={handleChangeArmCircumference} />
            <Form.Label>Circunferência do braço direito relaxado (cm)</Form.Label>
          </div>
          <div className="flex-fill ml-2 form-floating mt-1">
            <Form.Control type="text" value={kneeHeight} onChange={handleChangeKneeHeight} />
            <Form.Label>Altura do joelho direito (cm)</Form.Label>
          </div>
          <div className="flex-fill ml-2 form-floating mt-1">
            <Form.Control type="text" value={subscapularSkinfold} onChange={handleChangeSubscapularSkinfold} />
            <Form.Label>Dobra cultânea subescapular (mm)</Form.Label>
          </div>
          {isValidNumber(estimedWeigth) && estimedWeigth ? (
            <label className="mt-3 text-center">
              O peso estimada do paciente é de <span>{parseFloatNumber(estimedWeigth)} kg</span> utilizando a fórmula de Chumlea et al. (1988)
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

export default ModalHeightEstimation;
