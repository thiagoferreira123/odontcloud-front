import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { chatSetSelectedChat } from '../hooks/chatSlice';
import { Patient } from '../../../types/Patient';
import { ChatState, InterfaceState } from '../../../types/Interface';
import { getAvatarByGender } from '../../PatientMenu/hooks/patientMenuStore';
import { Professional } from '../../Auth/Login/hook/types';
import { ChatService } from '../hooks/useChat';
import { FireStoreService } from '../../../services/useFirebase';
import { notify } from '../../../components/toast/NotificationIcon';
import { convertIsoToBrDate } from '../../../helpers/DateHelper';
import { useChatNotification } from '../../../hooks/useChatNotification';
import { useQueryClient } from '@tanstack/react-query';
import Clamp from '../../../components/clamp';

interface ContactListItemProps {
  patient: Partial<Patient>;
  user: Professional | null;
  chatService: ChatService;
  firestoreService: FireStoreService,
  last?: string;
  readed?: number;
  notificationToken?: string;
}

const ContactListItem = ({ patient, user, chatService, firestoreService, last, readed, notificationToken }: ContactListItemProps) => {
  const dispatch = useDispatch();
  const { id, name = 'Jane Doe', status = 'Offline' } = patient;
  const { selectedPatient } = useSelector<InterfaceState, ChatState>((state) => state.chat);

  const queryClient = useQueryClient();

  const { updateNotification } = useChatNotification();

  const onContactClick = () => {
    try {
      if(!patient) throw new Error('Patient not found');

      console.log(notificationToken);

      dispatch(chatSetSelectedChat(patient));
      chatService.init(user, patient, firestoreService);
      notificationToken && updateNotification({
        token: notificationToken
      }, queryClient)
    } catch (error) {
      console.error(error);
      notify('Erro ao tentar acessar chat do paciente', 'Erro', 'close', 'danger');
    }
  };

  return (
    <Row
      className={classNames('w-100 d-flex flex-row g-0 sh-5 mb-2 nav-link p-0 contact-list-item cursor-pointer position-relative', {
        active: selectedPatient && selectedPatient.id === id,
      })}
      onClick={onContactClick}
    >
      <Col xs="auto">
        <div className="sw-5 sh-5 d-inline-block position-relative">
          <img
            src={patient.photoLink ? patient.photoLink : getAvatarByGender(patient.gender ?? 1)}
            className="sw-5 sh-5 img-fluid rounded-xl border border-2 border-foreground"
            alt={name}
          />
          {status === 'Online' && <i className="p-1 border border-1 border-foreground bg-primary position-absolute rounded-xl e-0 t-0" />}
        </div>
      </Col>
      <Col className='pe-2'>
        <Card.Body className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
          <div className="d-flex flex-column">
            <div className="mb-1">{name}</div>
            {last ? <Clamp className="text-small text-muted clamp-line" clamp="1">
              {convertIsoToBrDate(last)}
            </Clamp> : null}
          </div>
        </Card.Body>
      </Col>
      {readed === 0 ? (<span className="position-absolute top-50 end-0 translate-middle-y notification-dot rounded-xl w-auto p-1 bg-primary me-1" />) : null}
    </Row>
  );
};
export default ContactListItem;
