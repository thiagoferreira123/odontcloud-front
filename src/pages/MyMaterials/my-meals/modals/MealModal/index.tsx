import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Food from './Food';
import { useQuery } from '@tanstack/react-query';
import { useModalStore } from '../../hooks/modalStore';
import MacrosLabel from './MacrosLabel';
import TotalValuesMacros from './TotalValuesMacros';
import { useMealStore } from '../../hooks/mealStore';
import useFoods from '../../../../../hooks/useFoods';
import { ClassicPlanMealTemplateFood } from '../../../../../types/PlanoAlimentarClassico';
import api from '../../../../../services/useAxios';
import { notify } from '../../../../../components/toast/NotificationIcon';
import StaticLoading from '../../../../../components/loading/StaticLoading';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../../../components/AsyncButton';

export default function MealModal() {
  const [isSaving, setIsSaving] = useState(false);

  const selectedMeal = useModalStore((state) => state.selectedMeal);
  const showModalModal = useModalStore((state) => state.showModalModal);

  const { getFoods } = useFoods();
  const { addSelectedMealFood, setShowMealModal, buildMealMacros } = useModalStore();
  const { updateMeal, addMeal } = useMealStore();

  const resultFood = useQuery({ queryKey: ['foods'], queryFn: getFoods });

  const handleAddFood = useCallback(() => {
    if (!selectedMeal) return console.error('selectedMeal is required');

    const payload: ClassicPlanMealTemplateFood = {
      id: btoa(Math.random().toString()).substring(0, 12),
      id_refeicao: selectedMeal.id,
      gramas: 0,
      quantidade_medida: 1,
      ordens: { posicao: selectedMeal.alimentos.length + 1 },
      tabela: '',
      id_alimento: 0,
      medida_caseira: '',
      nome: '',
      apelido_medida_caseira: '',
      alimentoequivalentes: [],
    };

    addSelectedMealFood(payload);
  }, [addSelectedMealFood, selectedMeal]);

  const handleSubmit = async () => {
    setIsSaving(true);

    if (!validateFoods()) return setIsSaving(false);
    if (!selectedMeal) {
      setIsSaving(false);
      console.error('selectedMeal is required');
      return;
    }

    try {
      if(selectedMeal.id) {
        await api.patch('/plano-alimentar-classico-refeicao-modelo/' + selectedMeal.id, {...selectedMeal, substituicoes: undefined});

        updateMeal(selectedMeal);
      } else {
        const { data } = await api.post('/plano-alimentar-classico-refeicao-modelo', {...selectedMeal, substituicoes: undefined});

        addMeal(data);
      }

      setShowMealModal(false);
      setIsSaving(false);

      notify(`Refeição salva com sucesso.`, 'Sucesso', 'checkmark', 'success');
    } catch (error) {
      notify(`Ocorreu um desconhecido ao tentar salvar refeição.`, 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const validateFoods = () => {
    const errors = [];

    if (!selectedMeal) {
      notify(`Ocorreu um desconhecido ao tentar salvar refeição.`, 'Erro', 'close', 'danger');
      return false;
    }

    selectedMeal.alimentos.forEach((food: ClassicPlanMealTemplateFood) => {
      if (food.medida_caseira == 'Selecione uma medida') {
        errors.push(food.id);
        notify(`O alimento ${food.nome} precisa conter uma medida caseira.`, 'Erro', 'close', 'danger');
      }

      if (!food.nome) {
        errors.push(food.id);
        notify(`Alimento sem nome`, 'Erro', 'close', 'danger');
      }

      if (!food.id_alimento) {
        errors.push(food.id);
        notify(`Alimento sem identificador`, 'Erro', 'close', 'danger');
      }

      if (!food.ordens) {
        errors.push(food.id);
        notify(`Alimento sem ordem`, 'Erro', 'close', 'danger');
      }

      if (!food.tabela) {
        errors.push(food.id);
        notify(`Alimento sem grupo alimentar`, 'Erro', 'close', 'danger');
      }

      if (!food.quantidade_medida) {
        errors.push(food.id);
        notify(`Alimento sem valor de quantidade`, 'Erro', 'close', 'danger');
      }
    });

    return errors.length ? false : true;
  };

  useEffect(() => {
    if (!selectedMeal) return;

    if (!selectedMeal.alimentos?.length) {
      handleAddFood();
    }
  }, [handleAddFood, selectedMeal]);

  useEffect(() => {
    buildMealMacros();
  }, [buildMealMacros, selectedMeal?.id]);

  if (resultFood.isLoading) {
    return (
      <Modal show={showModalModal} onHide={() => setShowMealModal(false)} backdrop="static" className="modal-close-out" size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Área de edição da refeição</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <StaticLoading />
        </Modal.Body>
      </Modal>
    );
  }

  if (resultFood.isError) {
    return (
      <Modal show={showModalModal} onHide={() => setShowMealModal(false)} backdrop="static" className="modal-close-out" size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Área de edição da refeição</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>Erro ao carregar refeição.</div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={showModalModal} onHide={() => setShowMealModal(false)} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Cadastre uma refeição inserindo alimentos</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <MacrosLabel />

        {!selectedMeal?.alimentos.length
          ? null
          : selectedMeal?.alimentos.map((food: ClassicPlanMealTemplateFood) => {
              return <Food key={food.id} food={food} />;
            })}

        <TotalValuesMacros />

        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add-separate-food">Adicionar alimento.</Tooltip>}>
          <Button className="btn-icon btn-icon-only my-2 me-2" variant="outline-primary" type="button" size="sm" onClick={handleAddFood}>
            <CsLineIcons icon="plus" />
          </Button>
        </OverlayTrigger>
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
          Salvar alterações
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
}
