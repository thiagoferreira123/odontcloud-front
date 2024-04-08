import React, { useState } from 'react';
import { Modal, Nav, Tab } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useEditReciptStore } from '../../hooks/EditRecipeStore';
import { useParams } from 'react-router-dom';

import { RecipeHistoryRecipeFood } from '/src/types/ReceitaCulinaria';
import AsyncButton from '/src/components/AsyncButton';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import api from '/src/services/useAxios';
import ResponsiveNav from '/src/components/ResponsiveNav';
import Ingredients from './Ingredients';
import { useRecipeStore } from '/src/pages/Recipe/hooks/RecipeStore';
import StepsOfPreparation from './StepsOfPreparation';
import Details from './Details';
import Portioning from './Portioning';
import { calculatePortionCalciumByWeigth, calculatePortionCaloriesByWeigth, calculatePortionCarbohydrateByWeigth, calculatePortionCholesterolByWeigth, calculatePortionFiberByWeigth, calculatePortionLipidByWeigth, calculatePortionProteinByWeigth, calculatePortionSaturatedFattyAcidsByWeigth, calculatePortionSodiumByWeigth } from '../ModalAddRecipe/panes/Ingredients/utils/MathHelper';

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

const ModalEditRecipe = () => {
  const [isSaving, setIsSaving] = useState(false);

  const { id } = useParams<{ id: string }>();

  const showModal = useEditReciptStore((state) => state.showModal);
  const selectedRecipe = useEditReciptStore((state) => state.selectedRecipe);

  const { hideModal } = useEditReciptStore();
  const { updatePrescriptionRecipe } = useRecipeStore();

  const onSubmit = async () => {
    try {
      setIsSaving(true);

      if (!selectedRecipe) throw new Error('selectedRecipe is required');
      if (!validateIngredients()) return setIsSaving(false);

      let savedRecipe;

      const recipePortionWeight = selectedRecipe.peso_receita / selectedRecipe.quantidade_porcao;

      const nutrients = {
        carboidratos_por_porcao: calculatePortionCarbohydrateByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, recipePortionWeight).toFixed(1),
        carboidratos_por_cem_gramas: calculatePortionCarbohydrateByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, 100).toFixed(1),

        proteinas_por_porcao: calculatePortionProteinByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, recipePortionWeight).toFixed(1),
        proteinas_por_cem_gramas: calculatePortionProteinByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, 100).toFixed(1),

        lipideos_por_porcao: calculatePortionLipidByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, recipePortionWeight).toFixed(1),
        lipideos_por_cem_gramas: calculatePortionLipidByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, 100).toFixed(1),

        calorias_por_porcao: calculatePortionCaloriesByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, recipePortionWeight).toFixed(1),
        calorias_por_cem_gramas: calculatePortionCaloriesByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, 100).toFixed(1),

        fibras_por_porcao: calculatePortionFiberByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, recipePortionWeight).toFixed(1),
        fibras_por_cem_gramas: calculatePortionFiberByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, 100).toFixed(1),

        calcio_por_porcao: calculatePortionCalciumByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, recipePortionWeight).toFixed(1),
        calcio_por_cem_gramas: calculatePortionCalciumByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, 100).toFixed(1),

        sodio_por_porcao: calculatePortionSodiumByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, recipePortionWeight).toFixed(1),
        sodio_por_cem_gramas: calculatePortionSodiumByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, 100).toFixed(1),

        acidos_graxos_saturados_por_porcao: calculatePortionSaturatedFattyAcidsByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, recipePortionWeight).toFixed(1),
        acidos_graxos_saturados_por_cem_gramas: calculatePortionSaturatedFattyAcidsByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, 100).toFixed(1),

        colesterol_por_porcao: calculatePortionCholesterolByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, recipePortionWeight).toFixed(1),
        colesterol_por_cem_gramas: calculatePortionCholesterolByWeigth(selectedRecipe.peso_receita, selectedRecipe.alimentos, 100).toFixed(1),
      }

      if (selectedRecipe.id && typeof selectedRecipe.id === 'number') {
        const { data } = await api.put(
          '/receita-culinaria-historico-paciente/' + selectedRecipe.id,
          {
            ...selectedRecipe,
            ...nutrients,
            preparos: selectedRecipe.preparos.map(
              (preparation) => ({ ...preparation, id: typeof preparation.id === 'string' ? undefined : preparation.id})
            )
          }
        );

        savedRecipe = data;
      } else {
        const { data } = await api.post('/receita-culinaria-historico-paciente/', {
          ...selectedRecipe,
          ...nutrients,
          preparos: selectedRecipe.preparos.map(
            (preparation) => ({ ...preparation, id: typeof preparation.id === 'string' ? undefined : preparation.id})
          ),
          alimentos: selectedRecipe.alimentos.map(
            (food) => ({ ...food, id: typeof food.id === 'string' ? undefined : food.id})
          ),
          id: undefined,
          id_prescricao: Number(id),
        });

        savedRecipe = data;
      }

      updatePrescriptionRecipe(savedRecipe, selectedRecipe.id);

      setIsSaving(false);

      hideModal();
      window.localStorage.setItem('prescription', '');
    } catch (error) {
      notify('Ocorreu um erro ao tentar salvar receita', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const validateIngredients = () => {
    if (!selectedRecipe) return false;

    const errors = [];

    selectedRecipe.alimentos.forEach((food: RecipeHistoryRecipeFood) => {
      if (food.medida_caseira == 'Selecione uma medida') {
        errors.push(food.id);
        notify(`Alimento ${food.nome} sem medida caseira`, 'Erro', 'close', 'danger');
      }

      if (!food.id_alimento) {
        errors.push(food.id);
        notify(`Alimento indefinido`, 'Erro', 'close', 'danger');
      }

      if (!food.nome) {
        errors.push(food.id);
        notify(`Alimento sem nome`, 'Erro', 'close', 'danger');
      }

      if (!food.tabela) {
        errors.push(food.id);
        notify(`Alimento sem tabela`, 'Erro', 'close', 'danger');
      }
    });

    return errors.length ? false : true;
  };

  return (
    <Modal className="modal-close-out" size="xl" backdrop="static"   show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Editar receita culinária</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="Ingredients">
          <Nav variant="tabs" className="nav-tabs-title nav-tabs-line-title" activeKey="Ingredients" as={ResponsiveNav}>
            <Nav.Item>
              <Nav.Link eventKey="Ingredients">Ingredientes</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="StepsOfPreparation">Modo de preparo</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Details">Detalhes da receita</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Portioning">Porcionamento</Nav.Link>
            </Nav.Item>
          </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="Ingredients">
                <Ingredients />
              </Tab.Pane>
              <Tab.Pane eventKey="StepsOfPreparation">
                <StepsOfPreparation />
              </Tab.Pane>
              <Tab.Pane eventKey="Details">
                <Details />
              </Tab.Pane>
              <Tab.Pane eventKey="Portioning">
                <Portioning />
              </Tab.Pane>
            </Tab.Content>
        </Tab.Container>

        <div className="d-flex justify-content-end">
          <AsyncButton isSaving={isSaving} onClickHandler={onSubmit}>
            Salvar
          </AsyncButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEditRecipe;
