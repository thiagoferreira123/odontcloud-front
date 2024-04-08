import { Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { useForumTopicFilterStore } from './hooks/ForumTopicFilterStore';
import CategorySelect from './CategorySelect';

export default function ForumTopicFilter() {
  const query = useForumTopicFilterStore((state) => state.query);
  const { setQuery } = useForumTopicFilterStore();

  return (
    <Row className="mb-3 g-2 ms-5">
      <Col className="mb-1">
        <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
          <Form.Control type="text" placeholder="Digite o nome do tópico" value={query} onChange={(e) => setQuery(e.target.value)} />
          <span className="search-magnifier-icon">
            <Icon.Search />
          </span>
          <span className="search-delete-icon d-none">
            <Icon.X />
          </span>
        </div>
      </Col>
      <Col xs="auto" className="mb-1">
        <OverlayTrigger placement="top" overlay={<Tooltip>Filtre os tópicos por categoria</Tooltip>}>
          <span>
            <CategorySelect />
          </span>
        </OverlayTrigger>
      </Col>
    </Row>
  );
}
