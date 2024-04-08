import React from 'react';
import { Accordion, Button, Card, Dropdown, Form } from 'react-bootstrap';
import CustomAccordionToggle from '../CustomAccordionToggle';
import SelectEquation from './SelectEquation';
import SelectActivityFactor from './SelectActivityFactor';
import SelectGestationTrimester from './SelectGestationTrimester';
import SelectPhysicalActivityFactor from './SelectPhysicalActivityFactor';
import SelectMet from './SelectMet';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useCaloricExpenditureStore } from '../hooks';
import { regexNumberFloat } from '../../../helpers/InputHelpers';
import { isValidNumber, parseStringToNumberIfValidFloat } from '../../../helpers/MathHelpers';
import { getNeededFields } from '../helpers/MathHelpers';
import { getEquationFilterFields } from '../helpers/FieldHelper';
import { FemphysicalActivityLevel, MalephysicalActivityLevel, acivictyFactors, equations } from '../helpers/constants';
import { Met } from '../hooks/types';
import { notify } from '../../../components/toast/NotificationIcon';
import WeigthSelect from './WeigthSelect';
import HeightSelect from './HeightSelect';

export default function Parameters() {
  const id = useCaloricExpenditureStore((state) => state.id);
  const parameterId = useCaloricExpenditureStore((state) => state.parameterId);
  const patientIsMale = useCaloricExpenditureStore((state) => state.patientIsMale);

  const mets = useCaloricExpenditureStore((state) => state.mets);

  const weight = useCaloricExpenditureStore((state) => state.weight);
  const height = useCaloricExpenditureStore((state) => state.height);
  const muscularWeight = useCaloricExpenditureStore((state) => state.muscularWeight);
  const gestationWeek = useCaloricExpenditureStore((state) => state.gestationWeek);
  const lactationMonth = useCaloricExpenditureStore((state) => state.lactationMonth);

  const selectedEquationFilter = useCaloricExpenditureStore((state) => state.selectedEquationFilter);

  const selectedEquation = useCaloricExpenditureStore((state) => state.selectedEquation);

  const {
    setWeight,
    setHeight,
    setMuscularWeight,
    setGestationWeek,
    setSelectedEquationFilter,
    setLactationMonth,
    addMet,
    updateMet,
    removeMet,
    persistParameters,
  } = useCaloricExpenditureStore();

  const handleChangeWeigth = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);

    setWeight(parseStringToNumberIfValidFloat(value));
  };

  const handleChangeHeight = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);
    setHeight(parseStringToNumberIfValidFloat(value));
  };

  const handleChangeMuscularWeight = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);
    setMuscularWeight(parseStringToNumberIfValidFloat(value));
  };

  const handleChangeGestationWeek = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);
    setGestationWeek(parseStringToNumberIfValidFloat(value));
  };

  const handleChangeLactationMonth = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = regexNumberFloat(event.target.value);
    setLactationMonth(parseStringToNumberIfValidFloat(value));
  };

  const handleAddMet = () => {
    addMet({
      id: btoa(Math.random().toString()),
      id_gasto_calorico: id,
      id_met: 0,
      met: 0,
      duracao: 0,
      nome: '',
    });
  };

  const handleChangeMet = async (value: string, met: Met) => {
    try {
      value = regexNumberFloat(value);
      const kcal = isValidNumber(weight) ? Math.round(((met.met * Number(weight)) / 60) * Number(value)) : 0;
      const response = await updateMet({ ...met, duracao: parseStringToNumberIfValidFloat(value), kcal });
      if (response === false) notify('Erro ao atualizar MET', 'Erro', 'close', 'danger');
    } catch (error) {
      console.error(error);
      notify('Erro ao atualizar MET', 'Erro', 'close', 'danger');
    }
  };

  const handleRemoveMet = async (met: Met) => {
    try {
      const response = await removeMet({ ...met, duracao: 0, kcal: 0 });
      if (response === false) notify('Erro ao remover MET', 'Erro', 'close', 'danger');
    } catch (error) {
      console.error(error);
      notify('Erro ao remover MET', 'Erro', 'close', 'danger');
    }
  };

  const handleUpdateData = () => {
    persistParameters(
      {
        altura: Number(height),
        peso: Number(weight),

        massa_magra: Number(muscularWeight),

        mes_de_lactacao: Number(lactationMonth),
        semana_gestacional: Number(gestationWeek),
      },
      parameterId
    );
  };

  const fields = selectedEquation ? getNeededFields(selectedEquation) : [];
  const equationFilterFields = getEquationFilterFields(selectedEquationFilter);

  const filteredEquations = equations.filter((equation) => !selectedEquationFilter || equationFilterFields.includes(equation.value));
  return (
    <>
      <section className="scroll-section" id="accordionCards">
        <Accordion className="mb-n2" defaultActiveKey="1">
          <Card className="d-flex flex-grow-1">
            <CustomAccordionToggle eventKey="1">Escolha da equação</CustomAccordionToggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body className="pt-0 row">
                <Dropdown className="me-3 d-inline-block">
                  <Dropdown.Toggle className="mb-2" as="a" href="#">
                    Filtre por categoria de equação
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSelectedEquationFilter('atletas')} href="#/action-1">
                      Atletas
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedEquationFilter('lactantes')} href="#/action-2">
                      Lactantes
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedEquationFilter('gestantes')} href="#/action-3">
                      Gestantes
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedEquationFilter('publico_em_geral')} href="#/action-4">
                      Público em geral
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedEquationFilter('Sobrepeso_e_obesidade')} href="#/action-5">
                      Sobrepeso e obesidade
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <div className="d-flex">
                  <div className="top-label mt-3 w-100">
                    <SelectEquation options={filteredEquations} />
                    <span>SELECIONE UMA EQUAÇÃO</span>
                  </div>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </section>

      <section className="scroll-section mt-3" id="accordionCards">
        <Accordion className="mb-n2" defaultActiveKey="1">
          <Card className="d-flex mb-2 flex-grow-1">
            <CustomAccordionToggle eventKey="1">Dados que a equação solicita</CustomAccordionToggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body className="pt-0">
                <div className="d-flex justify-content-between mb-3">
                  <div className="form-floating w-50 pe-2 ">
                    <WeigthSelect />
                    <Form.Label className='pt-1 text-muted'>Peso (kg)</Form.Label>
                  </div>

                  <div className={`form-floating w-50 pe-2 ${fields.includes('muscularWeight') ? '' : 'd-none'}`}>
                    <Form.Control
                      type="text"
                      value={muscularWeight ? muscularWeight : ''}
                      onChange={(e) => handleChangeMuscularWeight(e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Peso muscular (kg)</Form.Label>
                  </div>

                  <div className={`form-floating w-50 pe-2 ${fields.includes('height') ? '' : 'd-none'}`}>
                    <HeightSelect />
                    <Form.Label className='pt-1 text-muted'>Altura (cm)</Form.Label>
                  </div>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <div className={`form-floating w-50 pe-2 ${fields.includes('Fator injúria') ? '' : 'd-none'}`}>
                    <Form.Control type="text" value={weight ? weight : ''} onChange={(e) => handleChangeWeigth(e)} onBlur={handleUpdateData} />
                    <Form.Label>Fator injúria (FI)</Form.Label>
                  </div>
                  <div className={`form-floating w-50 pe-2 ${fields.includes('Fator térmico') ? '' : 'd-none'}`}>
                    <Form.Control type="text" value={weight ? weight : ''} onChange={(e) => handleChangeWeigth(e)} onBlur={handleUpdateData} />
                    <Form.Label>Fator térmico (FT)</Form.Label>
                  </div>
                  <div className={`form-floating w-50 pe-2 ${fields.includes('SliderTooltipHorizontal') ? '' : 'd-none'}`}>
                    {/* <SliderTooltipHorizontal /> */}
                  </div>
                </div>
                <div className="d-flex ">
                  <div className={`top-label w-50 pe-2 ${fields.includes('SelectActivityFactor') ? '' : 'd-none'}`}>
                    <SelectActivityFactor options={acivictyFactors} />
                    <span>SELECIONE UM FATOR ATIVIDADE</span>
                  </div>
                  <div className={`top-label w-50 pe-2 ${fields.includes('selectedPhysicalActivityFactor') ? '' : 'd-none'}`}>
                    <SelectPhysicalActivityFactor options={patientIsMale ? MalephysicalActivityLevel : FemphysicalActivityLevel} />
                    <span>FATOR ATIVIDADE (FA)</span>
                  </div>
                  <div className={`top-label w-50 pe-2 ${fields.includes('trimester') ? '' : 'd-none'}`}>
                    <SelectGestationTrimester />
                    <span>TRIMESTRE GESTACIONAL</span>
                  </div>
                  <div className={`top-label w-50 pe-2 ${fields.includes('lactationMonth') ? '' : 'd-none'}`}>
                    <Form.Control
                      type="text"
                      value={lactationMonth ? lactationMonth : ''}
                      onChange={(e) => handleChangeLactationMonth(e)}
                      onBlur={handleUpdateData}
                    />
                    <span>Mês de lactação</span>
                  </div>
                  <div className={`form-floating w-50 pe-2 ${fields.includes('gestation') ? '' : 'd-none'}`}>
                    <Form.Control
                      type="text"
                      value={gestationWeek ? gestationWeek : ''}
                      onChange={(e) => handleChangeGestationWeek(e)}
                      onBlur={handleUpdateData}
                    />
                    <Form.Label>Semana gestacional</Form.Label>
                  </div>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </section>

      <section className="scroll-section mt-3" id="accordionCards">
        <Accordion className="mb-n2" defaultActiveKey="1">
          <Card className="d-flex mb-2 flex-grow-1">
            <CustomAccordionToggle eventKey="1">Equivalente Metabólico da Tarefa (MET)</CustomAccordionToggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body className="pt-0">
                {mets.map((met) => (
                  <div className="d-flex mb-1" key={met.id}>
                    <div className="top-label w-90 me-1">
                      <SelectMet met={met} />
                      <span>SELECIONE UM MET</span>
                    </div>
                    <div className="form-floating me-2">
                      <Form.Control
                        type="text"
                        value={met.duracao ? met.duracao : ''}
                        onChange={(e) => handleChangeMet(e.target.value, met)}
                        onBlur={handleUpdateData}
                      />
                      <Form.Label>Duração (min)</Form.Label>
                    </div>
                    <div className="form-floating me-2">
                      <Form.Control type="text" value={met.kcal ? met.kcal : ''} readOnly />
                      <Form.Label>Kcal</Form.Label>
                    </div>
                    <div className="">
                      <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only mb-1 mt-3" onClick={() => handleRemoveMet(met)}>
                        <CsLineIcons icon="bin" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div>
                  <Button variant="outline-primary" className="btn-icon btn-icon-only mb-1 mt-2" onClick={handleAddMet}>
                    <CsLineIcons icon="plus" />
                  </Button>
                </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </section>
    </>
  );
}
