import { Button, Col } from 'react-bootstrap';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

interface CreateButtonsProps {
  className?: string;

  handleEditPlanConfig: () => void;
  setShowModalTemplates: (value: boolean) => void;
}

export default function CreateButtons(props: CreateButtonsProps) {
  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => props.handleEditPlanConfig()}>
        <CsLineIcons icon="check" /> <span>Criar um plano alimentar</span>
      </Button>
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => props.setShowModalTemplates(true)}>
        <CsLineIcons icon="check" /> <span>Usar modelo pronto</span>
      </Button>
    </Col>
  );
}
