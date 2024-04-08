import React from 'react';
import CustomAccordionToggle from '../CustomAccordionToggle';
import { Accordion, Card, Form } from 'react-bootstrap';
import { regexNumberFloat } from '../../../../../helpers/InputHelpers';
import { parseFloatNumber, parseStringToNumberIfValidFloat } from '../../../../../helpers/MathHelpers';
import { useParametersStore } from '../hooks/ParametersStore';

export default function BoneDiameters() {

  const fist = useParametersStore((state) => state.fist);
  const femur = useParametersStore((state) => state.femur);

  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const { setFist, setFemur, updateData } = useParametersStore();

  const handleChangeFist = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);

    setFist(parseStringToNumberIfValidFloat(value));
  }

  const handleChangeFemur = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);
    setFemur(parseStringToNumberIfValidFloat(value));
  }

  const handleUpdateData = () => {
    try {
      updateData(apiAssessmentDataUrl, {
        diametroEstiloUlnar: parseFloatNumber(fist).toString(),
        diametroBicondioFemural: parseFloatNumber(femur).toString(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CustomAccordionToggle eventKey="4">Diâmetro ósseos (cm) - Opcional </CustomAccordionToggle>
      <Accordion.Collapse eventKey="4">
        <Card.Body className="pt-0">
          <Form>
            <div className="d-flex">
              <div className="flex-fill mr-2 form-floating w-30 me-1">
                <Form.Control type="text" value={fist ? fist : ''} onChange={(e) => handleChangeFist(e)} onBlur={handleUpdateData} />
                <Form.Label>Diâmetro Estilo-Ulnar</Form.Label>
              </div>
              <div className="flex-fill ml-2 form-floating w-30 me-1">
                <Form.Control type="text" value={femur ? femur : ''} onChange={(e) => handleChangeFemur(e)} onBlur={handleUpdateData} />
                <Form.Label>Diâmetro Bicôndio-Femural</Form.Label>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Accordion.Collapse>
    </>
  );
}
