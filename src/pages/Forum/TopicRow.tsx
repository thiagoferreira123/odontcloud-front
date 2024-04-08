import { Badge, Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { appRoot } from '../../routes';
import { ListChildComponentProps } from 'react-window';
import { ForumTopic } from './hooks/ForumTopicStore/types';

export default function TopicRow({ data, index, style }: ListChildComponentProps<(ForumTopic & { id: number })[]>) {
  const topic = data[index];

  return (
    <Row className="g-0" key={topic.id} style={style}>
      <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
        {index ? (
          <div className="w-100 d-flex sh-14 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        ) : (
          <div className="w-100 d-flex sh-14" />
        )}
        <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
          <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
        </div>
        {index >= data.length - 1 ? (
          <div className="w-100 d-flex h-100" />
        ) : (
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        )}
      </Col>

      <Col className="mb-2">
        <Card className="h-100">
          <Card.Body>
            <div>
              <Row className="g-0 2">
                <Col xs="auto">
                  <img
                    src={topic.professional?.image ? topic.professional.image : '/img/profile/profile-1.webp'}
                    className="card-img rounded-xl sh-6 sw-6"
                    alt="thumb"
                  />
                </Col>
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>
                        {' '}
                        <h5 className="text-alternate">{topic.titulo}</h5>
                      </div>
                      <div className="text-medium text-muted">Criado por: {topic.professional?.nome_completo ?? 'Desconhecido'}</div>
                      <div className="mb-2">
                        {' '}
                        {topic.tags.map((tag) => (
                          <Badge className='me-1' key={tag.id}>{tag.nome}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="d-flex">
                      <Link className="ms-1 btn btn-sm btn-primary" to={`${appRoot}/ferramentas/forum/${topic.id}`}>
                        Visualizar tópico
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
