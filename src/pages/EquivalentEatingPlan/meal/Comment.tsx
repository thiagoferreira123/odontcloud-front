import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useEquivalentEatingPlanStore } from '../hooks/equivalentEatingPlanStore';
import { EquivalentEatingPlanMeal } from '/src/types/PlanoAlimentarEquivalente';
import api from '/src/services/useAxios';
import { notify } from '../../../components/toast/NotificationIcon';
import { htmlToPlainText } from '../../../helpers/InputHelpers';

type CommentProps = {
  meal: EquivalentEatingPlanMeal;
};

export default function Comment(props: CommentProps) {

  const { updateMeal } = useEquivalentEatingPlanStore();

  const handleRemoveMealComment = async () => {

    const payload = { comentario: '' };

    try {
      updateMeal({ ...props.meal, ...payload });
      await api.patch('/plano-alimentar-equivalente-refeicao/' + props.meal.id, payload);

      notify('Comentário removido com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      console.error(error);
      notify('Erro ao remover comentário', 'Erro', 'warning', 'danger');
    }

  }

  return (
    <div className={`position-relative ${!props.meal.comentario ? 'd-none' : ''}`}>
      <div className="alert alert-info mt-4 text-berak" role="alert" style={{whiteSpace: 'break-spaces'}}>
        {htmlToPlainText(props.meal.comentario)}
      </div>
      <Button className="position-absolute bottom-0 end-0 btn-icon btn-icon-only ms-1" size='sm' type="button" onClick={handleRemoveMealComment}>
        <CsLineIcons icon="bin" />
      </Button>
    </div>
  );
}
