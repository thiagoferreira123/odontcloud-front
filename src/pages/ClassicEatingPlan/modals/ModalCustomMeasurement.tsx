import React from 'react';
import { Button, Col, Form, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useModalsStore } from '../hooks/useModalsStore';
import { useQuery } from '@tanstack/react-query';
import { CustomMeasure, useCustomMeasureStore } from '../hooks/customMeasureStore';
import useClassicPlan from '../hooks/useClassicPlan';
import { notify } from '../../../components/toast/NotificationIcon';
import useFoods from '../../../hooks/useFoods';
import api from '../../../services/useAxios';
import { MeasureOption, MedidaCaseira } from '../../../types/foods';
import { ClassicPlanMealFood, ClassicPlanReplacementMealFood } from '../../../types/PlanoAlimentarClassico';
import StaticLoading from '../../../components/loading/StaticLoading';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../components/AsyncButton';

const ModalCustomMeasurement = () => {
  const showModalCustomMeasurement = useModalsStore((state) => state.showModalCustomMeasurement);
  const selectedMealFood = useModalsStore((state) => state.selectedMealFood);
  const selectedReplacementMealFood = useModalsStore((state) => state.selectedReplacementMealFood);
  const baseMealId = useModalsStore((state) => state.baseMealId);
  const foods = useFoods((state) => state.foods);
  const [isSaving, setIsSaving] = React.useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Insira um nome válido'),
    grams: Yup.number().required('Insira um valor válido').positive('Insira um valor positivo').integer('Insira um valor válido'),
  });

  const initialValues = { name: '', grams: 1 };

  const measurements = useCustomMeasureStore((state) => state.measurements);

  const { updateMealFood, updateReplacementMealFood } = useClassicPlan();
  const { setShowModalCustomMeasurement } = useModalsStore();
  const { getMeasurements, addMeasurement, removeMeasurement } = useCustomMeasureStore();

  const getMeasurements_ = async () => {
    try {
      const selectedFood = selectedMealFood ?? selectedReplacementMealFood;

      if (!selectedFood) throw new Error('Alimento não selecionado');

      const food = foods.find((f) => f.id === selectedFood.id_alimento && f.tabela === selectedFood.tabela);

      if (!food) throw new Error('Alimento selecionado não encontrado');

      const response = await getMeasurements();

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onSubmit = async (values: { name: string; grams: number }) => {
    setIsSaving(true);

    try {
      const { data } = await api.post('/plano-alimentar-classico-medida-caseira-personalizada', {
        name: values.name,
        grams: Number(values.grams),
      });

      addMeasurement(data);

      handleSelectMeasurement(data);
      setIsSaving(false);
      resetForm();

      notify('Medida caseira salva com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao salvar medida caseira', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleRemoveMeasurement = async (measurement: CustomMeasure) => {
    try {
      removeMeasurement(measurement);
      await api.delete('/plano-alimentar-classico-medida-caseira-personalizada/' + measurement.id);
    } catch (error) {
      notify('Erro ao remover medida caseira', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const handleSelectMeasurement = async (measurement: CustomMeasure) => {
    try {
      const selectedFood = selectedMealFood ?? selectedReplacementMealFood;

      if (!selectedFood) throw new Error('Alimento não selecionado');

      const gramas = measurement.grams * selectedFood.quantidade_medida;

      const option: MeasureOption = { label: measurement.name, value: measurement.name };

      const measure: MedidaCaseira = { nome: measurement.name, gramas: measurement.grams };

      const payload: Partial<ClassicPlanMealFood> = {
        id: selectedFood.id,
        id_refeicao: selectedFood.id_refeicao,
        measureOption: option,
        measure: measure,
        medida_caseira: option.value,
        gramas: gramas,
        carbohydrate: ((Number(selectedFood.food?.carboidrato) * Number(gramas)) / 100).toFixed(1),
        protein: ((Number(selectedFood.food?.proteina) * Number(gramas)) / 100).toFixed(1),
        lipid: ((Number(selectedFood.food?.lipideos) * Number(gramas)) / 100).toFixed(1),
        calories: ((Number(selectedFood.food?.energia) * Number(gramas)) / 100).toFixed(1),
      };

      if(selectedMealFood) {
        updateMealFood(payload);

        setShowModalCustomMeasurement(false);

        await api.patch('/plano-alimentar-classico-refeicao-alimento/' + selectedFood.id, {
          medida_caseira: option.value,
          gramas: gramas,
        });
      } else if (selectedReplacementMealFood && baseMealId) {
        updateReplacementMealFood(payload, baseMealId);

        setShowModalCustomMeasurement(false);

        await api.patch('/plano-alimentar-classico-refeicao-substituta-alimento/' + selectedFood.id, {
          medida_caseira: option.value,
          gramas: gramas,
        });
      }


      // props.handlePersistMacros();
    } catch (error) {
      notify('Erro ao selecionar medida caseira', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, resetForm, values, touched, errors } = formik;

  const result = useQuery({ queryKey: ['custom-measurements'], queryFn: getMeasurements_, enabled: showModalCustomMeasurement });

  return (
    <Modal show={showModalCustomMeasurement} onHide={() => setShowModalCustomMeasurement(false)} backdrop="static" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Seleciona uma medida personalizada</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="scroll-out">
          <div className="override-native overflow-auto sh-30 pe-3">
            <div className="border-bottom border-separator-light mb-2 pb-2">
              {result.isLoading ? (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                  <StaticLoading />
                </div>
              ) : result.isError ? (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">Erro ao consultar medidas personalizadas</div>
              ) : result.data ? (
                <>
                  {measurements.map((measurement) => (
                    <Row className="g-0 sh-6" key={measurement.id}>
                      <Col>
                        <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                          <div className="d-flex flex-column">
                            <div>
                              {measurement.name} ({measurement.grams}g)
                            </div>
                          </div>
                          <div className="d-flex">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="ms-1"
                              onClick={() => handleSelectMeasurement(measurement)}
                              disabled={
                                measurement.name === selectedMealFood?.medida_caseira || measurement.name === selectedReplacementMealFood?.medida_caseira
                              }
                            >
                              Utilizar
                            </Button>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="btn-icon btn-icon-only ms-1"
                              onClick={() => handleRemoveMeasurement(measurement)}
                            >
                              <CsLineIcons icon="bin" />
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </>
              ) : (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">Nenhuma medida personalizada cadastrada</div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <form onSubmit={handleSubmit} className="d-flex align-items-center">
          <Col md={7}>
            <div className="mb-3 filled mt-2 me-2 flex-grow-1">
              <CsLineIcons icon="cupcake" />
              <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Digite o nome da medida" />
              {errors.name && touched.name && <div className="error">{errors.name}</div>}
            </div>
          </Col>
          <Col md={3}>
            <div className="mb-3 filled mt-2 flex-grow-1">
              <CsLineIcons icon="cupcake" />
              <Form.Control type="text" name="grams" value={values.grams} onChange={handleChange} placeholder="g/mL" />
              {errors.grams && touched.grams && <div className="error">{errors.grams}</div>}
            </div>
          </Col>
          <Col md={2}>
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add-item">Cadastrar medida caseira personalizada.</Tooltip>}>
              <span>
                <AsyncButton type="submit" loadingText=" " isSaving={isSaving} className="btn-icon btn-icon-only ms-2">
                  <CsLineIcons icon="plus" />
                </AsyncButton>
              </span>
            </OverlayTrigger>
          </Col>
        </form>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCustomMeasurement;
