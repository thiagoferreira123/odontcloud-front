import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalAddPatient from './modals/ModalAddPatient/index.tsx';
import { useQuery } from '@tanstack/react-query';
import usePatients from '../../../hooks/usePatients.ts';
import { Patient } from '../../../types/Patient.ts';
import { useModalAddPatientStore } from './hooks/ModalAddPatientStore.ts';
import DeleteConfirm from './DeleteConfirm.tsx';
import { usePatientListFilterStore } from './hooks/PatientListFilterStore.ts';
import { FixedSizeList } from 'react-window';
import PatientRow from './PatientRow.tsx';
import ModalReport from './modals/ModalReport.tsx';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAuth } from '../../Auth/Login/hook/index.ts';
import api from '../../../services/useAxios.ts';
import ModalPremium from '../ModalPremium.tsx';
import Empty from '../../../components/Empty.tsx';
import PanelPatientModal from './modals/PanelPatientModal.tsx';


// Componente Skeleton para simular um item da lista de pacientes
const PatientItemSkeleton = () => {
  return (
    <div className="d-flex align-items-center p-2" style={{ borderBottom: '1px solid #eaeaea', padding: '10px' }}>
      <Skeleton circle={true} height={43} width={43} />
      <div className="ms-2 flex-grow-1">
        <Skeleton height={9} width={`60%`} />
        <Skeleton height={10} width={`30%`} style={{ marginTop: 6 }} />
      </div>
      <Skeleton height={20} width={20} />
    </div>
  );
};

// Função para filtrar pacientes
const filterPatient = (patients: (Patient & { id: number })[], query: string, category: string) => {
  return patients.filter((patient) => {
    let matchesQuery = true;
    let matchesCategory = true;

    // Filtra por nome do paciente se uma query foi fornecida
    if (query.length) {
      matchesQuery = patient.name.toLowerCase().includes(query.toLowerCase());
    }

    // Filtra por categoria
    switch (category) {
      case 'Ativos':
        matchesCategory = patient.patientActiveOrInactive === 1;
        break;
      case 'Inativos':
        matchesCategory = patient.patientActiveOrInactive === 0;
        break;
      case 'Com pedências':
        matchesCategory = patient.consultationCompletedOrPending === 'Pendente';
        break;
      case 'Sem pedências':
        matchesCategory = patient.consultationCompletedOrPending !== 'Pendente';
        break;
      case 'Todos':
      default:
        // Não aplica filtro de categoria
        matchesCategory = true;
        break;
    }

    // Retorna true se o paciente corresponder tanto à query quanto à categoria
    return matchesQuery && matchesCategory;
  });
};

const ListPatient = () => {
  const { handleOpenModal } = useModalAddPatientStore();
  const query = usePatientListFilterStore((state) => state.query);
  const category = usePatientListFilterStore((state) => state.category);
  const [showModalReport, setShowModalReport] = useState(false);
  const [showModalPremium, setShowModalPremium] = useState(false);

  const user = useAuth((state) => state.user);

  const { getPatients } = usePatients();

  const handleClickOpenModalAddPatient = async () => {
    if (!user?.subscriptionStatus?.status || user.subscriptionStatus.status !== 'approved') {
      // return setShowModalPremium(true);
      const { data } = await api.get('/paciente/search/');

      if (data.statusCode === 900) return setShowModalPremium(true);
    }

    handleOpenModal();
  };

  const result = useQuery({
    queryKey: ['my-patients'],
    queryFn: getPatients,
  });

  const filteredData = (result.data?.length && query.length) || category !== 'Todos' ? filterPatient(result.data ?? [], query, category) : result.data ?? [];

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <div className="scroll-out">
            {result.isLoading ? (
              Array.from({ length: 5 }).map((_, index) => <PatientItemSkeleton key={index} />)
            ) : !filteredData.length ? (
              <Empty message="Nenhum paciente encontrado" classNames="sh-30 mt-0" />
            ) : filteredData.length ? (
              <FixedSizeList
                height={300}
                itemCount={filteredData.length}
                itemSize={58}
                width="100%"
                itemData={filteredData}
                overscanCount={5}
                className="override-native overflow-auto sh-35 pe-3"
              >
                {PatientRow}
              </FixedSizeList>
            ) : (
              <div className="sh-30 d-flex flex-column align-items-center justify-content-center">
                <Icon.People />
                <div className="mt-3">Registre seu primeiro paciente e eleve suas consultas a um novo nível.</div>
              </div>
            )}
          </div>
          <div className="col-12 d-flex justify-content-center">
            {result.isLoading ? (
              <>
                <Skeleton height={40} width={180} className="me-2" style={{ borderRadius: '10px' }} />
                <Skeleton height={40} width={180} style={{ borderRadius: '10px' }} />
              </>
            ) : (
              <>
                <Button variant="primary" size="lg" className="btn-icon btn-icon-end mb-1 mt-3 me-2" onClick={handleClickOpenModalAddPatient}>
                  <span>Cadastrar paciente</span> <Icon.Plus size={20} className="ms-2" />
                </Button>
              </>
            )}
          </div>
          {/* <Button variant="primary" size="lg" className="btn-icon btn-icon-end mb-1 mt-3" onClick={() => setShowModalReport(true)}>
              <span>Reportar</span> <CsLineIcons icon="cloud-upload" />
            </Button> */}
        </Card.Body>
        <ModalReport showModal={showModalReport} />
        <ModalPremium showModal={showModalPremium} setShowModal={setShowModalPremium} />
        <PanelPatientModal />
      </Card>

      <ModalAddPatient />
      <DeleteConfirm />
    </>
  );
};

export default ListPatient;
