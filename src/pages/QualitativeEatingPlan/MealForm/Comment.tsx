import React from 'react';
import { Button } from 'react-bootstrap';
import { useQualitativeEatingPlanStore } from '../hooks/QualitativeEatingPlanStore';
import { notify } from '../../../components/toast/NotificationIcon';
import { QualitativeEatingPlanMeal } from '../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types';
import { htmlToPlainText } from '../../../helpers/InputHelpers';
import api from '../../../services/useAxios';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

type CommentProps = {
  meal: QualitativeEatingPlanMeal;
};

export default function Comment(props: CommentProps) {

  const { updateMeal } = useQualitativeEatingPlanStore();

  const handleRemoveMealComment = async () => {

    const payload = { comment: '' };

    try {
      updateMeal({ ...props.meal, ...payload });
      await api.patch('/plano-alimentar-qualitativo-refeicao/' + props.meal.id, payload);

      notify('Comentário removido com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      console.error(error);
      notify('Erro ao remover comentário', 'Erro', 'warning', 'danger');
    }

  }

  return (
    <div className={`position-relative ${!props.meal.comment ? 'd-none' : ''}`}>
      <div className="alert alert-light mt-2 text-berak" role="alert" style={{whiteSpace: 'break-spaces'}}>
        {htmlToPlainText(props.meal.comment)}
      </div>
      <Button className="position-absolute bottom-0 end-0 btn-icon btn-icon-only ms-1" size='sm' type="button" onClick={handleRemoveMealComment}>
        <CsLineIcons icon="bin" />
      </Button>
    </div>
  );
}
