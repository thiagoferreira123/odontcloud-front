import React from 'react';
import { Col, Dropdown, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { usePatientListFilterStore } from './hooks/PatientListFilterStore';

export default function PatientListFilter() {
  const query = usePatientListFilterStore((state) => state.query);
  const { setQuery } = usePatientListFilterStore();

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
    </Row>
  );
}
