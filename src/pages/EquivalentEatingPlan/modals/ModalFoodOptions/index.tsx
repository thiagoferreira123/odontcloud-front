import AsyncButton from '/src/components/AsyncButton';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useEffect, useState } from 'react';
import { Col, Modal } from 'react-bootstrap';
import SearchReplacementFood from './SearchReplacementFood';
import { EquivalentEatingPlanMealFood, EquivalentEatingPlanMealReplacementFood } from '/src/types/PlanoAlimentarEquivalente';
import { useModalsStore } from '/src/pages/EquivalentEatingPlan/hooks/modalsStore';
import { ReplacementListFood } from '/src/types/Food';
import { useEquivalentEatingPlanStore } from '/src/pages/EquivalentEatingPlan/hooks/equivalentEatingPlanStore';
import api from '/src/services/useAxios';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import { notEmpty } from '/src/helpers/Utils';

type ModalFoodOptionsProps = {
  show: boolean;
  onClose: () => void;
};

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });

const defaultReplacementFoods: Array<EquivalentEatingPlanMealReplacementFood | null> = [null, null, null];

export default function ModalFoodOptions(props: ModalFoodOptionsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const [mainFood, setMainFood] = useState<EquivalentEatingPlanMealFood | null>(null);
  const [replacementFoods, setReplacementFoods] = useState<Array<EquivalentEatingPlanMealReplacementFood | null>>(defaultReplacementFoods);

  const selectedFood = useModalsStore((state) => state.selectedFood);
  const selectedMeal = useModalsStore((state) => state.selectedMeal);

  const { updateMealFood, updateMeal, updateMealMacros } = useEquivalentEatingPlanStore();

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      if (!selectedMeal) throw Error('Selected Meal is not defined');
      if (!mainFood || !selectedFood) throw Error('Main food is not defined');
      if (!selectedFood.id_refeicao) throw Error('Main food meal is not defined');

      await api.patch(`/plano-alimentar-equivalente-refeicao-alimento/update/${mainFood.id}`, mainFood);

      const newReplacementFoods: EquivalentEatingPlanMealReplacementFood[] = [];

      if (replacementFoods.length) {
        for (const food of replacementFoods) {
          if (!food) continue;

          const existent = selectedMeal.alimentosSubstitutos.find(
            (f) => f.posicao === replacementFoods.indexOf(food) && f.grupoAlimentoSubstituto === selectedFood.grupo
          );

          const payload: EquivalentEatingPlanMealReplacementFood = {
            id: existent ? existent.id : undefined,
            idRefeicao: selectedFood.id_refeicao,
            idAlimentoSubstituto: food.idAlimentoSubstituto,
            grupoAlimentoSubstituto: selectedFood.grupo,
            posicao: replacementFoods.indexOf(food),
          };

          if (payload.id) {
            await api.put('/plano-alimentar-equivalente-refeicao-alimento-substituto/' + payload.id, payload);
          } else {
            const { data } = await api.post('/plano-alimentar-equivalente-refeicao-alimento-substituto', payload);

            newReplacementFoods.push(data);
          }
        }

        setReplacementFoods(
          replacementFoods.map((item, index) => {
            if (newReplacementFoods[index]) {
              return newReplacementFoods[index];
            } else return item;
          })
        );

        updateMealMacros(selectedMeal);
        updateMeal({
          id: selectedMeal.id,
          alimentosSubstitutos: [
            ...selectedMeal.alimentosSubstitutos.filter((food) => !newReplacementFoods.find((f) => f && f.id === food.id)),
            ...newReplacementFoods.filter(notEmpty),
          ],
        });
      }

      notify('Alimento atualizado com sucesso', 'Sucesso', 'check', 'success');

      setIsSaving(false);
      props.onClose();
    } catch (error) {
      notify('Erro ao atualizar o alimento', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleSelectMainFood = (food: ReplacementListFood) => {
    if (!mainFood) return console.error('Main food is not defined');

    const payload: EquivalentEatingPlanMealFood = {
      ...mainFood,
      id_alimento: food.id,
      nome: food.descricao_dos_alimentos,
      medida_caseira: food.medidas_caseiras,
      gramas: Number(food.unidade) * mainFood.quantidade * Number(food.gramas),
      kcal: Number(food.energia) * mainFood.quantidade,
      proteinas: Number(food.proteina) * mainFood.quantidade,
      carboidratos: Number(food.carboidrato) * mainFood.quantidade,
      lipideos: Number(food.lipideos) * mainFood.quantidade,
      is_avulso: 0,
      id_avulso: null,
      unidade: Number(food.unidade),
    };

    setMainFood(payload);
    updateMealFood(payload);
  };

  const handleSelectReplacementFood = (food: ReplacementListFood, index: number) => {
    if (!mainFood) return console.error('Main food is not defined');
    if (!mainFood.id) return console.error('Main food is not defined');
    if (!mainFood.id_refeicao) return console.error('Main food is not defined');

    setReplacementFoods(
      replacementFoods.map((item, itemIndex) => {
        if (itemIndex === index) {
          const payload: EquivalentEatingPlanMealReplacementFood = {
            idRefeicao: mainFood.id_refeicao ?? 0,
            idAlimentoSubstituto: food.id,
            grupoAlimentoSubstituto: mainFood.grupo,
            posicao: itemIndex,
          };

          return payload;
        } else return item;
      })
    );
  };

  useEffect(() => {
    if (!selectedMeal) return;

    setMainFood(selectedFood);

    const newReplacementFoods: Array<EquivalentEatingPlanMealReplacementFood | null> = selectedMeal?.alimentosSubstitutos.filter(
      (f) => f.grupoAlimentoSubstituto === selectedFood?.grupo
    );

    setReplacementFoods(defaultReplacementFoods.map((item, index) => newReplacementFoods[index] ?? item));
  }, [selectedMeal, selectedFood]);

  return (
    <Modal show={props.show} onHide={props.onClose} backdrop="static" className="modal-close-out" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Acrescente 3 opções de substitutos do mesmo grupo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Col md={12} className="mb-3">
          <label>Alimento Principal</label>
          <SearchReplacementFood food={mainFood} onSelectFood={handleSelectMainFood} />
        </Col>
        <Col md={12} className="mb-3">
          <label>1° alimento substituto</label>
          <SearchReplacementFood food={replacementFoods[0] ?? null} onSelectFood={(food) => handleSelectReplacementFood(food, 0)} />
        </Col>
        <Col md={12} className="mb-3">
          <label>2° alimento substituto</label>
          <SearchReplacementFood food={replacementFoods[1] ?? null} onSelectFood={(food) => handleSelectReplacementFood(food, 1)} />
        </Col>
        <Col md={12}>
          <label>3° alimento substituto</label>
          <SearchReplacementFood food={replacementFoods[2] ?? null} onSelectFood={(food) => handleSelectReplacementFood(food, 2)} />
        </Col>
      </Modal.Body>

      <div className="mdsa-footer-message mx-5 mt-0">
        <CsLineIcons icon="info-hexagon" />
        <span>
          Os alimentos substitutos aparecerão em um PDF separado. Não se preocupe, as quantidades serão calculadas automáticamente e seu paciente não precisará
          multiplicar as porções
        </span>
      </div>

      <Modal.Footer>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
          Salvar alterações
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
}
