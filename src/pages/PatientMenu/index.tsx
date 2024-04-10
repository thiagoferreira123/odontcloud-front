import React, { useEffect } from 'react';
import { Row, Col, Card, Nav, Tab, Badge } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { LAYOUT } from '../../constants';
import usePatientMenuStore from './hooks/patientMenuStore';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import useCustomLayout from '../../hooks/useCustomLayout';
import Loading from '../../components/loading/Loading';
import HtmlHead from '../../components/html-head/HtmlHead';
import Empty from '../../components/Empty';
import SearchInput from './SearchInput';

type NavItem = {
  to?: string;
  text: string;
  Icon?: React.ElementType;
  badgeText?: string;
  isTitle?: boolean;
};

const navItems: NavItem[] = [

  { to: 'plano-de-tratamento', text: 'Plano de tratamento', Icon: Icon.BookmarkHeart },
  { to: 'orcamento', text: 'Orçamento', Icon: Icon.CashCoin },
  { to: 'anamnese', text: 'Anamnese', Icon: Icon.ClipboardPlus },

  { to: 'pasta-do-paciente', text: 'Arquivos do paciente', Icon: Icon.Folder },
  { to: 'atestado', text: 'Emissão de atestado', Icon: Icon.PostcardHeart },
  { to: 'recibo', text: 'Emissão de recibo', Icon: Icon.ReceiptCutoff },
];

const ProfileStandard = () => {
  const patient = usePatientMenuStore((state) => state.patient);
  const query = usePatientMenuStore((state) => state.query);
  const navigate = useNavigate();

  const { setPatientId, getPatient } = usePatientMenuStore();
  const { id } = useParams();

  useEffect(() => {
    id && setPatientId(id);
  }, [id, setPatientId]);

  const title = 'Menu do paciente';
  const description = 'Menu do paciente';

  useCustomLayout({ layout: LAYOUT.Boxed });

  const getPatient_ = async () => {
    try {
      if (!id) throw new Error('Id não informado');

      const response = await getPatient(id, navigate);
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;
      else return [];
    }
  };

  const resultPatient = useQuery({ queryKey: ['patient', id], queryFn: getPatient_, enabled: !!id });

  if (resultPatient.isLoading) {
    return <Loading />;
  }

  if (resultPatient.isError) {
    return <div>Erro ao carregar dados do paciente.</div>;
  }

  const filteredNavItems = navItems.filter((item) => {
    if (item.isTitle) return true;
    return item.text.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <>
      <HtmlHead title={title} description={description} />
      <Row className="g-5">
        <Tab.Container id="profileStandard" defaultActiveKey="classic-eating-plan">
          <Col xl="4" xxl="3">
            <Card>
              <Card.Body>
                <div className="d-flex align-items-center flex-column mb-4">
                  <div className="d-flex align-items-center flex-column">
                    <div className="sw-13 position-relative mb-3">
                      <img src={patient?.patient_photo} className="img-fluid rounded-xl avatar" alt="thumb" />
                    </div>
                    <div className="h5 mb-0">{patient?.patient_full_name ?? ''}</div>
                    {/* <div className="text-muted">
                      {patient?.reasonForConsultation ?? ''}, {patient?.age ?? ''} anos
                    </div> */}
                  </div>
                </div>

                <div className="mb-3 mt-3">
                  <div className="w-100 w-md-auto search-input-container border border-separator mt-3">
                    <SearchInput />
                  </div>
                </div>

                <div className="scroll-out">
                  <div className="override-native overflow-auto sh-50 pe-3">
                    <Nav className="flex-column" activeKey="overview">
                      {!filteredNavItems.length ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <Empty message="Nenhum item encontrado" />
                        </div>
                      ) : (
                        filteredNavItems.map((item) =>
                          item.isTitle ? (
                            <h5 key={item.text} className="nav-title pt-2 pb-1 font-weight-bold">
                              {item.text}
                            </h5>
                          ) : (
                            <NavLink
                              key={item.text}
                              to={item.to ?? ''}
                              className="border-bottom border-separator-light mb-2 pb-2 text-alternate w-100 custom-nav-link"
                            >
                              {item.Icon && <item.Icon size={20} className="text-primary me-2" />} <span className="font-weight-700">{item.text}</span>{' '}
                              {item.badgeText && <Badge>{item.badgeText}</Badge>}
                            </NavLink>
                          )
                        )
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
