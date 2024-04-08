import { Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { NavLink, Outlet, useParams } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import { LAYOUT } from '../../constants';
import useCustomLayout from '../../hooks/useCustomLayout';
import { useAuth } from '../Auth/Login/hook';
import useMyMaterialsStore from './hooks/MyMaterialsStore';
import HtmlHead from '../../components/html-head/HtmlHead';
import Empty from '../../components/Empty';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import SearchInput from './SearchInput';
const navItems = [
  { to: 'meus-anexos', text: 'Anexo de materiais' },
  { to: 'meus-planos-alimentares', text: 'Planos clássicos' },
  { to: 'minhas-refeicoes', text: 'Refeições clássicas' },
  { to: 'meus-alimentos', text: 'Alimentos clássico' },
  { to: 'minhas-refeicoes-qualitativas', text: 'Refeições qualitativas' },
  { to: 'meus-alimentos-equivalentes', text: 'Alimentos equivalentes' },
  { to: 'minhas-listas-de-substituicao', text: 'Listas de substituições' },
  { to: 'meus-comentarios', text: 'Comentário de refeições' },
  { to: 'minhas-orientacoes', text: 'Orientações' },
  { to: 'minhas-receitas', text: 'Receitas culinárias' },
  { to: 'meus-exames', text: 'Exames sanguineos' },
  { to: 'minhas-formulas-manipuladas', text: 'Fórmulas manipuladas' },
  { to: 'minhas-anamneses', text: 'Anamneses' },
  { to: 'minhas-metas', text: 'Metas' },
  { to: 'minhas-listas-de-conduta', text: 'Listas de conduta' },
];

const ProfileStandard = () => {
  const user = useAuth((state) => state.user);

  const query = useMyMaterialsStore((state) => state.query);
  const { setQuery } = useMyMaterialsStore();

  const title = 'Meus materiais';
  const description = 'Meus materiais';

  useCustomLayout({ layout: LAYOUT.Boxed });

  const filteredNavItems = navItems.filter((item) =>
    item.text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .includes(
        query
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      )
  );

  return (
    <>
      <HtmlHead title={title} description={description} />

      <Row className="g-5">
        <Tab.Container id="profileStandard" defaultActiveKey="classic-eating-plan">
          <Col xl="4" xxl="3">
            <Card className="mb-5">
              <Card.Body>
                <div className="d-flex align-items-center flex-column mb-4">
                  <div className="d-flex align-items-center flex-column">
                    <div className="sw-13 position-relative mb-3">
                      <img src={user?.image ? user?.image : '/img/profile/profile-1.webp'} className="img-fluid rounded-xl avatar" alt="thumb" />
                    </div>
                    <div className="h5 mb-0">{user?.nome_completo}</div>
                    <div className="text-muted">{user?.especialidades}</div>
                  </div>
                </div>

                <div className="mb-3 mt-3">
                  <div className="w-100 w-md-auto search-input-container border border-separator mt-3">
                    <SearchInput />
                  </div>
                </div>

                <div className="scroll-out">
                  <div className="override-native overflow-auto sh-45 pe-3">
                    <Nav className="flex-column" activeKey="overview">
                      {!filteredNavItems.length ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <Empty message="Nenhum item encontrado" />
                        </div>
                      ) : (
                        filteredNavItems.map(({ to, text }) => (
                          <NavLink key={text} to={to} className="border-bottom border-separator-light mb-1 pb-2 text-alternate w-100 custom-nav-link">
                            <CsLineIcons icon="file-text" size={22} /> <span>{text}</span>
                          </NavLink>
                        ))
                      )}
                    </Nav>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl="8" xxl="9">
            <Outlet />
          </Col>
        </Tab.Container>
      </Row>
    </>
  );
};

export default ProfileStandard;
