import React from 'react';
import CustomAccordionToggle from '../CustomAccordionToggle';
import { Accordion, Card, Form } from 'react-bootstrap';
import BodyDensityEquationSelect from './BodyDensityEquationSelect';
import { useParametersStore } from '../hooks/ParametersStore';
import { regexNumberFloat } from '/src/helpers/InputHelpers';
import { BodyCompositionMethod, getRequiredMeasures } from '/src/pages/AnthropometricAssessment/Adult/Results/helpers/BodyDensityEquation';
import BodyFatEquationSelect from './BodyFatEquationSelect';
import { parseFloatNumber, parseStringToNumberIfValidFloat } from '/src/helpers/MathHelpers';

export default function SkinFolds() {
  const { selectedBodyDensityEquation, bicipital, tricipital, axilarMedia, suprailiaca, abdominal, subescapular, toracica, coxa, panturrilha } =
    useParametersStore((state) => ({
      selectedBodyDensityEquation: state.selectedBodyDensityEquation,
      selectedBodyFatEquation: state.selectedBodyFatEquation,

      bicipital: state.bicipital,
      tricipital: state.tricipital,
      axilarMedia: state.axilarMedia,
      suprailiaca: state.suprailiaca,
      abdominal: state.abdominal,
      subescapular: state.subescapular,
      toracica: state.toracica,
      coxa: state.coxa,
      panturrilha: state.panturrilha,
    }));

  const { patientAge, patientIsMale } = useParametersStore((state) => ({
    patientAge: state.patientAge,
    patientIsMale: state.patientIsMale,
  }));
  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const { updateData } = useParametersStore();

  const handleChange = (parameterName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);

    useParametersStore.setState({ [parameterName]: parseStringToNumberIfValidFloat(value) });
  };

  const handleUpdateData = () => {
    try {
      updateData(apiAssessmentDataUrl, {
        biceps: parseFloatNumber(bicipital).toString(),
        triceps: parseFloatNumber(tricipital).toString(),
        axilar_media: parseFloatNumber(axilarMedia).toString(),
        suprailiaca: parseFloatNumber(suprailiaca).toString(),
        subescapular: parseFloatNumber(subescapular).toString(),
        abdominal: parseFloatNumber(abdominal).toString(),
        torax: parseFloatNumber(toracica).toString(),
        coxa: parseFloatNumber(coxa).toString(),
        panturrilha_media: parseFloatNumber(panturrilha).toString(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const requiredFields = selectedBodyDensityEquation
    ? getRequiredMeasures({
        isMale: patientIsMale,
        method: selectedBodyDensityEquation.value as BodyCompositionMethod,
        age: patientAge,
      })
    : [];

  return (
    <>
      <CustomAccordionToggle eventKey="3">Dobras cutâneas (mm)</CustomAccordionToggle>
      <Accordion.Collapse eventKey="3">
        <Card.Body className="pt-0">
          <div className="row mb-3">
            <div className="col-7">
              <BodyDensityEquationSelect />
            </div>
            <div className="col-5">
              <BodyFatEquationSelect />
            </div>
          </div>
          <Form>
            <div className="d-flex">
              <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  className={requiredFields.includes('bi') ? 'border border-primary' : ''}
                  type="text"
                  value={bicipital ? bicipital : ''}
                  onChange={(e) => handleChange('bicipital', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Bicipital</Form.Label>
              </div>

              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  className={requiredFields.includes('tr') ? 'border border-primary' : ''}
                  type="text"
                  value={tricipital ? tricipital : ''}
                  onChange={(e) => handleChange('tricipital', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Tricipital </Form.Label>
              </div>

              <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  className={requiredFields.includes('ax') ? 'border border-primary' : ''}
                  type="text"
                  value={axilarMedia ? axilarMedia : ''}
                  onChange={(e) => handleChange('axilarMedia', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Axilar média</Form.Label>
              </div>
            </div>

            <div className="d-flex">
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  className={requiredFields.includes('si') ? 'border border-primary' : ''}
                  type="text"
                  value={suprailiaca ? suprailiaca : ''}
                  onChange={(e) => handleChange('suprailiaca', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Suprailíaca </Form.Label>
              </div>

              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  className={requiredFields.includes('ab') ? 'border border-primary' : ''}
                  type="text"
                  value={abdominal ? abdominal : ''}
                  onChange={(e) => handleChange('abdominal', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Abdominal </Form.Label>
              </div>

              <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  className={requiredFields.includes('se') ? 'border border-primary' : ''}
                  type="text"
                  value={subescapular ? subescapular : ''}
                  onChange={(e) => handleChange('subescapular', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Subescapular </Form.Label>
              </div>
            </div>

            <div className="d-flex">
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  className={requiredFields.includes('pt') ? 'border border-primary' : ''}
                  type="text"
                  value={toracica ? toracica : ''}
                  onChange={(e) => handleChange('toracica', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Torácica </Form.Label>
              </div>

              <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  className={requiredFields.includes('cx') ? 'border border-primary' : ''}
                  type="text"
                  value={coxa ? coxa : ''}
                  onChange={(e) => handleChange('coxa', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Coxa </Form.Label>
              </div>

              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  className={requiredFields.includes('pm') ? 'border border-primary' : ''}
                  type="text"
                  value={panturrilha ? panturrilha : ''}
                  onChange={(e) => handleChange('panturrilha', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Panturrilha</Form.Label>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Accordion.Collapse>
    </>
  );
}
