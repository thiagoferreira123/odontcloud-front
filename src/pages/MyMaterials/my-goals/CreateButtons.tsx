import { Button, Col } from 'react-bootstrap';
import { useGoalModalStore } from './hooks/GoalModalStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

export default function CreateButtons() {
  const { showGoalModal } = useGoalModalStore();

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={showGoalModal}>
        <CsLineIcons icon="check" /> <span>Cadastrar uma meta</span>
      </Button>
    </Col>
  );
}
