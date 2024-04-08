import React, { useState } from 'react';
import CustomAccordionToggle from '../CustomAccordionToggle';
import { Accordion, Card, Form } from 'react-bootstrap';
import { useParametersStore } from '../../hooks/ParametersStore';
import ModalHeightEstimation from '../../modals/ModalWeightEstimation';
import ModalweightEstimation from '../../modals/ModalHeightEstimation';
import { regexNumberFloat } from '../../../../../helpers/InputHelpers';
import { parseFloatNumber, parseStringToNumberIfValidFloat } from '../../../../../helpers/MathHelpers';

export default function WeigthAndHeigth() {
  const [showModalHeightEstimation, setShowModalHeightEstimation] = useState(false);
  const [showModalWeightEstimation, setShowModalWeightEstimation] = useState(false);

  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const weight = useParametersStore((state) => state.weight);
  const height = useParametersStore((state) => state.height);

  const { setWeight, setHeight, updateData } = useParametersStore();

  const handleChangeWeigth = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);

    setWeight(parseStringToNumberIfValidFloat(value));
  };

  const handleChangeHeight = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);
    setHeight(parseStringToNumberIfValidFloat(value));
  };

  const handleUpdateData = () => {
    try {
      updateData(apiAssessmentDataUrl, {
        pesoBioimpedancia: parseFloatNumber(weight).toString(),
        alturaBioimpedancia: height.toString(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CustomAccordionToggle eventKey="1">Peso e altura</CustomAccordionToggle>
      <Accordion.Collapse eventKey="1">
        <Card.Body className="pt-0">
          <Form>
            <div className="d-flex justify-content-between">
              <div className="form-floating w-50 me-2">
                <Form.Control
                  type="text"
                  value={weight ? weight : ''}
                  onChange={(e) => handleChangeWeigth(e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Peso (kg)</Form.Label>
              </div>
              <div className="form-floating w-50 ms-2">
                <Form.Control
                  type="text"
                  value={height ? height : ''}
                  onChange={(e) => handleChangeHeight(e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Altura (em centímetros)</Form.Label>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Accordion.Collapse>

      <ModalHeightEstimation showModal={showModalHeightEstimation} setShowModal={setShowModalHeightEstimation} />
      <ModalweightEstimation showModal={showModalWeightEstimation} setShowModal={setShowModalWeightEstimation} />
    </>
  );
}
