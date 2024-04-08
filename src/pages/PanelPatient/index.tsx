import { Card, Col, Container, Row } from 'react-bootstrap';
import useLayout from '../../hooks/useLayout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Materials from './Materials';
import { usePatientAuthStore } from '../Auth/PatientLogin/hook/PatientAuthStore';
import { getAvatarByGender } from '../PatientMenu/hooks/patientMenuStore';

const queryClient = new QueryClient();

export default function PanelPatient() {
  useLayout();

  const patient = usePatientAuthStore((state) => state.patient);

  return (
    <Container className="mt-4">
      <Row className='mb-4'>
        <Card>
          <Card.Body>
            <div className="border-bottommb-2 pb-2">
              <Row className="g-0 sh-6">
                <Col xs="auto">
                  <img src={patient?.photoLink ? patient?.photoLink : getAvatarByGender(patient?.gender ?? 1)}  className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
                </Col>
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      Olá, {patient?.name}, tenha acesso a todos os PDF's dos materiais disponibilizados pelo profissional.
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Row>

      <QueryClientProvider client={queryClient}>
        <Materials />
      </QueryClientProvider>
    </Container>
  );
}
