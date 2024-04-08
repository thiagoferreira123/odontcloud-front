import PatientNotRegisteredForm from './PatientNotRegisteredForm';
import { useParams, useSearchParams } from 'react-router-dom';
import PatientRegisteredForm from './PatientRegisteredForm';
import { useFormQueryByKey } from '../FormLoose/Hooks/queries';
import { Container, Spinner } from 'react-bootstrap';
import Empty from '../../components/Empty';
import { Form } from '../../types/FormBuilder';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useLayout from '../../hooks/useLayout';

type Params = {
  id: string;
};

const queryClient = new QueryClient();

const FormResponsePage = () => {
  const { id } = useParams<Params>();

  const { data: form, isFetching } = useFormQueryByKey(id);

  const [searchParams] = useSearchParams();

  const showPatientNotRegisteredForm = !form?.paciente_id && !searchParams.get('nome_paciente');

  if (isFetching) {
    return (
      <div className="h-100 w-100 align-items-center justify-content-center">
        <div className="d-flex mt-5 justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (!isFetching && !form) {
    return <Empty message="Não encontramos o formulário. Verifique o link e tente novamente" />;
  }
  return showPatientNotRegisteredForm ? (
    <PatientNotRegisteredForm form={form as Form}></PatientNotRegisteredForm>
  ) : (
    <PatientRegisteredForm form={form as Form} />
  );
};

const Main = () => {
  useLayout();

  return (
    <Container className="mt-4">
      <QueryClientProvider client={queryClient}>
        <FormResponsePage />
      </QueryClientProvider>
    </Container>
  );
};

export default Main;
