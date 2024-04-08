import React, { useState } from 'react';
import CustomAccordionToggle from '../CustomAccordionToggle';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { useParametersStore } from '../hooks/ParametersStore';
import { regexNumberFloat } from '../../../../../helpers/InputHelpers';
import { parseFloatNumber, parseStringToNumberIfValidFloat } from '../../../../../helpers/MathHelpers';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import ModalHeightEstimation from '../../Modals/ModalWeightEstimation';
import ModalweightEstimation from '../../Modals/ModalHeightEstimation';

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
        peso: parseFloatNumber(weight).toString(),
        altura: height.toString(),
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
                <Form.Label>Altura (m)</Form.Label>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="w-40 me-2">
                <Button variant="outline-tertiary" size="sm" className="btn-icon btn-icon-start mt-1 w-100" onClick={() => setShowModalHeightEstimation(true)}>
                  <CsLineIcons icon="disabled" /> <span>Estimar peso</span>
                </Button>
              </div>
              <div className="w-40 ms-2">
                <Button variant="outline-tertiary" size="sm" className="btn-icon btn-icon-start mt-1 w-100" onClick={() => setShowModalWeightEstimation(true)}>
                  <CsLineIcons icon="disabled" /> <span>Estimar altura</span>
                </Button>
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
