import { Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../Auth/Login/hook';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import useClinicProcedureStore from './hooks/ClinicProcedureStore';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify } from '../../components/toast/NotificationIcon';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import Empty from '../../components/Empty';
import { useCreateAndProcedureEditModalStore } from './hooks/CreateAndProcedureEditModalStore';
import CreateOrEditClinicProcedureModal from './modals/AddClinicProcedureModal';
import { useDeleteProcedureConfirmationModalStore } from './hooks/DeleteProcedureConfirmationModalStore';
import DeleteConfirmation from './modals/DeleteConfirmation';
import DeleteProcedureConfirmationModalStore from './modals/DeleteProcedureConfirmationModalStore';

const ClinicProcedures = () => {
  const user = useAuth((state) => state.user);

  const { getClinicProcedures } = useClinicProcedureStore();
  const { openCreateAndEditModal, handleSelectClinicProcedureToEdit } = useCreateAndProcedureEditModalStore();
  const { handleSelectClinicProcedureToRemove } = useDeleteProcedureConfirmationModalStore();

  const getClinicProcedures_ = async () => {
    try {
      if (!user) throw new AppException('Usuário não encontrado');

      const response = await getClinicProcedures(user.clinic_id);

      if (response === false) throw new Error('Erro ao buscar procedimentos');

      return response;
    } catch (error) {
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['clinic_procedures'], queryFn: getClinicProcedures_, enabled: !!user?.clinic_id });

  return (
    <>
      {result.isLoading ? (
        <div className="sh-30 w-100 d-flex justify-content-center align-items-center">
          <StaticLoading />
        </div>
      ) : result.isError ? (
        <div className="sh-30 w-100 d-flex justify-content-center align-items-center">Erro ao consultar procedimentos</div>
      ) : !result.data?.length ? (
        <div className="sh-30 w-100 d-flex justify-content-center align-items-center">
          <Empty message="Nenhum procedimento encontrado" classNames="mt-0" />
        </div>
      ) : (
        <>
          {result.data.map((clinic_procedure) => (
            <div className="border-bottom border-separator-light mb-2 pb-2" key={clinic_procedure.clinic_procedure_id}>
              <Row className="g-0 sh-6">
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{clinic_procedure.clinic_procedure_description}</div>
                      <div className="text-medium text-muted">
                        {Number(clinic_procedure.clinic_procedure_value.replace('.', '').replace(',', '.')).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </div>
                    </div>
                    <div className="d-flex">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon btn-icon-only ms-1"
                        onClick={() => handleSelectClinicProcedureToEdit(clinic_procedure)}
                      >
                        <CsLineIcons icon="edit" />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon btn-icon-only ms-1"
                        onClick={() => handleSelectClinicProcedureToRemove(clinic_procedure)}
                      >
                        <CsLineIcons icon="bin" />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </>
      )}

      <CreateOrEditClinicProcedureModal />
      <DeleteProcedureConfirmationModalStore />

      <div className="text-center">
        <Button type="submit" size="lg" variant="primary" onClick={openCreateAndEditModal}>
          Adicionar procedimento
        </Button>
      </div>
    </>
  );
};

export default ClinicProcedures;
