import React from 'react';
import { Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import PersonalData from './PersonalData';
import ServiceLocation from './ServiceLocation';
import Secretary from './Secretary/Secretary';
import SignatureIimage from './SignatureIimage';
import Password from './Password';
import { useAuth } from '../Auth/Login/hook';

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
                <div className="d-flex align-items-center flex-column mb-4">
                  <div className="d-flex align-items-center flex-column">
                    <div className="sw-13 position-relative mb-3">
                      <img src={user?.image ? user.image : '/img/profile/profile-11.webp'} className="img-fluid rounded-xl sh-13 sw-13" alt="thumb" />
                    </div>
                    <div className="h5 mb-0">{user?.nome_completo}</div>
                    <div className="text-muted">{user?.especialidades}</div>
                  </div>
                </div>
                <Nav className="flex-column" activeKey="personal-data">
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="personal-data">
                    <CsLineIcons icon="user" className="me-2" size={17} />
                    <span className="align-middle">Dados cadastrais</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="password">
                    <CsLineIcons icon="lock-off" className="me-2" size={17} />
                    <span className="align-middle">Alterar senha</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="servicelocation">
                    <CsLineIcons icon="pin" className="me-2" size={17} />
                    <span className="align-middle">Locais de atendimento</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="secretary">
                    <CsLineIcons icon="calendar" className="me-2" size={17} />
                    <span className="align-middle">Acessos a minha agenda</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="signatureimage">
                    <CsLineIcons icon="file-image" className="me-2" size={17} />
                    <span className="align-middle">Imagem da assinatura</span>
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

              <Tab.Pane eventKey="servicelocation">
                <Card>
                  <Card.Body className="mb-n2">
                    <ServiceLocation />
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="secretary">
                <Card>
                  <Card.Body className="mb-n2">
                    <Secretary />
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
            </Tab.Content>
          </Col>
          {/* Content End */}
        </Tab.Container>
      </Row>
    </>
  );
};

export default ProfileStandard;
