import React from 'react';
import { Accordion, Card, Form } from 'react-bootstrap';
import { useParametersStore } from '../hooks';
import { CustomAccordionToggle } from '../CustomAccordionToggle';
import { regexNumberFloat } from '../../../../../helpers/InputHelpers';
import { parseFloatNumber, parseStringToNumberIfValidFloat } from '../../../../../helpers/MathHelpers';

export default function WeigthAndHeigth() {
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
                <Form.Label>Altura (cm)</Form.Label>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Accordion.Collapse>
    </>
  );
}
