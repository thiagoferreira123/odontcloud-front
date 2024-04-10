import { Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../../Auth/Login/hook';
import useClinicAnamnesisStore from './hooks/ClinicAnamnesisStore';
import { useCreateAndAnamnesisEditModalStore } from './hooks/CreateAndProcedureEditModalStore';
import { useDeleteAnamnesisConfirmationModalStore } from './hooks/DeleteProcedureConfirmationModalStore';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import DeleteAnamnesisConfirmationModal from './modals/DeleteAnamnesisConfirmationModal';
import CreateOrEditClinicAnamnesisModal from './modals/CreateOrEditClinicAnamnesisModal';

const ClinicAnamnesis = () => {
  const user = useAuth((state) => state.user);

  const { getClinicAnamnesis } = useClinicAnamnesisStore();
  const { openCreateAndEditModal, handleSelectClinicAnamnesisToEdit } = useCreateAndAnamnesisEditModalStore();
  const { handleSelectClinicAnamnesisToRemove } = useDeleteAnamnesisConfirmationModalStore();

  const getClinicAnamnesis_ = async () => {
    try {
      if (!user) throw new AppException('Usuário não encontrado');

      const response = await getClinicAnamnesis(user.clinic_id);

      if (response === false) throw new Error('Erro ao buscar anamneses');

      return response;
    } catch (error) {
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['anamnesis'], queryFn: getClinicAnamnesis_, enabled: !!user?.clinic_id });

  return (
    <>
      {result.isLoading ? (
        <div className="sh-30 w-100 d-flex justify-content-center align-items-center">
          <StaticLoading />
        </div>
      ) : result.isError ? (
        <div className="sh-30 w-100 d-flex justify-content-center align-items-center">Erro ao consultar anamneses</div>
      ) : !result.data?.length ? (
        <div className="sh-30 w-100 d-flex justify-content-center align-items-center">
          <Empty message="Nenhuma anamnese encontrada" classNames="mt-0" />
        </div>
      ) : (
        <>
          {result.data.map((clinic_procedure) => (
            <div className="border-bottom border-separator-light mb-2 pb-2" key={clinic_procedure.clinic_anamnesi_id}>
              <Row className="g-0 sh-6">
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{clinic_procedure.clinic_identification}</div>
                      {/* <div className="text-medium text-muted">{clinic_procedure.clinic_identification}</div> */}
                    </div>
                    <div className="d-flex">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon btn-icon-only ms-1"
                        onClick={() => handleSelectClinicAnamnesisToEdit(clinic_procedure)}
                      >
                        <CsLineIcons icon="edit" />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon btn-icon-only ms-1"
                        onClick={() => handleSelectClinicAnamnesisToRemove(clinic_procedure)}
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

      <CreateOrEditClinicAnamnesisModal />
      <DeleteAnamnesisConfirmationModal />

      <div className="text-center">
        <Button type="submit" size="lg" variant="primary" onClick={openCreateAndEditModal}>
          Adicionar anamnese
        </Button>
      </div>
    </>
  );
};

export default ClinicAnamnesis;
