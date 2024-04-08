import { useEffect, useState } from 'react';
import { Row, Col, Button, Card, Nav, Tab } from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';
import HtmlHead from '../../components/html-head/HtmlHead.tsx';
import CsLineIcons from '../../cs-line-icons/CsLineIcons.tsx';
import useCustomLayout from '../../hooks/useCustomLayout.ts';
import { useWindowSize } from '../../hooks/useWindowSize.ts';
import ChatView from './chat/ChatView.tsx';
import ContactListItem from './contact/ContactListItem.tsx';
import { chatSetSelectedChat, chatSetSelectedTab, selectChat } from './hooks/chatSlice.tsx';
import { ChatState, InterfaceState, ThemeValues } from '../../types/Interface.tsx';
import usePatientStore from '../Dashboard/patients/hooks/PatientStore.ts';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useAuth } from '../Auth/Login/hook/index.ts';
import useChat from './hooks/useChat.ts';
import useFirebase from '../../services/useFirebase.ts';
import { useChatNotification } from '../../hooks/useChatNotification.ts';
import { FixedSizeList } from 'react-window';
import ContactListRow from './contact/ContactListRow.tsx';
import SearchInput from './SearchInput.tsx';
import StaticLoading from '../../components/loading/StaticLoading.tsx';
import Empty from '../../components/Empty.tsx';
import { UnknownAction } from '@reduxjs/toolkit';
import { Professional } from '../Auth/Login/hook/types.ts';

const ChatApp = () => {
  const title = 'Chat';
  const description = 'A basic chat application that built mobile first and has chat and talk screens and contains a contact list.';
  useCustomLayout({ fullpage: true });
  const dispatch = useDispatch();

  const { currentMode, selectedTab, selectedPatient } = useSelector<InterfaceState, ChatState>((state) => state.chat);
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const mobileBreakpoint = parseInt(themeValues.md.replace('px', ''), 10);
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  const query = useChat((state) => state.query);

  const user = useAuth((state) => state.user) as Professional;
  const chatService = useChat();
  const firestoreService = useFirebase();

  const { getPatients } = usePatientStore();
  const { getNotifications } = useChatNotification();
  const changeSelectedTab = (tab: string) => {
    dispatch(chatSetSelectedTab(tab));
  };

  const getPatients_ = async () => {
    try {
      const response = await getPatients();

      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) return [];

      console.error(error);
      throw error;
    }
  };

  const getNotifications_ = async () => {
    try {
      const result = await getNotifications();

      if (result === false) throw new Error('Could not get notifications');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['users'], queryFn: getPatients_ });
  const slicedResult = result.data?.length ? result.data.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())) : [];
  const notificationsResult = useQuery({ queryKey: ['notifications'], queryFn: getNotifications_ });

  useEffect(() => {
    if (width) {
      if (width <= mobileBreakpoint) {
        if (!isMobile) {
          setIsMobile(true);
          if (selectedTab === 'messages') {
            dispatch(selectChat({ chat: null }) as unknown as UnknownAction);
          }
        }
      } else if (isMobile) {
        setIsMobile(false);
      }
    }
    return () => {};
  }, [dispatch, isMobile, mobileBreakpoint, result.data, selectedPatient, selectedTab, width]);

  useEffect(() => {
    !selectedPatient && !notificationsResult.isLoading && result.data?.length && dispatch(chatSetSelectedChat(result.data[0]));
  }, [dispatch, notificationsResult.isLoading, result.data, selectedPatient]);

  if (result.isLoading)
    return (
      <div className="position-fixed start-0 top-0 vh-100 w-100 d-flex align-items-center">
        <StaticLoading />
      </div>
    );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="h-100 d-flex flex-column">
        <div className="page-title-container">
          <Row>
            <Col xs="auto" className="mb-2 mb-md-0">
              <div className="sw-md-30 sw-lg-40 w-100">
                <h1 className="mb-0 pb-0 display-4" id="title">
                  {title}
                </h1>
              </div>
            </Col>
            <Col xs="12" className="col-md d-flex align-items-start justify-content-md-end">
              {isMobile && (
                <Button
                  variant="outline-primary"
                  className="btn-icon btn-icon-only ms-1"
                  disabled={selectedPatient === null}
                  onClick={() => dispatch(selectChat({ chat: null }) as unknown as UnknownAction)}
                >
                  <CsLineIcons icon="arrow-left" />
                </Button>
              )}
            </Col>
          </Row>
        </div>

        <Row className="d-flex flex-grow-1 overflow-hidden pb-2 h-100">
          {((isMobile && selectedPatient === null) || !isMobile) && (
            <Col xs="auto" className="w-100 w-md-auto h-100" id="listView">
              <div className="sw-md-30 sw-lg-40 w-100 d-flex flex-column h-100">
                <Card className="h-100">
                  <Tab.Container activeKey={selectedTab}>
                    <Card.Header className="border-0 pb-0">
                      <Nav className="nav-tabs-line card-header-tabs" variant="tabs" activeKey={selectedTab}>
                        <Nav.Item className="w-50 text-center">
                          <Nav.Link
                            href="#messages"
                            className={`${selectedTab === 'messages' && 'active'}`}
                            onClick={(event) => {
                              event.preventDefault();
                              changeSelectedTab('messages');
                            }}
                          >
                            Não lidas
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item className="w-50 text-center">
                          <Nav.Link
                            href="#contacts"
                            className={`${selectedTab === 'contacts' && 'active'}`}
                            onClick={(event) => {
                              event.preventDefault();
                              changeSelectedTab('contacts');
                            }}
                          >
                            Pacientes
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Card.Header>

                    <Card.Body className="h-100-card">
                      <Tab.Content className="sh-60">
                        <Tab.Pane active={selectedTab === 'messages'} className="h-100 scroll-out">
                          <div className="override-native overflow-y-auto h-100 mb-n2">
                            {!notificationsResult.data?.length ? (
                              <div className='h-75 w-100 d-flex align-items-center justify-content-center'>
                                <Empty message="Não existe mensagens não lidas" />
                              </div>
                            ) : (
                              notificationsResult.data?.map((notification) => {
                                return (
                                  <ContactListItem
                                    key={`conversation.${notification.patient.id}`}
                                    patient={notification.patient}
                                    user={user}
                                    chatService={chatService}
                                    firestoreService={firestoreService}
                                    last={notification.data}
                                    readed={notification.lida}
                                    notificationToken={notification.token}
                                  />
                                );
                              })
                            )}
                          </div>
                        </Tab.Pane>
                        <Tab.Pane active={selectedTab === 'contacts'} className="h-100 scroll-out">
                          <>
                            <div className="w-100 w-md-auto search-input-container border border-separator mb-2">
                              <SearchInput />
                            </div>
                            <FixedSizeList
                              height={430}
                              itemCount={slicedResult.length ?? 0}
                              itemSize={48}
                              width={'100%'}
                              itemData={slicedResult}
                              overscanCount={5}
                              className="override-native overflow-y-auto mb-n2"
                            >
                              {ContactListRow}
                            </FixedSizeList>
                          </>
                        </Tab.Pane>
                      </Tab.Content>
                    </Card.Body>
                  </Tab.Container>
                </Card>
              </div>
            </Col>
          )}
          {((isMobile && selectedPatient !== null) || !isMobile) && <div className="col h-100">{currentMode === 'chat' ? <ChatView /> : null}</div>}
        </Row>
      </div>
    </>
  );
};

export default ChatApp;
