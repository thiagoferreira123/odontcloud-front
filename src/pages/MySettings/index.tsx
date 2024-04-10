import React from 'react';
import { Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import PersonalData from './PersonalData';
import SignatureIimage from './SignatureIimage';
import Password from './Password';
import { useAuth } from '../Auth/Login/hook';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import Professionals from './Professionals';
import ClinicProcedures from './ClinicProcedures';
import ClinicAnamnesis from './ClinicAnamnesis';

const ProfileStandard = () => {
  const user = useAuth((state) => state.user);

  return (
    <>
      <Row className="g-5">
        <Tab.Container id="profileStandard" defaultActiveKey="personal-data">
          {/* Sidebar*/}
          <Col xl="4" xxl="3">
            <Card className="mb-5">
              <Card.Body>
                <Nav className="flex-column" activeKey="personal-data">
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="personal-data">
                    <CsLineIcons icon="user" className="me-2" size={17} />
                    <span className="align-middle">Dados cadastrais</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="password">
                    <CsLineIcons icon="lock-off" className="me-2" size={17} />
                    <span className="align-middle">Alterar senha</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="signatureimage">
                    <CsLineIcons icon="file-image" className="me-2" size={17} />
                    <span className="align-middle">Imagem da assinatura</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="professionals">
                    <CsLineIcons icon="file-image" className="me-2" size={17} />
                    <span className="align-middle">Profissionais</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="ClinicProcedures">
                    <CsLineIcons icon="file-image" className="me-2" size={17} />
                    <span className="align-middle">Procedimentos da clínica</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="ClinicAnamnesis">
                    <CsLineIcons icon="file-image" className="me-2" size={17} />
                    <span className="align-middle">Anamneses da clínica</span>
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          {/* Sidebar */}

          {/* Content Start */}
          <Col xl="8" xxl="9">
            <Tab.Content>
              <Tab.Pane eventKey="personal-data">
                <Card>
                  <Card.Body className="mb-n2">
                    <PersonalData />
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="password">
                <Card>
                  <Card.Body className="mb-n2">
                    <Password />
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="signatureimage">
                <Card>
                  <Card.Body className="mb-n2">
                    <SignatureIimage />
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="professionals">
                <Card>
                  <Card.Body className="mb-n2">
                    <Professionals />
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="ClinicProcedures">
                <Card>
                  <Card.Body className="mb-n2">
                    <ClinicProcedures />
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="ClinicAnamnesis">
                <Card>
                  <Card.Body className="mb-n2">
                    <ClinicAnamnesis />
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
          {/* Content End */}
        </Tab.Container>
      </Row>
    </>
  );
};

export default ProfileStandard;
