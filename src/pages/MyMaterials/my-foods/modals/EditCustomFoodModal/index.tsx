import React, { useState } from 'react';
import { Button, Col, Collapse, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useEditCustomFoodModalStore } from '../../hooks/EditCustomFoodModalStore';
import SelectEatingGroup from './SelectEatingGroup';
import { Food, NutrientInput } from '../../../../../types/foods';
import useFoods from '../../../../../hooks/useFoods';
import { regexNumberRoundedFloat } from '../../../../../helpers/InputHelpers';
import api from '../../../../../services/useAxios';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import { notify } from '../../../../../components/toast/NotificationIcon';
import { parsedmicroNutrients } from '../../../../../helpers/MicronutrientConstants';
import AsyncButton from '../../../../../components/AsyncButton';
import { parseFloatNumber } from '../../../../../helpers/MathHelpers';

type Props = {
  onSubmit: (food: Food) => void;
};

export default function EditCustomFoodModal(props: Props) {
  const selectedFood = useEditCustomFoodModalStore((state) => state.selectedFood);
  const showEditCustomFoodModal = useEditCustomFoodModalStore((state) => state.showEditCustomFoodModal);

  const [isSaving, setIsSaving] = useState(false);
  const [openCollapseMicronutrients, setOpenCollapseMicronutrients] = useState(false);

  const { setShowEditCustomFoodModal, updateSelectedFood } = useEditCustomFoodModalStore();
  const { addFood, updateFood } = useFoods();

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    updateSelectedFood({ descricaoDoAlimento: value });
  };

  const handleChangeMeasure = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    updateSelectedFood({ medidaCaseira1: value });
  };

  const handleChangeMeasure2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    updateSelectedFood({ medidaCaseira2: value });
  };

  const handleChangeMeasure3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    updateSelectedFood({ medidaCaseira3: value });
  };

  const handleChangeGrams = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    updateSelectedFood({ gramas1: regexNumberRoundedFloat(value) });
  };

  const handleChangeGrams2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    updateSelectedFood({ gramas2: regexNumberRoundedFloat(value) });
  };

  const handleChangeGrams3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    updateSelectedFood({ gramas3: regexNumberRoundedFloat(value) });
  };

  const handleChangeCarbohydrate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const carboidrato = regexNumberRoundedFloat(value);

    if (isNaN(Number(carboidrato))) return updateSelectedFood({ carboidrato: carboidrato });

    const energia = Number(carboidrato) * 4 + Number(selectedFood?.proteina) * 4 + Number(selectedFood?.lipideos) * 9;

    updateSelectedFood({ carboidrato: carboidrato, energia });
  };

  const handleChangeProtein = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const protein = regexNumberRoundedFloat(value);

    if (isNaN(Number(protein))) return updateSelectedFood({ proteina: protein });

    const energia = Number(protein) * 4 + Number(selectedFood?.carboidrato) * 4 + Number(selectedFood?.lipideos) * 9;

    updateSelectedFood({ proteina: protein, energia });
  };

  const handleChangeLipid = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const lipid = regexNumberRoundedFloat(value);

    if (isNaN(Number(lipid))) return updateSelectedFood({ lipideos: lipid });

    const energia = Number(lipid) * 9 + Number(selectedFood?.carboidrato) * 4 + Number(selectedFood?.proteina) * 4;

    updateSelectedFood({ lipideos: lipid, energia });
  };

  const handleChangeCalories = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    const calorie = regexNumberRoundedFloat(value);

    if (isNaN(Number(calorie))) return;

    updateSelectedFood({ energia: calorie });
  };

  const handleChangeMicronutrient = (name: string, value: string) => {
    const nutrient = regexNumberRoundedFloat(value);

    if (isNaN(Number(nutrient))) return;

    updateSelectedFood({ [name]: parseFloatNumber(Number(nutrient)) });
  };

  const handleSubmit = async () => {
    if (!selectedFood) return;

    try {
      setIsSaving(true);

      const calculations = calculateValues(selectedFood as NutrientInput);

      if (!selectedFood.descricaoDoAlimento) {
        notify('O nome do alimento é obrigatório', 'Erro', 'close', 'danger');
        setIsSaving(false);
        return;
      } else if (!selectedFood.medidaCaseira1) {
        notify('A medida caseira 1 é obrigatória', 'Erro', 'close', 'danger');
        setIsSaving(false);
        return;
      }

      if (selectedFood?.id) {
        const payload = {
          ...selectedFood,
          ...calculations,
          gramas1: Number(selectedFood.gramas1).toFixed(2),
          gramas2: selectedFood.gramas2 ? Number(selectedFood.gramas2).toFixed(2) : undefined,
          gramas3: selectedFood.gramas3 ? Number(selectedFood.gramas3).toFixed(2) : undefined,
          selectedGroup: undefined,
        };

        const { data } = await api.put(`/alimento-personalizado/${selectedFood.id}`, payload);

        await updateFood(data);

        props.onSubmit(data);
      } else {
        const payload = {
          ...selectedFood,
          ...calculations,
          selectedGroup: undefined,
          id: undefined,
          gramas1: Number(selectedFood.gramas1).toFixed(2),
          gramas2: selectedFood.gramas2 ? Number(selectedFood.gramas2).toFixed(2) : undefined,
          gramas3: selectedFood.gramas3 ? Number(selectedFood.gramas3).toFixed(2) : undefined,
        };
        const { data } = await api.post(`/alimento-personalizado`, payload);

        await addFood(data);

        props.onSubmit(data);
      }

      setShowEditCustomFoodModal(false);
      setIsSaving(false);
      notify('Alimento personalizado salvo com sucesso', 'Sucesso', 'check', 'success', false);
    } catch (error) {
      notify('Ocorreu um erro ao salvar o alimento personalizado', 'Erro', 'close', 'danger', false);
      console.error(error);
      setIsSaving(false);
    }
  };

  const calculateValues = (food: NutrientInput) => {
    const calculations: NutrientInput = {
      energia: 0,
      proteina: 0,
      lipideos: 0,
      carboidrato: 0,
      fibraAlimentar: 0,
      calcio: 0,
      magnesio: 0,
      manganes: 0,
      fosforo: 0,
      ferro: 0,
      sodio: 0,
      potassio: 0,
      cobre: 0,
      zinco: 0,
      selenio: 0,
      retinol: 0,
      vitaminaAEquivalenteDeAtividadeDeRetinol: 0,
      tiaminaVitaminaB1: 0,
      riboflavinaVitaminaB2: 0,
      niacinaVitaminaB3: 0,
      equivalenteDeNiacinaVitaminaB3: 0,
      piridoxinaVitaminaB6: 0,
      cobalaminaVitaminaB12: 0,
      vitaminaDCalciferol: 0,
      vitaminaETotalDeAlphaTocopherol: 0,
      vitaminaC: 0,
      colesterol: 0,
      acidosGraxosSaturados: 0,
      acidosGraxosMonoinsaturados: 0,
      acidosGraxosPoliinsaturados: 0,
      acidosGraxosTransTotal: 0,
    };

    for (const key in food) {
      if (Object.prototype.hasOwnProperty.call(calculations, key) && key !== 'gramas1') {
        calculations[key] = String((Number(food[key]) / Number(food.gramas1 ?? 0)) * 100);
      } else if (food[key] === '') {
        calculations[key] = null;
      }
    }

    return calculations;
  };

  return (
    <Modal show={showEditCustomFoodModal} onHide={() => setShowEditCustomFoodModal(false)} backdrop="static" className="modal-close-out" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Alimento Personalizado</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          {/* Name */}
          <Col md="6" className="mb-3">
            <div className="d-flex flex-column justify-content-center filled">
              <CsLineIcons icon="pepper" />
              <Form.Control placeholder="Digite o nome da refeição" type="text" value={selectedFood?.descricaoDoAlimento} onChange={handleChangeName} />
            </div>
          </Col>

          {/* Eating Group */}
          <Col md="6" className="mb-3">
            <div className="d-flex flex-column justify-content-center filled">
              <CsLineIcons icon="radish" />
              <SelectEatingGroup />
            </div>
          </Col>

          {/* Measure 1 */}
          <Col md="6" className="mb-3 pt-4">
            <div className="d-flex flex-column justify-content-center filled">
              <CsLineIcons icon="cook-hat" />
              <Form.Control placeholder="Medida Caseira 1" type="text" value={selectedFood?.medidaCaseira1 ?? ''} onChange={handleChangeMeasure} />
            </div>
          </Col>

          {/* Measure 1 Values */}
          <Col md="6" className="mb-3 position-relative">
            <Row className="mx-0 position-absolute row w-100 pe-4 top-0">
              <Col className="px-0 text-center">
                <small className="text-muted mb-2">Peso</small>
              </Col>

              <Col className="pe-0 text-center">
                <small className="text-muted mb-2">Cho</small>
              </Col>

              <Col className="pe-0 text-center">
                <small className="text-muted mb-2">Ptn</small>
              </Col>

              <Col className="pe-0 text-center">
                <small className="text-muted mb-2">Lib</small>
              </Col>

              <Col className="pe-0 text-center">
                <small className="text-muted mb-2">Kcal</small>
              </Col>
            </Row>

            <Row className="mx-0 pt-4">
              <Col className="px-0">
                <div className="d-flex flex-column justify-content-center filled">
                  <Form.Control className="ps-2 text-center" placeholder="Peso" value={selectedFood?.gramas1} type="text" onChange={handleChangeGrams} />
                </div>
              </Col>

              <Col className="pe-0">
                <div className="d-flex flex-column justify-content-center filled">
                  <Form.Control
                    className="ps-2 text-center"
                    placeholder="Cho"
                    value={selectedFood?.carboidrato ? selectedFood?.carboidrato : ''}
                    type="text"
                    onChange={handleChangeCarbohydrate}
                  />
                </div>
              </Col>

              <Col className="pe-0">
                <div className="d-flex flex-column justify-content-center filled">
                  <Form.Control
                    className="ps-2 text-center"
                    placeholder="Ptn"
                    value={selectedFood?.proteina ? selectedFood?.proteina : ''}
                    type="text"
                    onChange={handleChangeProtein}
                  />
                </div>
              </Col>

              <Col className="pe-0">
                <div className="d-flex flex-column justify-content-center filled">
                  <Form.Control
                    className="ps-2 text-center"
                    placeholder="Lip"
                    value={selectedFood?.lipideos ? selectedFood?.lipideos : ''}
                    type="text"
                    onChange={handleChangeLipid}
                  />
                </div>
              </Col>

              <Col className="pe-0">
                <div className="d-flex flex-column justify-content-center filled">
                  <Form.Control
                    className="ps-2 text-center"
                    placeholder="Kcal"
                    value={selectedFood?.energia ? selectedFood?.energia : ''}
                    type="text"
                    onChange={handleChangeCalories}
                  />
                </div>
              </Col>
            </Row>
          </Col>

          <Col md={12}>
            <div className="mb-3">
              <div className="d-flex justify-content-end">
                <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip-bin">Expandir micronutrientes</Tooltip>}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="btn-icon btn-icon-only"
                    type="button"
                    aria-controls="content-collapse-text"
                    aria-expanded={openCollapseMicronutrients}
                    onClick={() => setOpenCollapseMicronutrients(!openCollapseMicronutrients)}
                  >
                    <CsLineIcons icon="eye" />
                  </Button>
                </OverlayTrigger>
              </div>

              <Collapse in={openCollapseMicronutrients}>
                <div className="mt-2">
                  <small className="text-muted mb-2">Insira os micronutrientes do alimento (todos são opcionais)</small>
                  <Row>
                    {parsedmicroNutrients.map((nutrient) => (
                      <Col md="4" className="mb-3" key={nutrient.name}>
                        <div className="d-flex flex-column justify-content-center filled">
                          <CsLineIcons icon="spinner" />
                          <Form.Control
                            placeholder={nutrient.title}
                            type="text"
                            value={!selectedFood || !Number(selectedFood[nutrient.name]) ? '' : Number(selectedFood[nutrient.name])}
                            onChange={(e) => handleChangeMicronutrient(nutrient.name, e.target.value)}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Collapse>
            </div>
          </Col>

          {/* Measure 2 */}
          <Col md="6" className="mb-3">
            <div className="d-flex flex-column justify-content-center filled">
              <CsLineIcons icon="cook-hat" />
              <Form.Control placeholder="Medida Caseira 2" type="text" value={selectedFood?.medidaCaseira2 ?? ''} onChange={handleChangeMeasure2} />
            </div>
          </Col>

          {/* Measure 2 Value */}
          <Col md="6" className="mb-3">
            <div className="d-flex flex-column justify-content-center filled">
              <CsLineIcons icon="cook-hat" />
              <Form.Control placeholder="Peso" type="text" value={selectedFood?.gramas2 ?? ''} onChange={handleChangeGrams2} />
            </div>
          </Col>

          {/* Measure 3 */}
          <Col md="6" className="mb-3">
            <div className="d-flex flex-column justify-content-center filled">
              <CsLineIcons icon="cook-hat" />
              <Form.Control placeholder="Medida Caseira 3" type="text" value={selectedFood?.medidaCaseira3 ?? ''} onChange={handleChangeMeasure3} />
            </div>
          </Col>

          {/* Measure 3 Value */}
          <Col md="6" className="mb-3">
            <div className="d-flex flex-column justify-content-center filled">
              <CsLineIcons icon="cook-hat" />
              <Form.Control placeholder="Peso" type="text" value={selectedFood?.gramas3 ?? ''} onChange={handleChangeGrams3} />
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
          Salvar alterações
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
}
