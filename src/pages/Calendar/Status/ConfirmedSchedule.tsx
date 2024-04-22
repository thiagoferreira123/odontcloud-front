import useLayout from '../../../hooks/useLayout';
import { Card, Container } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

type Props = {}

export default function ConfirmedSchedule({}: Props) {
  useLayout();

  return (
    <Container className="vh-100 d-flex flex-column justify-content-center">
      <Card>
        <div className="sh-30 d-flex flex-column align-items-center justify-content-center text-primary">
          <Icon.Check2Circle size={40} className='mb-3' /> Agendamento confirmado com sucesso!
        </div>
      </Card>
    </Container>
  )
}