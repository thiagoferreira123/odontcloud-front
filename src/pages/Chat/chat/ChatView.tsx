import { useEffect, useRef } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import RespondContentContainer from '../response/RespondContentContainer.tsx';
import RespondContentText from '../response/RespondContentText.tsx';
import RespondContentAttachment from '../response/RespondContentAttachment.tsx';

import ChatInput from './ChatInput.tsx';
import { chatChangeMode, chatSetCurrentCall } from '../hooks/chatSlice.tsx';
import { ChatState, InterfaceState } from '../../../types/Interface.tsx';
import { useAuth } from '../../Auth/Login/hook/index.ts';
import { getAvatarByGender } from '../../PatientMenu/hooks/patientMenuStore.ts';
import useChat from '../hooks/useChat.ts';
import { FieldValueTimestamp } from '../../../services/useFirebase.ts';
import MessageContentContainer from '../message/MessageContentContainer.tsx';
import MessageContentAttachment from '../message/MessageContentAttachment.tsx';
import MessageContentText from '../message/MessageContentText.tsx';
import { Professional } from '../../Auth/Login/hook/types.ts';

const ChatView = () => {
  const dispatch = useDispatch();

  const { selectedPatient } = useSelector<InterfaceState, ChatState>((state) => state.chat);
  const user = useAuth((state) => state.user) as Professional;
  const messages = useChat((state) => state.messages);

  const onCallClick = () => {
    dispatch(chatChangeMode('call'));
    dispatch(chatSetCurrentCall({ name: selectedPatient.name, thumb: selectedPatient.thumb, time: 0 }));
  };

  const onVideoCallClick = () => {
    dispatch(chatChangeMode('call'));
    dispatch(chatSetCurrentCall({ name: selectedPatient.name, thumb: selectedPatient.thumb, time: 0 }));
  };

  const chatContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messages && chatContainer.current && chatContainer.current.scrollTo(0, chatContainer.current.scrollHeight);
  }, [messages])


  if (selectedPatient !== null) {
    const { name, status } = selectedPatient;
    return (
      <div className="d-flex flex-column h-100 w-100" id="chatMode">
        <Card className="h-100 mb-2">
          {selectedPatient && (
            <Card.Body className="d-flex flex-column h-100 w-100 position-relative">
              <div className="d-flex flex-row align-items-center mb-3">
                <Row className=" g-0 sh-6 align-self-start" id="contactTitle">
                  <Col xs="auto">
                    <div className="sh-6 sw-6 d-inline-block position-relative">
                      <img
                        src={selectedPatient.photoLink ? selectedPatient.photoLink : getAvatarByGender(selectedPatient.gender)}
                        className="sw-6 sh-6 img-fluid rounded-xl border border-2 border-foreground profile"
                        alt={name}
                      />
                      {status === 'Online' && <i className="p-1 border border-1 border-foreground bg-primary position-absolute rounded-xl e-0 t-0 status" />}
                    </div>
                  </Col>
                  <Col>
                    <Card.Body className="d-flex flex-row pt-0 pb-0 pe-0 pe-0 ps-2 h-100 align-items-center justify-content-between">
                      <div className="d-flex flex-column">
                        <div className="name">{selectedPatient.name}</div>
                        {/* <div className="text-small text-muted last">Last seen {last}</div> */}
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </div>

              <div className="separator-light mb-3" />
              <div className="scroll-out">
                <div className="override-native overflow-y-auto sh-40 mb-n2 chat-container" ref={chatContainer}>
                  {messages &&
                    user &&
                    messages.map((message, mIndex) => {
                      const { content, date, is_profissional, message_type } = message;
                      if (!is_profissional) {
                        return (
                          <RespondContentContainer key={`message${mIndex}`} user={selectedPatient}>
                            <>
                              {content !== '' && message_type === 'text' && <RespondContentText text={content} date={date as FieldValueTimestamp} />}
                              {content && message_type !== 'text' && (
                                <RespondContentAttachment content={content} message_type={message_type} date={date as FieldValueTimestamp} />
                              )}
                            </>
                          </RespondContentContainer>
                        );
                      }
                      return (
                        <MessageContentContainer key={`message${mIndex}`} user={user} message={message}>
                          <>
                            {content !== '' && message_type === 'text' && <MessageContentText text={content} date={date as FieldValueTimestamp} />}
                            {content && message_type !== 'text' && (
                              <MessageContentAttachment content={content} message_type={message_type} date={date as FieldValueTimestamp} />
                            )}
                          </>
                        </MessageContentContainer>
                      );
                    })}
                </div>
              </div>
            </Card.Body>
          )}
        </Card>
        <ChatInput />
      </div>
    );
  }
  return <></>;
};
export default ChatView;
