import { Button, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import useMetabolicTrackingStore from '../hooks';

export interface Sympton {
  id: number;
  category: string;
  symptom: string;
}

type SymptomProps = {
  symptom: Sympton;
};

export default function Symptom({ symptom }: SymptomProps) {

  const selectedSynptoms = useMetabolicTrackingStore(state => state.selectedSynptoms);

  const selectedSynptom = selectedSynptoms.find(s => s.id == symptom.id);

  const { handleChangeSymptomNumber } = useMetabolicTrackingStore();

  const handleSelectNumber = (number: number) => {
    handleChangeSymptomNumber({ id: symptom.id, rastreamento: symptom.category, number });
  }

  return (
    <Row className="border-bottom justify-content-between">
      <Col xl={6}>{symptom.symptom}</Col>
      <Col xl={6} className="d-flex justify-content-end">
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bin">Nunca ou quase nunca teve o sintoma</Tooltip>}>
          <Button variant={ selectedSynptom && selectedSynptom.number == 0 ? "primary" : "outline-primary"} className="mb-1 me-1" size="sm" onClick={() => handleSelectNumber(0)}>
            0
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bin">Ocasionalmente teve, efeito não foi severo</Tooltip>}>
          <Button variant={ selectedSynptom && selectedSynptom.number == 1 ? "primary" : "outline-primary"} className="mb-1 me-1" size="sm" onClick={() => handleSelectNumber(1)}>
            1
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bin">Ocasionalmente teve, efeito foi severo</Tooltip>}>
          <Button variant={ selectedSynptom && selectedSynptom.number == 2 ? "primary" : "outline-primary"} className="mb-1 me-1" size="sm" onClick={() => handleSelectNumber(2)}>
            2
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bin">Frequentemente teve, efeito não foi severo</Tooltip>}>
          <Button variant={ selectedSynptom && selectedSynptom.number == 3 ? "primary" : "outline-primary"} className="mb-1 me-1" size="sm" onClick={() => handleSelectNumber(3)}>
            3
          </Button>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bin">Frequentemente teve, efeito foi severo</Tooltip>}>
          <Button variant={ selectedSynptom && selectedSynptom.number == 4 ? "primary" : "outline-primary"} className="mb-1 me-1" size="sm" onClick={() => handleSelectNumber(4)}>
            4
          </Button>
        </OverlayTrigger>
      </Col>
    </Row>
  );
}
