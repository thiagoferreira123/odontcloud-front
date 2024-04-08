import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import TemplateMeals from './TemplateMeals';
import { useQualitativeEatingPlanStore } from './hooks/QualitativeEatingPlanStore';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import MealForm from './MealForm';
import DeleteTemplateConfirmationModal from './modals/DeleteTemplateConfirmationModal';
import AsyncButton from '../../components/AsyncButton';
import { notify } from '../../components/toast/NotificationIcon';
import DeleteMealConfirmationModal from './modals/DeleteMealConfirmationModal';
import FavoriteMealModal from './modals/FavoriteMealModal/FavoriteMealModal';
import PhotoMealModal from './modals/PhotoMealModal';
import MealCommentModal from './modals/MealCommentModal';
import OptionButtons from './OptionButtons';
import ShoppingListModal from './modals/ShoppingListModal';
import OrientationModal from './modals/OrientationModal';
import SendPDFModal from './modals/SendPDFModal';
import Empty from '../../components/Empty';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import { QualitativeEatingPlanMeal } from '../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types';
import PatientMenuRow from '../../components/PatientMenuRow';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';

const QualitativeEatingPlan = () => {
  const { id } = useParams();

  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [sortableEnabled, setSortableEnabled] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const qualitativeEatingPlanMeals = useQualitativeEatingPlanStore((state) => state.qualitativeEatingPlanMeals);
  const { getQualitativeEatingPlan, setQualitativeEatingPlanMeals, addMeal, handleSubmitMeals } = useQualitativeEatingPlanStore();
  const { setPatientId } = usePatientMenuStore();

  const getQualitativeEatingPlan_ = async () => {
    try {
      if (!id) throw new Error('id is required');

      const result = await getQualitativeEatingPlan(+id);

      if (result === false) throw new Error('Could not getQualitativeEatingPlan');

      setPatientId(result.patient_id);

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleAddMeal = async () => {
    try {
      if (!id) throw new Error('id must be provided');

      setIsAddingMeal(true);
      await addMeal(+id);
      setIsAddingMeal(false);
    } catch (error) {
      console.error(error);
      notify('Erro ao adicionar refeição', 'Erro', 'close', 'danger');
      setIsAddingMeal(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!qualitativeEatingPlanMeals) throw new Error('qualitativeEatingPlanMeals must be provided');
      if (!id) throw new Error('id must be provided');

      setSaving(true);
      await handleSubmitMeals(+id, qualitativeEatingPlanMeals);
      setSaving(false);
      notify('Plano alimentar qualitativo salvo com sucesso', 'Sucesso', 'check');
    } catch (error) {
      console.error(error);
      notify('Erro ao salvar refeições', 'Erro', 'close', 'danger');
      setSaving(false);
    }
  };

  const result = useQuery({ queryKey: ['qualitative-eating-plan', id], queryFn: getQualitativeEatingPlan_ });

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  return (
    <Row>
      <PatientMenuRow />

      <OptionButtons />

      <Col xs={5}>
        <TemplateMeals />
      </Col>

      <Col xs={7}>
        {!qualitativeEatingPlanMeals.length ? (
          <div className="sh-35 d-flex align-items-center justify-content-center">
            <Empty message="Nenhuma refeição cadastrada" />
          </div>
        ) : (
          <ReactSortable
            list={qualitativeEatingPlanMeals as ItemInterface[]}
            setList={(mealsSorted) => setQualitativeEatingPlanMeals(mealsSorted as QualitativeEatingPlanMeal[])}
            handle=".drag-meal-icon"
            onChange={() => setSortableEnabled(true)}
            animation={300}
          >
            {qualitativeEatingPlanMeals.map((meal, index) => (
              <MealForm sortableEnabled={sortableEnabled} key={meal.id} meal={meal} index={index} />
            ))}
          </ReactSortable>
        )}
        <div className="mt-2 text-center gap-2">
          <AsyncButton isSaving={isAddingMeal} loadingText="Adicionando refeição, não feche a página..." type="button" onClickHandler={handleAddMeal}>
            <span>Adicionar refeição</span>
          </AsyncButton>
          <AsyncButton isSaving={isSaving} type="button" onClickHandler={handleSubmit} className="ms-2">
            <span>Salvar</span>
          </AsyncButton>
        </div>
      </Col>

      <DeleteTemplateConfirmationModal />
      <DeleteMealConfirmationModal />
      <FavoriteMealModal />
      <PhotoMealModal />
      <MealCommentModal />
      <ShoppingListModal />
      <OrientationModal />
      <SendPDFModal />
    </Row>
  );
};

export default QualitativeEatingPlan;
