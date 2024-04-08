import { Accordion, Card, Col, Row } from 'react-bootstrap';
import Material from './Material';
import { MaterialItemProps } from '../classic-eating-plan';
import * as Icon from 'react-bootstrap-icons';

export default function Recipes({ materials, index }: MaterialItemProps) {
  return (
    <Row className="g-0">
      <Col xs="auto" className="sw-7 d-flex flex-column justify-content-center align-items-center position-relative me-4">
        {index ? (
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        ) : null}
        <div className="bg-foreground sw-7 sh-7 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center mt-n2">
          <div className="bg-gradient-light sw-5 sh-5 rounded-xl">
            <div className="text-white d-flex justify-content-center align-items-center h-100">
                 <Icon.JournalBookmark size={20} />
            </div>
          </div>
        </div>
        <div className="w-100 d-flex h-100 justify-content-center position-relative">
          <div className="line-w-1 bg-separator h-100 position-absolute" />
        </div>
      </Col>
      <Col className="mb-2">
        <Card className="h-100">
          <Card.Body className="d-flex flex-column justify-content-start">
            {materials
              .filter((material) => material.material === 'receitas')
              .map((material) => (
                <Material key={material.tabela + material.id} material={material} />
              ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
