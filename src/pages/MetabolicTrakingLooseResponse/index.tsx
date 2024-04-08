import { Container } from 'react-bootstrap';
import useLayout from '../../hooks/useLayout';
import useMetabolicTrackingStore from './hooks';
import MetabolicTrakingLooseForm from './MetabolicTrakingLooseForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PatientData from './PatientData';

const queryClient = new QueryClient();

export default function MetabolicTrakingLooseResponse() {
  useLayout();

  const {
    name_patient,
  } = useMetabolicTrackingStore((state) => state);

  return (
    <div className="py-5">
      <Container>
        <QueryClientProvider client={queryClient}>
          { name_patient ? <MetabolicTrakingLooseForm /> : <PatientData />}
        </QueryClientProvider>
      </Container>
    </div>
  );
}
