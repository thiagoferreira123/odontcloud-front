import { Button, Col } from 'react-bootstrap';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useConfigModalStore } from './hooks/ConfigModalStore';

export default function CreateButtons() {
  const { handleShowModal } = useConfigModalStore();

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={handleShowModal}>
        <CsLineIcons icon="check" /> <span>Cadastrar uma lista de conduta</span>
      </Button>
    </Col>
  );
}
