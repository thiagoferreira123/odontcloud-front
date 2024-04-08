import React from 'react';
import { Accordion, Card, Form } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { useParametersStore } from '../hooks';
import CustomAccordionToggle from '../CustomAccordionToggle';
import Datepicker from './Datepicker';
import { regexNumberFloat } from '../../../../../helpers/InputHelpers';
import { parseFloatNumber, parseStringToNumberIfValidFloat } from '../../../../../helpers/MathHelpers';

export default function WeigthAndHeigth() {
  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const weightPreGestational = useParametersStore((state) => state.weightPreGestational);
  const weight = useParametersStore((state) => state.weight);
  const height = useParametersStore((state) => state.height);
  const twinPregnancy = useParametersStore((state) => state.twinPregnancy);

  const { setWeight, setHeight, setWeightPreGestational, setTwinPregnancy, updateData } = useParametersStore();

  const handleChangeWeigthPreGestational = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);
    setWeightPreGestational(parseStringToNumberIfValidFloat(value));
  }

  const handleChangeWeigth = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);

    setWeight(parseStringToNumberIfValidFloat(value));
  };

  const handleChangeHeight = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);
    setHeight(parseStringToNumberIfValidFloat(value));
  };

  const handleCjangeTwinPregnancy =(event: React.ChangeEvent<HTMLInputElement>) => {
    setTwinPregnancy(event.target.checked);
  }

  const handleUpdateData = () => {
    try {
      updateData(apiAssessmentDataUrl, {
        pesoPreGestacional: parseFloatNumber(weightPreGestational).toString(),
        peso: parseFloatNumber(weight).toString(),
        altura: height.toString(),
        gestacaoGemelar: twinPregnancy ? 1 : 0,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CustomAccordionToggle eventKey="1">Dados da gestante</CustomAccordionToggle>
      <Accordion.Collapse eventKey="1">
        <Card.Body className="pt-0">
          <Form>
            <div className="d-flex justify-content-between">
              <div className="me-2 mb-3 w-70 ">
                <div className="top-label">
                  <Datepicker />
                  <span>DATA DO 1̣° DIA DO ÚLTIMO CICLO MENSTRUAL</span>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <div className="form-floating w-70 me-2">
                <Form.Control type="text" value={weightPreGestational ? weightPreGestational : ''} onChange={(e) => handleChangeWeigthPreGestational(e)} onBlur={handleUpdateData} />
                <Form.Label>Peso pré-gestacional (kg)</Form.Label>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="form-floating w-70 me-2">
                <Form.Control type="text" value={weight ? weight : ''} onChange={(e) => handleChangeWeigth(e)} onBlur={handleUpdateData} />
                <Form.Label>Peso atual (kg)</Form.Label>
              </div>
              <div className="form-floating w-30">
                <Form.Control type="text" value={height ? height : ''} onChange={(e) => handleChangeHeight(e)} onBlur={handleUpdateData} />
                <Form.Label>Altura (m)</Form.Label>
              </div>
            </div>
            <div className="mt-3">
              <Form.Check checked={twinPregnancy} onChange={handleCjangeTwinPregnancy} onBlur={handleUpdateData} type="switch" id="customSwitch" label="Gestação gemelar" />
            </div>
          </Form>
        </Card.Body>
      </Accordion.Collapse>
    </>
  );
}
