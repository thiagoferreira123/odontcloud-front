import { Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { useFiltersStore } from './hooks/FiltersStore';
import StatusSelect from './StatusSelect';
import Select from 'react-select';
import { monthOptions } from '../../helpers/DateHelper';
import { Option } from '../../types/inputs';

const years = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear();
  return { value: (year - i).toString(), label: `${year - i}` };
});

export default function Filters() {
  const query = useFiltersStore((state) => state.query);
  const selectedMonth = useFiltersStore((state) => state.selectedMonth);
  const selectedYear = useFiltersStore((state) => state.selectedYear);
  const { setSelectMonth, setSelectYear } = useFiltersStore();
  const { setQuery } = useFiltersStore();

  return (
    <Row className="mb-3 g-2">
      <Col sm={12} md="2" className="mb-1">
        <Select classNamePrefix="react-select" options={monthOptions} value={selectedMonth} onChange={(e) => setSelectMonth(e as Option)} placeholder="" />
      </Col>
      <Col sm={12} md="2" className="mb-1">
        <Select classNamePrefix="react-select" options={years} value={selectedYear} onChange={(e) => setSelectYear(e as Option)} placeholder="" />
      </Col>
      <Col className="mb-1">
        {/* <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground"> */}
        <div className="w-100 w-md-auto search-input-container border border-separator">
          <Form.Control type="text" placeholder="Digite o nome do paciente" value={query} onChange={(e) => setQuery(e.target.value)} />
          <span className="search-magnifier-icon">
            <Icon.Search />
          </span>
          <span className="search-delete-icon d-none">
            <Icon.X />
          </span>
        </div>
      </Col>
      <Col xs="auto" className="mb-1">
        <OverlayTrigger placement="top" overlay={<Tooltip>Filtre os pacientes</Tooltip>}>
          <span>
            <StatusSelect />
          </span>
        </OverlayTrigger>
      </Col>
    </Row>
  );
}
