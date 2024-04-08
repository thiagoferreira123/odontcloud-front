import React from 'react';
import { Col, Dropdown, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { usePatientListFilterStore } from './hooks/PatientListFilterStore';

export default function PatientListFilter() {
  const query = usePatientListFilterStore((state) => state.query);
  const category = usePatientListFilterStore((state) => state.category);
  const { setQuery, setCategory } = usePatientListFilterStore();

  return (
    <Row className="mb-3 g-2">
      <Col className="mb-1">
        <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
          <Form.Control type="text" placeholder="Digite o nome do paciente" value={query} onChange={(e) => setQuery(e.target.value)} />
          <span className="search-magnifier-icon">
            <Icon.Search/>
          </span>
          <span className="search-delete-icon d-none">
          <Icon.X/>
          </span>
        </div>
      </Col>
      <Col xs="auto" className="text-end mb-1">
        <OverlayTrigger placement="top" overlay={<Tooltip>Filtre os pacientes</Tooltip>}>
          <Dropdown align={{ xs: 'end' }} className="d-inline-block ms-1">
            <Dropdown.Toggle variant="foreground-alternate" className="shadow sw-13">
              {category.length > 6 ? `${category.slice(0, 6)}...` : category}
            </Dropdown.Toggle>
            <Dropdown.Menu
              className="shadow dropdown-menu-end"
              popperConfig={{
                modifiers: [
                  {
                    name: 'computeStyles',
                    options: {
                      gpuAcceleration: false,
                    },
                  },
                ],
              }}
            >
              <Dropdown.Item href="#/action-1" className={category === 'Todos' ? 'active' : undefined} onClick={() => setCategory('Todos')}>
                Todos
              </Dropdown.Item>
              <Dropdown.Item href="#/action-2" className={category === 'Ativos' ? 'active' : undefined} onClick={() => setCategory('Ativos')}>
                Ativos
              </Dropdown.Item>
              <Dropdown.Item href="#/action-3" className={category === 'Inativos' ? 'active' : undefined} onClick={() => setCategory('Inativos')}>
                Inativos
              </Dropdown.Item>
              <Dropdown.Item href="#/action-4" className={category === 'Com pedências' ? 'active' : undefined} onClick={() => setCategory('Com pedências')}>
                Com pedências
              </Dropdown.Item>
              <Dropdown.Item href="#/action-4" className={category === 'Sem pedências' ? 'active' : undefined} onClick={() => setCategory('Sem pedências')}>
                Sem pedências
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </OverlayTrigger>
      </Col>
    </Row>
  );
}
