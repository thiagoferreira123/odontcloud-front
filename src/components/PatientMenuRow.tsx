import { Row, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { appRoot } from '../routes';
import usePatientMenuStore, { getAvatarByGender } from '../pages/PatientMenu/hooks/patientMenuStore';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from './loading/StaticLoading';
import { Patient } from '../types/Patient';

const PatientMenuRow = () => {
  const navigate = useNavigate();
  const patientId = usePatientMenuStore((state) => state.patientId);

  const { getPatient, updatePatient, persistUpdatePatient } = usePatientMenuStore();

  const getPatient_ = async () => {
    try {

      const response = await getPatient(patientId, navigate);

      if (response === false) throw new Error('Erro ao buscar paciente');

      const payload: Partial<Patient> & { id: number } = {id: response.id, dateOfLastConsultation: new Date()};

      await persistUpdatePatient(payload, true);

      updatePatient(payload);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['patient', patientId], queryFn: getPatient_, enabled: !!patientId});

  return (
    <Row>
      <div className="border-bottom border-separator-light mb-2 pb-2">
        <Row className="g-0 sh-6">
          <Col xs="auto">
            {result.isLoading ? (
              <StaticLoading />
            ) : (
              <img
                src={result.data?.photoLink ? result.data.photoLink : getAvatarByGender(result.data?.gender ?? 1)}
                className="card-img rounded-xl sh-6 sw-6"
                alt="thumb"
              />
            )}
          </Col>
          <Col>
            <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
              <div className="d-flex flex-column">
                <div>{result.data?.name}</div>
                <div className="text-medium text-muted">
                  {result.data?.reasonForConsultation ?? ''}, {result.data?.age ?? ''} anos
                </div>
              </div>
              <div className="d-flex">
                <Link to={`${appRoot}/menu-paciente/${patientId}`} className="btn btn-sm btn-primary ms-1">
                  Menu do paciente
                </Link>
                {/* <Button variant="primary" size="sm" className="ms-1">
                  Anamnese
                </Button> */}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Row>
  );
};

export default PatientMenuRow;
