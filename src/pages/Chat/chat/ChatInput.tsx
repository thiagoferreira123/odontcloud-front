import React, { useRef, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { ChatState, InterfaceState } from '../../../types/Interface';
import useChat from '../hooks/useChat';
import useFirebase, { MessageType } from '../../../services/useFirebase';
import { useAuth } from '../../Auth/Login/hook';
import api from '../../../services/useAxios';
import { useChatNotification } from '../../../hooks/useChatNotification';
import { notify } from '../../../components/toast/NotificationIcon';
import AsyncButton from '../../../components/AsyncButton';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

const ChatInput = () => {
  const refFileUpload = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const firestoreService = useFirebase();
  const user = useAuth((state) => state.user);

  const { selectedPatient } = useSelector<InterfaceState, ChatState>((state) => state.chat);
  const { sendMessage } = useChat();
  const { push } = useChatNotification();

  const onAttachButtonClick = () => {
    if (refFileUpload) {
      refFileUpload.current && refFileUpload.current.dispatchEvent(new MouseEvent('click'));
    }
  };
  const addAttachment = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (!event.target.files[0].type.includes('image') && !event.target.files[0].type.includes('application/pdf'))
        return notify('Só é possivel o envio de imagens ou pdf', 'Erro', 'close', 'danger');

      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', event.target.files[0]);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await api.post<{ url: string }>('/upload/chat', formData, config);

      if (!selectedPatient.id) throw new Error('Patient not selected');
      if (!user) throw new Error('User not defined');

      const newMessage = {
        content: data.url,
        id_paciente: selectedPatient.id.toString(),
        is_profissional: user ? true : false,
        message_type: event.target.files[0].type as MessageType,
      };

      data && (await sendMessage(newMessage, firestoreService)) && push(newMessage, selectedPatient.id, user.id);

      setIsUploading(false);
    }
  };

  const addText = async () => {
    if (text !== '' && text.length > 0) {
      try {
        setIsSending(true);

        if (!selectedPatient.id) throw new Error('Patient not selected');
        if (!user) throw new Error('User not defined');

        const newMessage = {
          content: text,
          id_paciente: selectedPatient.id.toString(),
          is_profissional: user ? true : false,
          message_type: 'text' as MessageType,
        };

        (await sendMessage(newMessage, firestoreService)) && push(newMessage, selectedPatient.id, user.id);
        setText('');
        setIsSending(false);
      } catch (error) {
        console.error(error);
        setIsSending(false);
      }
    }
  };

  const newTextOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === 'enter' && !event.shiftKey) {
      event.preventDefault();
      addText();
    }
  };

  const newTextOnChange = (value: string) => {
    setText(value);
  };

  return (
    <Card>
      <Card.Body className="p-0 d-flex flex-row align-items-center px-3 py-3">
        <Form.Control
          as="textarea"
          className="me-3 border-0 ps-2 py-2"
          rows={1}
          placeholder="Digite a mensagem..."
          value={text}
          onChange={(event) => newTextOnChange(event.target.value)}
          onKeyDown={newTextOnKeyDown}
        />
        <div className="d-flex flex-row">
          <Form.Control type="file" ref={refFileUpload} accept="image/*, application/pdf" className="file-upload d-none" onChange={addAttachment} />
          <AsyncButton
            isSaving={isUploading}
            loadingText=" "
            variant="outline-primary"
            className="btn-icon btn-icon-only mb-1 rounded-xl"
            onClickHandler={onAttachButtonClick}
          >
            <CsLineIcons icon="attachment" />
          </AsyncButton>
          <AsyncButton isSaving={isSending} loadingText=" " variant="primary" className="btn-icon btn-icon-only mb-1 rounded-xl ms-1" onClickHandler={addText}>
            <CsLineIcons icon="chevron-right" />
          </AsyncButton>
        </div>
      </Card.Body>
    </Card>
  );
};
export default ChatInput;
