import React, { useState } from 'react';
import { LAYOUT } from '../../constants';
import 'react-toastify/dist/ReactToastify.css';

import { Card, Col, Row } from 'react-bootstrap';
import CardNutrientAnalisys from './CardNutrientAnalisys';
import OptionButtons from './OptionButtons';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEquivalentEatingPlanStore } from './hooks/equivalentEatingPlanStore';
import { AxiosError } from 'axios';
import CardMeal from './meal';
import FoodGroups from './FoodGroups';
import ModalFoodOptions from './modals/ModalFoodOptions';
import { useModalsStore } from './hooks/modalsStore';
import ModalSeparateFoods from './modals/ModalSeparateFoods';
import ModalObservationMeal from './modals/ModalObservationMeal';
import ModalPhotoMeal from './modals/ModalPhotoMeal';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import useMacrosStore from './hooks/useMacrosStore';
import ModalDeleteMeal from './modals/ModalDeleteMeal';
import ModalEmptyListAlert from './modals/ModalEmptyListAlert';
import { useMicronutrientStore } from './hooks/micronutrientStore';
import CardMicronutrientAnalisys from './CardMicronutrientAnalisys';
import { notify } from '../../components/toast/NotificationIcon';
import useCustomLayout from '../../hooks/useCustomLayout';
import StaticLoading from '../../components/loading/StaticLoading';
import { EquivalentEatingPlanMeal } from '../../types/PlanoAlimentarEquivalente';
import Empty from '../../components/Empty';
import AsyncButton from '../../components/AsyncButton';
import api from '../../services/useAxios';
import PatientMenuRow from '../../components/PatientMenuRow';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';

const EquivalentEatingPlan = () => {
  useCustomLayout({ layout: LAYOUT.Boxed });

  const { id } = useParams<{ id: string }>();

  const [sortableEnabled, setSortableEnabled] = useState(false);
  const [isCreatingMeal, setIsCreatingMeal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const showModalFoodOptions = useModalsStore((state) => state.showModalFoodOptions);
  const showModalSeparateFoods = useModalsStore((state) => state.showModalSeparateFoods);
  const showModalObservationMeal = useModalsStore((state) => state.showModalObservationMeal);
  const showModalPhotoMeal = useModalsStore((state) => state.showModalPhotoMeal);
  const showModalDeleteMeal = useModalsStore((state) => state.showModalDeleteMeal);
  const showModalEmptyListAlert = useModalsStore((state) => state.showModalEmptyListAlert);

  const showMicronutrientsCard = useMicronutrientStore((state) => state.showMicronutrientsCard);

  const meals = useEquivalentEatingPlanStore((state) => state.meals);
  const selectedFoods = useEquivalentEatingPlanStore((state) => state.selectedFoods);

  const { getPlan, addMeal, setMeals } = useEquivalentEatingPlanStore();
  const {
    setShowModalFoodOptions,
    setShowModalSeparateFoods,
    setShowModalObservationMeal,
    setShowModalPhotoMeal,
    setShowModalDeleteMeal,
    setShowModalEmptyListAlert,
  } = useModalsStore();
  const { setPredition } = useMacrosStore();
  const { setPatientId } = usePatientMenuStore();

  const getPlan_ = async () => {
    try {
      if (!id) throw new Error('id is required');

      const response = await getPlan(id);

      response.idPaciente && setPatientId(response.idPaciente);

      setPredition({
        vrCarboidratos: Number(response.vrCarboidratos) ? Number(response.vrCarboidratos) : 50,
        vrProteinas: Number(response.vrProteinas) ? Number(response.vrProteinas) : 35,
        vrLipideos: Number(response.vrLipideos) ? Number(response.vrLipideos) : 15,
        vrCalorias: Number(response.vrCalorias) ? Number(response.vrCalorias) : 0,
        vrPeso: Number(response.vrPeso) ? Number(response.vrPeso) : 0,
      });

      return response.meals;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) return [];

      if (error instanceof AxiosError && error.response?.data?.message) {
        notify(error.response.data.message, 'Erro', 'close', 'danger');
        return;
      }

      console.error(error);
      notify('Erro ao carregar o plano alimentar.', 'Erro', 'close', 'danger');
      return [];
    }
  };

  const result = useQuery({ queryKey: ['equivalent-eating-plan', id], queryFn: getPlan_, enabled: !!id });

  const handleAddMeal = async () => {
    try {
      if (!id) throw new Error('id is required');

      if (!selectedFoods.length) return setShowModalEmptyListAlert(true);

      setIsCreatingMeal(true);

      await addMeal(id, meals.length + 1);

      setIsCreatingMeal(false);
    } catch (error) {
      console.error(error);
      notify('Erro ao adicionar refeição.', 'Erro', 'close', 'danger');
      setIsCreatingMeal(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      await api.patch('/plano-alimentar-equivalente-historico/' + id, { refeicoes: meals });
      notify('Refeições atualizadas com sucesso', 'Sucesso', 'check', 'success');
      setIsSaving(false);
    } catch (error) {
      notify('Erro ao atualizar refeições', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  }

  if (result.isLoading) {
    return <StaticLoading />;
  }

  if (result.isError) {
    return <div>Erro ao carregar o plano alimentar.</div>;
  }

  return (
    <>
    <PatientMenuRow />

      <Row>
        <CardNutrientAnalisys />

        <OptionButtons />

        {!showMicronutrientsCard ? (
          <>
            {meals && meals.length ? (
              <Card className="d-flex mb-2">
                <FoodGroups />

                <ReactSortable
                  list={meals as ItemInterface[]}
                  setList={(mealsSorted) => setMeals(mealsSorted as EquivalentEatingPlanMeal[])}
                  handle=".drag-meal-icon"
                  onChange={() => setSortableEnabled(true)}
                  animation={300}
                >
                  {meals.map((meal, index) => (
                    <CardMeal sortableEnabled={sortableEnabled} key={meal.id} meal={meal} index={index} />
                  ))}
                </ReactSortable>
              </Card>
            ) : (
              <Empty classNames="mb-0" message="Nenhuma refeição adicionada" />
            )}
          </>
        ) : (
          <CardMicronutrientAnalisys />
        )}

        <Col xs={12} className="d-flex justify-content-center gap-2 pt-4">
          <AsyncButton className="ml-3" isSaving={isCreatingMeal} loadingText="Adicionando Refeição..." onClickHandler={handleAddMeal}>
            Adicionar Refeição
          </AsyncButton>
              <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit}>Salvar refeições</AsyncButton>
        </Col>
      </Row>

      <ModalFoodOptions show={showModalFoodOptions} onClose={() => setShowModalFoodOptions(false)} />
      <ModalSeparateFoods show={showModalSeparateFoods} onClose={() => setShowModalSeparateFoods(false)} />
      <ModalObservationMeal show={showModalObservationMeal} onClose={() => setShowModalObservationMeal(false)} />
      <ModalPhotoMeal show={showModalPhotoMeal} onClose={() => setShowModalPhotoMeal(false)} />
      <ModalDeleteMeal show={showModalDeleteMeal} onClose={() => setShowModalDeleteMeal(false)} />
      <ModalEmptyListAlert show={showModalEmptyListAlert} onClose={() => setShowModalEmptyListAlert(false)} />
    </>
  );
};

export default EquivalentEatingPlan;
