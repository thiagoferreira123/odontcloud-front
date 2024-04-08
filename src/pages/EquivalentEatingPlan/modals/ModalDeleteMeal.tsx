import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import api from '/src/services/useAxios';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import { useModalsStore } from '../hooks/modalsStore';
import { useEquivalentEatingPlanStore } from '../hooks/equivalentEatingPlanStore';
import { removeMealNotification } from '/src/pages/ClassicEatingPlan/services/NotificationService';

const ModalDeleteMeal = (props: { show: boolean; onClose: () => void }) => {
  const selectedMeal = useModalsStore((state) => state.selectedMeal);
  const { removeMeal } = useEquivalentEatingPlanStore();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault();

    setIsLoading(true);

    try {
      props.onClose();

      if (selectedMeal) {
        removeMeal(selectedMeal);

        if (!selectedMeal.id) return;

        await api.delete(`/plano-alimentar-equivalente-refeicao/${selectedMeal.id}`);
        await removeMealNotification([selectedMeal.id], false);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      notify('Erro ao remover refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const notify = (message: string, title: string, icon: string, status?: string) =>
    toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmação de exclusão</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        Você realmente deseja excluir a refeição? Atenção: esta ação é irreversível.
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="d-flex justify-content-center mt-3">
            {isLoading ? (
              <Button type="button" variant="primary" className="mb-1 btn btn-primary" disabled>
                <span className="spinner-border spinner-border-sm"></span> Excluindo...
              </Button>
            ) : (
              <Button type="submit" variant="primary" className="mb-1 btn btn-primary">
                Confirmar e excluir
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDeleteMeal;
