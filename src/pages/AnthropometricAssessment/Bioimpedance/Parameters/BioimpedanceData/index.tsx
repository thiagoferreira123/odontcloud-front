import React from 'react';
import CustomAccordionToggle from '../CustomAccordionToggle';
import { Accordion, Card, Form } from 'react-bootstrap';
import { useParametersStore } from '../../hooks/ParametersStore';
import { regexNumberFloat } from '../../../../../helpers/InputHelpers';
import { parseFloatNumber, parseStringToNumberIfValidFloat } from '../../../../../helpers/MathHelpers';

export default function BioimpedanceData() {
  const {
    bmi,
    body_fat_percentage,
    fat_mass,
    lean_mass_percentage,
    lean_mass,
    bone_mass,
    residual_mass,
    muscle_mass,
    visceral_fat,
    metabolic_age,
    total_body_water,
    skeletal_muscle_mass_percentage,
    total_body_water_percentage,
    visceral_fat_percentage,
  } = useParametersStore((state) => ({
    bmi: state.bmi,
    body_fat_percentage: state.body_fat_percentage,
    fat_mass: state.fat_mass,
    lean_mass_percentage: state.lean_mass_percentage,
    lean_mass: state.lean_mass,
    bone_mass: state.bone_mass,
    residual_mass: state.residual_mass,
    muscle_mass: state.muscle_mass,
    visceral_fat: state.visceral_fat,
    metabolic_age: state.metabolic_age,
    total_body_water: state.total_body_water,
    skeletal_muscle_mass_percentage: state.skeletal_muscle_mass_percentage,
    total_body_water_percentage: state.total_body_water_percentage,
    visceral_fat_percentage: state.visceral_fat_percentage,
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
        imcBioimpedancia: parseFloatNumber(bmi).toString(),
        percMassaGordaBioimpedancia: parseFloatNumber(body_fat_percentage).toString(),
        massaGordaBioimpedancia: parseFloatNumber(fat_mass).toString(),
        percMassaMagraBioimpedancia: parseFloatNumber(lean_mass_percentage).toString(),
        massaMagraBioimpedancia: parseFloatNumber(lean_mass).toString(),
        pesoOsseoBioimpedancia: parseFloatNumber(bone_mass).toString(),
        pesoResidualBioimpedancia: parseFloatNumber(residual_mass).toString(),
        pesoMuscularBioimpedancia: parseFloatNumber(muscle_mass).toString(),
        gorduraVisceralBioimpedancia: parseFloatNumber(visceral_fat).toString(),
        idadeMetabolicaBioimpedancia: parseFloatNumber(metabolic_age).toString(),
        aguaCorporalBioimpedancia: parseFloatNumber(total_body_water).toString(),
        percMusculosEsqueleticosBioimpedancia: parseFloatNumber(skeletal_muscle_mass_percentage).toString(),
        percAguaCorporalBioimpedancia: parseFloatNumber(total_body_water_percentage).toString(),
        percGorduraVisceralBioimpedancia: parseFloatNumber(visceral_fat_percentage).toString(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CustomAccordionToggle eventKey="5">Dados da bioimpedância</CustomAccordionToggle>
      <Accordion.Collapse eventKey="5">
        <Card.Body className="pt-0">
          <Form>
            <div className="d-flex">
              <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                <Form.Control type="text" value={bmi ? bmi : ''} onChange={(e) => handleChange('bmi', e)} onBlur={handleUpdateData} />
                <Form.Label>IMC (kg/m²)</Form.Label>
              </div>
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  type="text"
                  value={body_fat_percentage ? body_fat_percentage : ''}
                  onChange={(e) => handleChange('body_fat_percentage', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Massa Gorda (%)</Form.Label>
              </div>
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control type="text" value={fat_mass ? fat_mass : ''} onChange={(e) => handleChange('fat_mass', e)} onBlur={handleUpdateData} />
                <Form.Label>Massa Gorda (kg)</Form.Label>
              </div>
            </div>
            <div className="d-flex">
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  type="text"
                  value={lean_mass_percentage ? lean_mass_percentage : ''}
                  onChange={(e) => handleChange('lean_mass_percentage', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Massa Magra (%)</Form.Label>
              </div>
              <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                <Form.Control type="text" value={lean_mass ? lean_mass : ''} onChange={(e) => handleChange('lean_mass', e)} onBlur={handleUpdateData} />
                <Form.Label>Massa Magra (kg)</Form.Label>
              </div>
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control type="text" value={bone_mass ? bone_mass : ''} onChange={(e) => handleChange('bone_mass', e)} onBlur={handleUpdateData} />
                <Form.Label>Peso Ósseo (kg)</Form.Label>
              </div>
            </div>
            <div className="d-flex">
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  type="text"
                  value={residual_mass ? residual_mass : ''}
                  onChange={(e) => handleChange('residual_mass', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Peso Residual (kg)</Form.Label>
              </div>
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control type="text" value={muscle_mass ? muscle_mass : ''} onChange={(e) => handleChange('muscle_mass', e)} onBlur={handleUpdateData} />
                <Form.Label>Peso Muscular (kg)</Form.Label>
              </div>
              <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  type="text"
                  value={total_body_water_percentage ? total_body_water_percentage : ''}
                  onChange={(e) => handleChange('total_body_water_percentage', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Água corporal (%)</Form.Label>
              </div>
            </div>
            <div className="d-flex">
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  type="text"
                  value={visceral_fat ? visceral_fat : ''}
                  onChange={(e) => handleChange('visceral_fat', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Gordura Visceral</Form.Label>
              </div>
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  type="text"
                  value={visceral_fat_percentage ? visceral_fat_percentage : ''}
                  onChange={(e) => handleChange('visceral_fat_percentage', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Gordura Visceral (%)</Form.Label>
              </div>
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  type="text"
                  value={metabolic_age ? metabolic_age : ''}
                  onChange={(e) => handleChange('metabolic_age', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Idade Metabólica</Form.Label>
              </div>
            </div>
            <div className="d-flex">
              <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  type="text"
                  value={total_body_water ? total_body_water : ''}
                  onChange={(e) => handleChange('total_body_water', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Água corporal (L)</Form.Label>
              </div>
              <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                <Form.Control
                  type="text"
                  value={skeletal_muscle_mass_percentage ? skeletal_muscle_mass_percentage : ''}
                  onChange={(e) => handleChange('skeletal_muscle_mass_percentage', e)}
                  onBlur={handleUpdateData}
                />
                <Form.Label>Músculo Esquelético (%)</Form.Label>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Accordion.Collapse>
    </>
  );
}
