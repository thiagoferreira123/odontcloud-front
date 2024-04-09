import { Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../Auth/Login/hook';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import useProfessionalStore from './hooks/ProfessionalStore';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify } from '../../components/toast/NotificationIcon';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import Empty from '../../components/Empty';
import { useCreateAndEditModalStore } from './hooks/CreateAndEditModalStore';
import CreateOrEditProfessionalModal from './modals/AddProfessionalModal';
import { useDeleteConfirmationModalStore } from './hooks/DeleteConfirmationModalStore';
import DeleteConfirmation from './modals/DeleteConfirmation';

const Professionals = () => {
  const user = useAuth((state) => state.user);

  const { getProfessionals } = useProfessionalStore();
  const { openCreateAndEditModal, handleSelectProfessionalToEdit } = useCreateAndEditModalStore();
  const { handleSelectProfessionalToRemove } = useDeleteConfirmationModalStore();

  const getProfessionals_ = async () => {
    try {
      if (!user) throw new AppException('Usuário não encontrado');

      const response = await getProfessionals(user.clinic_id);

      if (response === false) throw new Error('Erro ao buscar profissionais');

      return response;
    } catch (error) {
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['professionals'], queryFn: getProfessionals_, enabled: !!user?.clinic_id });

  return (
    <>
      {result.isLoading ? (
        <div className="sh-30 w-100 d-flex justify-content-center align-items-center">
          <StaticLoading />
        </div>
      ) : result.isError ? (
        <div className="sh-30 w-100 d-flex justify-content-center align-items-center">Erro ao consultar profissionais</div>
      ) : !result.data?.length ? (
        <div className="sh-30 w-100 d-flex justify-content-center align-items-center">
          <Empty message="Nenhum profissional encontrado" classNames="mt-0" />
        </div>
      ) : (
        <>
          {result.data.map((professional) => (
            <div className="border-bottom border-separator-light mb-2 pb-2" key={professional.professional_id}>
              <Row className="g-0 sh-6">
                <Col xs="auto">
                  <img src={professional.professional_photo_link ?? '/img/profile/profile-11.webp'} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
                </Col>
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{professional.professional_full_name}</div>
                      <div className="text-medium text-muted">{professional.professional_specialty}</div>
                    </div>
                    <div className="d-flex">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon btn-icon-only ms-1"
                        onClick={() => handleSelectProfessionalToEdit(professional)}
                      >
                        <CsLineIcons icon="edit" />
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="btn-icon btn-icon-only ms-1"
                        onClick={() => handleSelectProfessionalToRemove(professional)}
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

      <CreateOrEditProfessionalModal />
      <DeleteConfirmation />

      <div className="text-center">
        <Button type="submit" size="lg" variant="primary" onClick={openCreateAndEditModal}>
          Adicionar profissional
        </Button>
      </div>
    </>
  );
};

export default Professionals;
