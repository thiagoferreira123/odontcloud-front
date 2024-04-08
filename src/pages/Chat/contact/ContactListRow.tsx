import React from 'react'
import { ListChildComponentProps } from 'react-window'
import { Patient } from '../../../types/Patient'
import ContactListItem from './ContactListItem';
import { useAuth } from '../../Auth/Login/hook';
import useChat from '../hooks/useChat';
import useFirebase from '../../../services/useFirebase';
import { Professional } from '../../Auth/Login/hook/types';

export default React.memo(function ContactListRow({ data, index, style }: ListChildComponentProps<Patient[]>) {
  const patient = data[index];

  const user = useAuth((state) => state.user) as Professional;

  const chatService = useChat();
  const firestoreService = useFirebase();

  return (
    <div style={style}>
      <ContactListItem
        key={`contact.${patient.id}`}
        patient={patient}
        user={user}
        chatService={chatService}
        firestoreService={firestoreService}
      />
    </div>
  )
})