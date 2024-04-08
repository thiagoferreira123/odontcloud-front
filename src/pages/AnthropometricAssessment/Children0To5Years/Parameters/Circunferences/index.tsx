import React from 'react';
import { Accordion, Card, Form } from 'react-bootstrap';
import { regexNumberFloat } from '/src/helpers/InputHelpers';
import { parseFloatNumber, parseStringToNumberIfValidFloat } from '/src/helpers/MathHelpers';
import { useParametersStore } from '../hooks';
import { Child0to5AntropometricData } from '/src/types/AntropometricAssessment';
import { CustomAccordionToggle } from '../CustomAccordionToggle';

export default function Circunferences() {
  const {
    neck,
    shoulder,
    chest,
    abdomen,
    waist,
    hip,
    right_relaxed_arm,
    right_contracted_arm,
    forearm_right,
    right_fist,
    left_relaxed_arm,
    left_contracted_arm,
    forearm_left,
    left_fist,

    right_proximal_thigh,
    right_medial_thigh,
    right_distal_thigh,

    left_proximal_thigh,
    left_medial_thigh,
    left_distal_thigh,

    right_calf,
    left_calf,
  } = useParametersStore((state) => ({
    neck: state.neck,
    shoulder: state.shoulder,
    chest: state.chest,
    abdomen: state.abdomen,
    waist: state.waist,
    hip: state.hip,

    right_relaxed_arm: state.right_relaxed_arm,
    right_contracted_arm: state.right_contracted_arm,
    forearm_right: state.forearm_right,
    right_fist: state.right_fist,

    left_relaxed_arm: state.left_relaxed_arm,
    left_contracted_arm: state.left_contracted_arm,
    forearm_left: state.forearm_left,
    left_fist: state.left_fist,

    right_proximal_thigh: state.right_proximal_thigh,
    right_medial_thigh: state.right_medial_thigh,
    right_distal_thigh: state.right_distal_thigh,
    right_calf: state.right_calf,

    left_proximal_thigh: state.left_proximal_thigh,
    left_medial_thigh: state.left_medial_thigh,
    left_distal_thigh: state.left_distal_thigh,
    left_calf: state.left_calf,
  }));

  const apiAssessmentDataUrl = useParametersStore((state) => state.apiAssessmentDataUrl);

  const { updateData } = useParametersStore();

  const handleChange = (parameterName: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);

    useParametersStore.setState({ [parameterName]: parseStringToNumberIfValidFloat(value) });
  };

  const handleUpdateData = () => {
    try {

      const payload: Partial<Child0to5AntropometricData> = {
        pescoco: neck.toString(),
        ombro: shoulder.toString(),
        peitoral: chest.toString(),
        abdomen: parseFloatNumber(abdomen).toString(),
        cintura: waist.toString(),
        quadril: hip.toString(),

        punhoEsquerdo: left_fist.toString(),
        punhoDireito: right_fist.toString(),

        bracoRelaxadoDireito: right_relaxed_arm.toString(),
        bracoRelaxadoEsquerdo: left_relaxed_arm.toString(),
        bracoContraidoDireito: right_contracted_arm.toString(),
        bracoContraidoEsquerdo: left_contracted_arm.toString(),

        antebracoEsquerdo: forearm_left.toString(),
        antebracoDireito: forearm_right.toString(),

        coxaProximalDireita: right_proximal_thigh.toString(),
        coxaProximalEsquerda: left_proximal_thigh.toString(),
        coxaMedialDireita: right_medial_thigh.toString(),
        coxaMedialEsquerda: left_medial_thigh.toString(),
        coxaDistalDireita: right_distal_thigh.toString(),
        coxaDistalEsquerda: left_distal_thigh.toString(),

        panturrilhaDireita: right_calf.toString(),
        panturrilhaEsquerda: left_calf.toString(),
      }

      updateData(apiAssessmentDataUrl, payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CustomAccordionToggle eventKey="2">Circunferências (cm)</CustomAccordionToggle>
      <Accordion.Collapse eventKey="2">
        <Card.Body className="pt-0">
          <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="1">
              <Accordion.Header as="div">Circunferências do tronco</Accordion.Header>
              <Accordion.Body>
                <div className="d-flex">
                  <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={neck ? neck : ''} onChange={(e) => handleChange('neck', e)} onBlur={handleUpdateData} />
                    <Form.Label>Pescoço</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={shoulder ? shoulder : ''} onChange={(e) => handleChange('shoulder', e)} onBlur={handleUpdateData} />
                    <Form.Label>Ombros</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={chest ? chest : ''} onChange={(e) => handleChange('chest', e)} onBlur={handleUpdateData} />
                    <Form.Label>Peitoral</Form.Label>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={abdomen ? abdomen : ''} onChange={(e) => handleChange('abdomen', e)} onBlur={handleUpdateData} />
                    <Form.Label>Abdomen</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={waist ? waist : ''} onChange={(e) => handleChange('waist', e)} onBlur={handleUpdateData} />
                    <Form.Label>Cintura</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={hip ? hip : ''} onChange={(e) => handleChange('hip', e)} onBlur={handleUpdateData} />
                    <Form.Label>Quadril</Form.Label>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header as="div">Circunferências dos membros superiores</Accordion.Header>
              <Accordion.Body>
                <p className="card-title fw-bold mt-2">Lado direito</p>
                <div className="d-flex">
                  <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={right_relaxed_arm ? right_relaxed_arm : ''}
                      onChange={(e) => handleChange('right_relaxed_arm', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Biceps relax.</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={right_contracted_arm ? right_contracted_arm : ''}
                      onChange={(e) => handleChange('right_contracted_arm', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Biceps cont.</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={forearm_right ? forearm_right : ''}
                      onChange={(e) => handleChange('forearm_right', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Antebraço</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={right_fist ? right_fist : ''} onChange={(e) => handleChange('right_fist', e)} onBlur={handleUpdateData} />
                    <Form.Label>Punho</Form.Label>
                  </div>
                </div>

                <p className="card-title fw-bold mt-2">Lado esquerdo</p>
                <div className="d-flex">
                  <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={left_relaxed_arm ? left_relaxed_arm : ''}
                      onChange={(e) => handleChange('left_relaxed_arm', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Biceps relax.</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={left_contracted_arm ? left_contracted_arm : ''}
                      onChange={(e) => handleChange('left_contracted_arm', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Biceps cont.</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={forearm_left ? forearm_left : ''}
                      onChange={(e) => handleChange('forearm_left', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Antebraço</Form.Label>
                  </div>

                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={left_fist ? left_fist : ''} onChange={(e) => handleChange('left_fist', e)} onBlur={handleUpdateData} />
                    <Form.Label>Punho</Form.Label>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header as="div">Circunferências dos membros inferiores</Accordion.Header>
              <Accordion.Body>
                <p className="card-title fw-bold mt-2">Lado direito</p>
                <div className="d-flex">
                  <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={right_proximal_thigh ? right_proximal_thigh : ''}
                      onChange={(e) => handleChange('right_proximal_thigh', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Coxa prox.</Form.Label>
                  </div>
                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={right_medial_thigh ? right_medial_thigh : ''}
                      onChange={(e) => handleChange('right_medial_thigh', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Coxa medial</Form.Label>
                  </div>
                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={right_distal_thigh ? right_distal_thigh : ''}
                      onChange={(e) => handleChange('right_distal_thigh', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Coxa distal</Form.Label>
                  </div>
                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={right_calf ? right_calf : ''} onChange={(e) => handleChange('right_calf', e)} onBlur={handleUpdateData} />
                    <Form.Label>Panturrilha</Form.Label>
                  </div>
                </div>

                <p className="card-title fw-bold mt-2">Lado esquerdo</p>
                <div className="d-flex">
                  <div className="flex-fill mr-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={left_proximal_thigh ? left_proximal_thigh : ''}
                      onChange={(e) => handleChange('left_proximal_thigh', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Coxa prox.</Form.Label>
                  </div>
                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={left_medial_thigh ? left_medial_thigh : ''}
                      onChange={(e) => handleChange('left_medial_thigh', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Coxa medial</Form.Label>
                  </div>
                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control
                      type="text"
                      value={left_distal_thigh ? left_distal_thigh : ''}
                      onChange={(e) => handleChange('left_distal_thigh', e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Coxa distal</Form.Label>
                  </div>
                  <div className="flex-fill ml-2 form-floating w-30 me-1 mt-1">
                    <Form.Control type="text" value={left_calf ? left_calf : ''} onChange={(e) => handleChange('left_calf', e)} onBlur={handleUpdateData} />
                    <Form.Label>Panturrilha</Form.Label>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Accordion.Collapse>
    </>
  );
}
