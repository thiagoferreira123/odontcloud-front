import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Professional } from '../../Auth/Login/hook/types';
import useFirebase, { Message } from '../../../services/useFirebase';
import useChat from '../hooks/useChat';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

interface MessageContentContainerProps {
  user: Professional;
  children: React.ReactNode;
  message: Message;
}

const MessageContentContainer = ({ user, children, message }: MessageContentContainerProps) => {
  const { nome_completo, image } = user;

  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const firestoreService = useFirebase();

  const { removeMessage } = useChat();

  const handleRemoveMessage = () => {
    firestoreService && removeMessage(message, firestoreService);
  };

  return (
    <div
      className="mb-2 card-content"
      onMouseOver={() => setShowDeleteButton(true)}
      onFocus={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
      onBlur={() => setShowDeleteButton(false)}
    >
      <Row className="g-2">
        <Col xs="auto" className="d-flex align-items-end order-1">
          <div className="sw-5 sh-5 mb-1 d-inline-block position-relative">
            <img src={image ? image : '/img/profile/profile-1.webp'} className="img-fluid rounded-xl sw-5 sh-5" alt={nome_completo} />
          </div>
        </Col>
        <Col className="d-flex justify-content-end align-items-end content-container position-relative">
          {children}
          <div className="position-absolute end-0 bottom-0 px-2 pb-1 text-light" role="button" tabIndex={0} onClick={handleRemoveMessage}>
            <CsLineIcons icon="bin" className={!showDeleteButton ? 'opacity-0' : ''} />
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default MessageContentContainer;
