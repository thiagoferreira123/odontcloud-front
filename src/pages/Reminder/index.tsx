import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { LAYOUT } from '../../constants';
import CardNutrientAnalisys from './CardNutrientAnalisys';
import OptionButtons from './OptionButtons';
import CardMeal from './principal-meal/CardMeal';
import { useQuery } from '@tanstack/react-query';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import 'react-toastify/dist/ReactToastify.css';

import useClassicPlan from './hooks/useClassicPlan';
import useMacrosStore from './hooks/useMacrosStore';
import ModalPhotoMeal from './modals/modalPhotoMeal';
import ModalObservationMeal from './modals/modalObservationMeal';
import ButtonsAddMeal from './ButtonsAddMeal';
import { useModalsStore } from './hooks/useModalsStore';
import ModalDeleteMeal from './modals/ModalDeleteMeal';
import CardMicronutrientAnalisys from './CardMicronutrientAnalisys';
import { useMicronutrientStore } from './hooks/micronutrientStore';
import ModalCustomMeasurement from './modals/ModalCustomMeasurement';
import useCustomLayout from '../../hooks/useCustomLayout';
import useFoods from '../../hooks/useFoods';
import api from '../../services/useAxios';
import { ClassicPlanMeal, ClassicPlanReplacementMeal } from '../../types/PlanoAlimentarClassico';
import Loading from '../../components/loading/Loading';
import { notify } from '../../components/toast/NotificationIcon';
import Empty from '../../components/Empty';
import EditCustomFoodModal from '../MyMaterials/my-foods/modals/EditCustomFoodModal';
import AsyncButton from '../../components/AsyncButton';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';
import PatientMenuRow from '../../components/PatientMenuRow';

const PlanEatingClassic = () => {
  useCustomLayout({ layout: LAYOUT.Boxed });

  const { setPlan, setMeals, setSelectedMeal, setSelectedMealId } = useClassicPlan();
  const { setPredition } = useMacrosStore();
  const { getFoods } = useFoods();
  const { setPatientId } = usePatientMenuStore();

  const showMicronutrientsCard = useMicronutrientStore((state) => state.showMicronutrientsCard);

  const meals = useClassicPlan((state) => state.meals);

  const [sortableEnabled, setSortableEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openedCollapseId, setOpenedCollapseId] = useState<number | null>(null);

  const resultFood = useQuery({ queryKey: ['foods'], queryFn: getFoods });

  const { id } = useParams<{ id: string }>();

  const getPlan = async () => {
    const response = await api.get('/plano_alimentar/' + id);
    response.data.data.idPaciente && setPatientId(response.data.data.idPaciente);

    return response.data.data;
  };

  const { data, isError, isLoading, isFetched } = useQuery({ queryKey: ['classic-plan', id], queryFn: getPlan });

  React.useEffect(() => {
    if (isFetched && data.id) {
      setPlan(data);
      setPredition({
        vrCarboidratos: Number(data.vrCarboidratos) ? data.vrCarboidratos : 50,
        vrLipideos: Number(data.vrLipideos) ? data.vrLipideos : 15,
        vrProteinas: Number(data.vrProteinas) ? data.vrProteinas : 35,
        vrCalorias: Number(data.vrCalorias),
        vrPeso: Number(data.vrPeso),
      });
    }
  }, [data, isFetched, setPredition, setPlan]);

  const showModalDeleteMeal = useModalsStore((state) => state.showModalDeleteMeal);

  const { setShowModalDeleteMeal } = useModalsStore();

  const [showModalObservation, setShowModalObservation] = useState(false);
  const handleOpenModalObservation = (meal: ClassicPlanMeal | ClassicPlanReplacementMeal, mealId?: number) => {
    setSelectedMeal(meal);
    setSelectedMealId(mealId ?? null);
    setShowModalObservation(true);
  };
  const handleCloseModalObservation = () => setShowModalObservation(false);

  const [showModalPhotoMeal, setShowModalPhotoMeal] = useState(false);
  const handleOpenModalPhotoMeal = (meal: ClassicPlanMeal | ClassicPlanReplacementMeal, mealId?: number) => {
    setSelectedMeal(meal);
    setSelectedMealId(mealId ?? null);
    setShowModalPhotoMeal(true);
  };
  const handleCloseModalPhotoMeal = () => setShowModalPhotoMeal(false);

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      await api.patch('/plano_alimentar/' + id, { refeicoes: meals });
      notify('Refeições atualizadas com sucesso', 'Sucesso', 'check', 'success');
      setIsSaving(false);
    } catch (error) {
      notify('Erro ao atualizar refeições', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  if (isLoading || resultFood.isLoading) {
    return <Loading />;
  }

  if (isError || resultFood.isError) {
    return <div>Erro ao carregar o plano.</div>;
  }

  setTimeout(() => {
    setOpenedCollapseId(null);
  }, 500);

  return (
    <>
      <Row>
        <PatientMenuRow />
        <CardNutrientAnalisys />

        <OptionButtons />

        {!showMicronutrientsCard ? (
          <>
            {meals.length ? (
              <ReactSortable
                list={meals as ItemInterface[]}
                setList={(mealsSorted) => setMeals(mealsSorted as ClassicPlanMeal[])}
                handle=".drag-meal-icon"
                onChange={() => setSortableEnabled(true)}
                animation={300}
              >
                {meals.map((meal, index) => (
                  <CardMeal
                    key={meal.id}
                    meal={meal}
                    index={index}
                    sortableEnabled={sortableEnabled}
                    handleOpenModalObservation={handleOpenModalObservation}
                    handleOpenModalPhotoMeal={handleOpenModalPhotoMeal}
                    isCollapseIsOpened={openedCollapseId === meal.id}
                  />
                ))}
              </ReactSortable>
            ) : (
              <Empty message="Nenhuma refeição adicionada" />
            )}

            <div className="d-flex justify-content-center gap-2">
              <ButtonsAddMeal setOpenedCollapseId={setOpenedCollapseId} />
              <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit}>
                Salvar refeições
              </AsyncButton>
            </div>
          </>
        ) : (
          <CardMicronutrientAnalisys />
        )}
      </Row>

      <ModalPhotoMeal show={showModalPhotoMeal} onClose={handleCloseModalPhotoMeal} />
      <ModalObservationMeal show={showModalObservation} onClose={handleCloseModalObservation} />
      <ModalDeleteMeal show={showModalDeleteMeal} onClose={() => setShowModalDeleteMeal(false)} />
      <ModalCustomMeasurement />

      <EditCustomFoodModal onSubmit={() => {}} />
    </>
  );
};

export default PlanEatingClassic;
