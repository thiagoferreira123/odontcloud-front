import { Professional, User } from '../../Auth/Login/hook/types';
import { Patient } from '../../../types/Patient';
import { create } from 'zustand';
import { FireStoreService, Message } from '../../../services/useFirebase';
import { notify } from '../../../components/toast/NotificationIcon';

export interface ChatService {
  query: string;
  messages: Message[];

  // eslint-disable-next-line no-unused-vars
  setQuery: (query: string) => void;
  // eslint-disable-next-line no-unused-vars
  init: (user: Professional | null, patient: Partial<Patient> | null, firestoreService: FireStoreService) => void;
  // eslint-disable-next-line no-unused-vars
  sendMessage: (message: Message, firestoreService: FireStoreService) => Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  removeMessage: (message: Message, firestoreService: FireStoreService) => void;
}

const useChat = create<ChatService>((set) => {
  const getLoginParams = (user: Professional | null) => {
    if (!user) throw new Error('User is not defined');
    if (!user.email) throw new Error('User email is not defined');

    const formatedDate = user.data_cadastro ? user.data_cadastro
      .replace(/T/, ' ')      // substitui T com um espaço
      .replace(/\..+/, '') : '';

    return {
      email: user.email,
      token: btoa(user.email + '::::' + formatedDate),
    }
  };

  const onGet = (data: Message[] | Message, type?: string) => {
    if (!type || type !== 'removed') {
      Array.isArray(data) ?
        set({ messages: data.sort(sortMessagesFunction) }) :

        set((state) => ({ messages: [...state.messages, data].sort(sortMessagesFunction) }))
    } else {
      !Array.isArray(data) && set((state) => ({ messages: state.messages.filter(message => message.id !== data.id).sort(sortMessagesFunction) }))
    }
  };

  const setFirebaseCallbacks = () => {
    // Configuração dos callbacks do Firebase
    // Esta parte precisa ser ajustada para usar o sistema de mensagens do Firebase
  };

  const sortMessagesFunction = (a: Message, b: Message) => {
    if ((!a.date || !b.date) || a.date < b.date) {
      return -1;
    }

    return a.date > b.date ? 1 : 0;
  }

  return {
    messages: [],
    query: '',

    setQuery: (query) => {
      set({ query });
    },
    init: async (user, patient, firestoreService) => {
      set({ messages: [] });

      if (!patient?.id) throw new Error('Patient is not defined');

      await firestoreService.login(getLoginParams(user))

      firestoreService.registerOnChangeListener(patient.id, onGet);

      setFirebaseCallbacks();
    },
    sendMessage: async (message, firestoreService) => {
      try {
        if (!message) throw new Error('message is not defined');
        if (!message.content.length) return false;

        await firestoreService.addMessage(message);

        return true;
      } catch (error) {
        notify('Erro ao enviar mensagem', 'Erro', 'close', 'danger');
        console.error(error);
        return false;
      }

    },
    removeMessage: async (message, firestoreService) => {
      try {
        if (!message?.id) throw new Error('message is not defined');

        await firestoreService.deleteMessage(message.id);

        return true;
      } catch (error) {
        notify('Erro ao remover mensagem', 'Erro', 'close', 'danger');
        console.error(error);
        return false;
      }
    },
  };
})

export default useChat;
