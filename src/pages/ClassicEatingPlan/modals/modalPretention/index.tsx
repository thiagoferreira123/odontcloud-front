import React, { useState } from 'react';
import { Button, Form, FormLabel, Modal, OverlayTrigger, Row, Col, Tooltip } from 'react-bootstrap';
import SliderPercentages from './SliderPercentages';

import useMacrosStore from '../../hooks/useMacrosStore';
import useClassicPlan from '../../hooks/useClassicPlan';
import { notify } from '../../../../components/toast/NotificationIcon';
import CaloricExpenditureSelect from './CaloricExpenditureSelect';
import { regexNumber, regexNumberFloat, regexNumberRoundedFloat } from '../../../../helpers/InputHelpers';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../../components/AsyncButton';
import { ClassicPlan } from '../../../../types/PlanoAlimentarClassico';
import api from '../../../../services/useAxios';
import WeigthSelect from './WeigthSelect';

interface ModalPretetionProps {
  show: boolean;
  onClose: () => void;
}

const ModalPretetion: React.FC<ModalPretetionProps> = ({ show, onClose }) => {
  const { toggleMacrosMode } = useMacrosStore();
  const planId = useClassicPlan((state) => state.planId);
  const [isSaving, setIsSaving] = useState(false);

  const vrPeso = useMacrosStore((state) => state.vrPeso);
  const vrCalorias = useMacrosStore((state) => state.vrCalorias);

  const vrCarboidratos = useMacrosStore((state) => state.vrCarboidratos);
  const vrProteinas = useMacrosStore((state) => state.vrProteinas);
  const vrLipideos = useMacrosStore((state) => state.vrLipideos);

  const carbohydrates = useMacrosStore((state) => state.carbohydrates);
  const proteins = useMacrosStore((state) => state.proteins);
  const lipids = useMacrosStore((state) => state.lipids);

  const macrossMode = useMacrosStore((state) => state.macrossMode);

  const { setPredition, setCarbohydrates, setProteins, setLipids, setIgnoreUseEffect } = useMacrosStore();

  const handleChangeCarbohydratesPercentage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const inputValue = regexNumber(e.target.value);
    const inputValue = regexNumber(e.target.value);
    const newVRCarboidratos = Number(inputValue);
    const newValue = newVRCarboidratos > 100 ? 100 : newVRCarboidratos < 0 ? 0 : newVRCarboidratos;
    setPredition({ vrCarboidratos: newValue });
  };

  const handleChangeProteinsPercentage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const inputValue = regexNumber(e.target.value);
    const inputValue = regexNumber(e.target.value);
    const newVRProteinas = Number(inputValue);
    const newValue = newVRProteinas + Number(vrCarboidratos) > 100 ? 100 - Number(vrCarboidratos) : newVRProteinas < 0 ? 0 : newVRProteinas;
    setPredition({ vrProteinas: newValue });
  };

  const handleChangeLipidsPercentage = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const inputValue = regexNumber(e.target.value);
    const inputValue = regexNumber(e.target.value);
    const newVRLipideos = Number(inputValue);
    const newValue = newVRLipideos + Number(vrCarboidratos) > 100 ? 100 - Number(vrCarboidratos) : newVRLipideos < 0 ? 0 : newVRLipideos;
    setPredition({ vrLipideos: newValue });
  };

  const handleBlurCarbohydrates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pretendido_gkg = regexNumberFloat(e.target.value);
    let carbsgramsPerKilo = isNaN(Number(pretendido_gkg)) ? 0 : Number(pretendido_gkg);
    let carbCalories = carbsgramsPerKilo * 4 * Number(vrPeso);

    if (carbCalories > Number(vrCalorias)) {
      carbCalories = Number(vrCalorias);
      carbsgramsPerKilo = carbCalories && vrPeso ? carbCalories / Number(vrPeso) / 4 : 0;
      setCarbohydrates({ pretendido_gkg: carbsgramsPerKilo.toFixed(1) });
    }

    let proteinsgramsPerKilo = Number(proteins.pretendido_gkg);
    let proteinsCalories = proteinsgramsPerKilo * 4 * Number(vrPeso);

    let lipidsGkg = (Number(vrCalorias) - carbCalories - proteinsCalories) / (9 * Number(vrPeso));

    if (lipidsGkg < 0) {
      lipidsGkg = 0;

      proteinsgramsPerKilo = (Number(vrCalorias) - carbCalories) / (4 * Number(vrPeso));
      setProteins({ pretendido_gkg: proteinsgramsPerKilo.toFixed(2) });
    }

    setLipids({ pretendido_gkg: lipidsGkg.toFixed(2) });

    proteinsCalories = proteinsgramsPerKilo * 4 * Number(vrPeso);

    setPredition({
      vrCarboidratos: (carbCalories / Number(vrCalorias)) * 100,
      vrProteinas: (proteinsCalories / Number(vrCalorias)) * 100,
      vrLipideos: ((Number(vrCalorias) - carbCalories - proteinsCalories) / Number(vrCalorias)) * 100,
    });

    setIgnoreUseEffect(true);
    setCarbohydrates({ pretendido_gkg });
  };

  const handleBlurProteins = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pretendido_gkg = regexNumberFloat(e.target.value);
    let proteinsGramsPerKilo = isNaN(Number(pretendido_gkg)) ? 0 : Number(pretendido_gkg);
    let proteinsCalories = proteinsGramsPerKilo * 4 * Number(vrPeso);

    if (proteinsCalories > Number(vrCalorias)) {
      proteinsCalories = Number(vrCalorias);
      proteinsGramsPerKilo = proteinsCalories && vrPeso ? proteinsCalories / Number(vrPeso) / 4 : 0;
      setProteins({ pretendido_gkg: proteinsGramsPerKilo.toFixed(1) });
    }

    let lipidsgramsPerKilo = Number(lipids.pretendido_gkg);
    let lipidsCalories = lipidsgramsPerKilo * 9 * Number(vrPeso);

    let carbohydratesGkg = (Number(vrCalorias) - proteinsCalories - lipidsCalories) / (4 * Number(vrPeso));

    if (carbohydratesGkg < 0) {
      carbohydratesGkg = 0;

      lipidsgramsPerKilo = (Number(vrCalorias) - proteinsCalories) / (9 * Number(vrPeso));
      setLipids({ pretendido_gkg: lipidsgramsPerKilo.toFixed(2) });
    }

    setCarbohydrates({ pretendido_gkg: carbohydratesGkg.toFixed(2) });

    lipidsCalories = lipidsgramsPerKilo * 9 * Number(vrPeso);

    setPredition({
      vrLipideos: (lipidsCalories / Number(vrCalorias)) * 100,
      vrProteinas: (proteinsCalories / Number(vrCalorias)) * 100,
      vrCarboidratos: ((Number(vrCalorias) - lipidsCalories - proteinsCalories) / Number(vrCalorias)) * 100,
    });

    setIgnoreUseEffect(true);
    setProteins({ pretendido_gkg });
  };

  const handleBlurLipids = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pretendido_gkg = regexNumberFloat(e.target.value);
    let lipidsGramsPerKilo = isNaN(Number(pretendido_gkg)) ? 0 : Number(pretendido_gkg);
    let lipidsCalories = lipidsGramsPerKilo * 9 * Number(vrPeso);

    if (lipidsCalories > Number(vrCalorias)) {
      lipidsCalories = Number(vrCalorias);
      lipidsGramsPerKilo = lipidsCalories && vrPeso ? lipidsCalories / Number(vrPeso) / 9 : 0;
      setLipids({ pretendido_gkg: lipidsGramsPerKilo.toFixed(1) });
    }

    let proteinsgramsPerKilo = Number(proteins.pretendido_gkg);
    let proteinsCalories = proteinsgramsPerKilo * 4 * Number(vrPeso);

    let carbohydratesGkg = (Number(vrCalorias) - proteinsCalories - lipidsCalories) / (4 * Number(vrPeso));

    if (carbohydratesGkg < 0) {
      carbohydratesGkg = 0;

      proteinsgramsPerKilo = (Number(vrCalorias) - lipidsCalories) / (4 * Number(vrPeso));
      setProteins({ pretendido_gkg: proteinsgramsPerKilo.toFixed(2) });
    }

    setCarbohydrates({ pretendido_gkg: carbohydratesGkg.toFixed(2) });

    proteinsCalories = proteinsgramsPerKilo * 4 * Number(vrPeso);

    setPredition({
      vrLipideos: (lipidsCalories / Number(vrCalorias)) * 100,
      vrProteinas: (proteinsCalories / Number(vrCalorias)) * 100,
      vrCarboidratos: ((Number(vrCalorias) - lipidsCalories - proteinsCalories) / Number(vrCalorias)) * 100,
    });

    setIgnoreUseEffect(true);
    setLipids({ pretendido_gkg });
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      const payload: Partial<ClassicPlan> = {
        vrProteinas: Number(vrProteinas),
        vrCarboidratos: Number(vrCarboidratos),
        vrLipideos: Number(vrLipideos),
        vrCalorias: Number(vrCalorias),
        vrPeso: Number(vrPeso),
      };

      await api.patch('/plano_alimentar/' + planId, payload);

      onClose();
      setIsSaving(false);

      notify('Pretenção de macronutrientes e calorias salva com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      notify('Erro ao salvar pretenção de macronutrientes e calorias', 'Erro', 'close', 'danger');
    }
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Pretenção de macronutrientes e calorias</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="row px-3">
          <Col xs="6">
            <FormLabel className="col-form-label">Total calórico</FormLabel>
            <div className="d-flex flex-column filled">
              <CsLineIcons icon="form" />
              <CaloricExpenditureSelect />
            </div>
          </Col>
          <Col xs="6">
            <FormLabel className="col-form-label">Peso</FormLabel>
            <div className="d-flex flex-column filled">
              <CsLineIcons icon="form" />
              <WeigthSelect />
            </div>
          </Col>
        </Row>

        <Row className="mb-5 row px-3">{macrossMode === 'percentage' ? <SliderPercentages /> : false}</Row>

        <div className="d-flex justify-content-between">
          <div className="mt-1 w-20">
            <label>
              Carbo <small>({macrossMode === 'gramas' ? 'g/kg' : '%'})</small>
            </label>
            {macrossMode === 'gramas' ? (
              <Form.Control value={carbohydrates.pretendido_gkg} onChange={handleBlurCarbohydrates} className="form-control mt-1 text-center" />
            ) : (
              <Form.Control
                value={regexNumberRoundedFloat(String(vrCarboidratos))}
                onChange={handleChangeCarbohydratesPercentage}
                min={0}
                max={100}
                className="form-control mt-1 text-center"
              />
            )}
            <Form.Control className="form-control mt-1 text-center" disabled value={Number(carbohydrates.pretendido_kcal) + ' kcal'} />
            <Form.Control className="form-control mt-1 text-center" disabled value={Number(carbohydrates.pretendido_g) + ' g'} />
            {macrossMode === 'percentage' ? (
              <Form.Control className="form-control mt-1 text-center" disabled value={Number(carbohydrates.pretendido_gkg) + ' g/kg'} />
            ) : (
              <Form.Control className="form-control mt-1 text-center" disabled value={Number(vrCarboidratos).toFixed(1) + '%'} />
            )}
          </div>

          <div className="mt-1 w-30">
            <label>
              Proteínas <small>({macrossMode === 'gramas' ? 'g/kg' : '%'})</small>
            </label>
            {macrossMode === 'gramas' ? (
              <Form.Control value={proteins.pretendido_gkg} onChange={handleBlurProteins} className="form-control mt-1 text-center" />
            ) : (
              <Form.Control
                value={regexNumberRoundedFloat(String(vrProteinas))}
                onChange={handleChangeProteinsPercentage}
                min={0}
                max={100}
                className="form-control mt-1 text-center"
              />
            )}
            <Form.Control className="form-control mt-1 text-center" disabled value={Number(proteins.pretendido_kcal) + ' kcal'} />
            <Form.Control className="form-control mt-1 text-center" disabled value={Number(proteins.pretendido_g) + ' g'} />
            {macrossMode === 'percentage' ? (
              <Form.Control className="form-control mt-1 text-center" disabled value={Number(proteins.pretendido_gkg) + ' g/kg'} />
            ) : (
              <Form.Control className="form-control mt-1 text-center" disabled value={Number(vrProteinas).toFixed(1) + '%'} />
            )}
          </div>

          <div className="mt-1 w-30">
            <label>
              Lípideos <small>({macrossMode === 'gramas' ? 'g/kg' : '%'})</small>
            </label>
            {macrossMode === 'gramas' ? (
              <Form.Control value={lipids.pretendido_gkg} onChange={handleBlurLipids} className="form-control mt-1 text-center" />
            ) : (
              <Form.Control
                value={regexNumberRoundedFloat(String(vrLipideos))}
                onChange={handleChangeLipidsPercentage}
                min={0}
                max={100}
                className="form-control mt-1 text-center"
              />
            )}
            <Form.Control className="form-control mt-1 text-center" disabled value={Number(lipids.pretendido_kcal) + ' kcal'} />
            <Form.Control className="form-control mt-1 text-center" disabled value={Number(lipids.pretendido_g) + ' g'} />
            {macrossMode === 'percentage' ? (
              <Form.Control className="form-control mt-1 text-center" disabled value={Number(lipids.pretendido_gkg) + ' g/kg'} />
            ) : (
              <Form.Control className="form-control mt-1 text-center" disabled value={Number(vrLipideos).toFixed(1) + '%'} />
            )}
          </div>
        </div>

        <div>
          <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip-cart">Alterar para modo g/kg</Tooltip>}>
            <Button onClick={() => toggleMacrosMode()} variant="primary" size="sm" className="btn-icon btn-icon-only mt-3" type="button">
              <CsLineIcons icon="sync-horizontal" />
            </Button>
          </OverlayTrigger>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} className="mb-1 btn btn-primary">
          Salvar configurações
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPretetion;
