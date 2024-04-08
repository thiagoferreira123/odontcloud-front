import AsyncButton from '/src/components/AsyncButton';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import SeparateFood from './SeparateFood';
import { useQuery } from '@tanstack/react-query';
import useFoods from '/src/hooks/useFoods';
import StaticLoading from '/src/components/loading/StaticLoading';
import { useModalsStore } from '/src/pages/EquivalentEatingPlan/hooks/modalsStore';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useEquivalentEatingPlanStore } from '/src/pages/EquivalentEatingPlan/hooks/equivalentEatingPlanStore';
import { EquivalentEatingPlanMealFood } from '/src/types/PlanoAlimentarEquivalente';
import api from '/src/services/useAxios';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';

type ModalSeparateFoodsProps = {
  show: boolean;
  onClose: () => void;
};

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

export default function ModalSeparateFoods(props: ModalSeparateFoodsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { getFoods } = useFoods();

  const selectedMeal = useModalsStore((state) => state.selectedMeal);

  const { updateMeal, updateMealMacros } = useEquivalentEatingPlanStore();
  const { addSelectedMealFood } = useModalsStore();

  const resultFood = useQuery({ queryKey: ['foods'], queryFn: getFoods });

  const handleAddSeparateFood = useCallback(() => {
    if (!selectedMeal) return console.error('selectedMeal is required');

    const payload: EquivalentEatingPlanMealFood = {
      id: btoa(Math.random().toString()).substring(0, 12),
      id_alimento: null,
      id_refeicao: selectedMeal.id,
      nome: '',
      quantidade: 1,
      medida_caseira: null,
      gramas: 0,
      kcal: 0,
      proteinas: 0,
      carboidratos: 0,
      lipideos: 0,
      grupo: '',
      is_avulso: 1,
      id_avulso: null,
      unidade: 1,
    };

    addSelectedMealFood(payload);
  }, [addSelectedMealFood, selectedMeal]);

  useEffect(() => {
    if (!selectedMeal) return;

    if (!selectedMeal.alimentos?.filter((food) => food.is_avulso).length) {
      handleAddSeparateFood();
    }
  }, [handleAddSeparateFood, selectedMeal]);

  if (resultFood.isLoading) {
    return (
      <Modal show={props.show} onHide={props.onClose} backdrop="static" className="modal-close-out" size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Área de edição da receita culinária</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <StaticLoading />
        </Modal.Body>
      </Modal>
    );
  }

  if (resultFood.isError) {
    return (
      <Modal show={props.show} onHide={props.onClose} backdrop="static" className="modal-close-out" size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Área de edição da receita culinária</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>Erro ao carregar o plano.</div>
        </Modal.Body>
      </Modal>
    );
  }

  const handleSubmit = async () => {
    setIsSaving(true);

    if (!validateFoods()) return setIsSaving(false);
    if (!selectedMeal) {
      setIsSaving(false);
      console.error('selectedMeal is required');
      return;
    }

    try {
      const { data } = await api.patch('/plano-alimentar-equivalente-refeicao/' + selectedMeal.id, { alimentos: selectedMeal.alimentos });

      updateMeal(data);
      updateMealMacros(selectedMeal);

      props.onClose();
      setIsSaving(false);
    } catch (error) {
      notify(`Ocorreu um desconhecido ao tentar salvar alimentos avulsos.`, 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const validateFoods = () => {
    const errors = [];

    if (!selectedMeal) {
      notify(`Ocorreu um desconhecido ao tentar salvar alimentos avulsos.`, 'Erro', 'close', 'danger');
      return false;
    }

    selectedMeal.alimentos
      .filter((food) => food.is_avulso)
      .forEach((food: EquivalentEatingPlanMealFood) => {
        if (food.medida_caseira == 'Selecione uma medida') {
          errors.push(food.id);
          notify(`O alimento ${food.nome} precisa conter uma medida caseira.`, 'Erro', 'close', 'danger');
        }

        if (!food.id_avulso) {
          errors.push(food.id);
          notify(`Alimento indefinido`, 'Erro', 'close', 'danger');
        }

        if (!food.nome) {
          errors.push(food.id);
          notify(`Alimento sem nome`, 'Erro', 'close', 'danger');
        }

        if (!food.grupo) {
          errors.push(food.id);
          notify(`Alimento sem grupo alimentar`, 'Erro', 'close', 'danger');
        }

        if (!food.id_refeicao) {
          errors.push(food.id);
          notify(`Alimento sem identificador de refeição`, 'Erro', 'close', 'danger');
        }

        if (!food.unidade) {
          errors.push(food.id);
          notify(`Alimento sem valor de unidade`, 'Erro', 'close', 'danger');
        }
      });

    return errors.length ? false : true;
  };

  return (
    <Modal show={props.show} onHide={props.onClose} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Alimentos avulsos</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {selectedMeal?.alimentos
          ?.filter((food) => food.is_avulso)
          .map((food: EquivalentEatingPlanMealFood) => {
            return <SeparateFood key={food.id} food={food} />;
          })}

        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add-separate-food">Adicionar alimento avulso.</Tooltip>}>
          <Button className="btn-icon btn-icon-only my-2 me-2" variant="outline-primary" type="button" size="sm" onClick={handleAddSeparateFood}>
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
