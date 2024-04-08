import { Button, Modal } from 'react-bootstrap';
import { useModalDayOffModalStore } from '../hooks/modals/ModalDayOffModalStore';

type Props = {
  isSaving: boolean;
  handleRefSubmit: () => void
};

export default function DayOffModal({ isSaving, handleRefSubmit }: Props) {
  const showModal = useModalDayOffModalStore((state) => state.showModal);
  const { hideModal } = useModalDayOffModalStore();

  if(!showModal) return null;

  return (
    <Modal className="fade modal-close-out" show={showModal}>
      <Modal.Header className="d-flex flex-column gap-3 text-center">
        <Modal.Title>Descansar é sempre bom!</Modal.Title>
        <span>Está sendo realizado um agendamento fora do seu horaŕio de trabalho. Devemos continuar?</span>
        <div className="d-flex align-items-center gap-2">
          <Button disabled={isSaving} onClick={hideModal}>
            Não
          </Button>
          <Button disabled={isSaving} variant="outline-primary" onClick={handleRefSubmit}>
            {isSaving || isSaving ? <span className="spinner-border spinner-border-sm"></span> : 'Sim'}
          </Button>
        </div>
      </Modal.Header>
    </Modal>
  );
}
