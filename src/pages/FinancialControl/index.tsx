import { Nav, Tab } from 'react-bootstrap';
import HtmlHead from '../../components/html-head/HtmlHead';
import MonthlyPane from './MonthlyPane';
import YearlyPane from './YearlyPane';

export default function FinancialControl() {
  const title = 'Controle financeiro';

  return (
    <>
      <HtmlHead title={title} />
      {/* Title Start */}
      <div className="page-title-container">
        <h1 className="mb-0 pb-0 display-4">{title}</h1>
      </div>
      {/* Title End */}
      <Tab.Container defaultActiveKey="First">
        <Nav variant="tabs" className="nav-tabs-title nav-tabs-line-title" activeKey="First">
          <Nav.Item>
            <Nav.Link eventKey="First">Controle financeiro mensal</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Second">Fluxo de caixa anual</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="First">
            <MonthlyPane />
          </Tab.Pane>

          <Tab.Pane eventKey="Second">
            <YearlyPane />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </>
  );
}
