import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalAddPatient from './modals/ModalAddPatient/index.tsx';
import { useQuery } from '@tanstack/react-query';
import usePatientStore from './hooks/PatientStore.ts';
import { Patient } from '../../../types/Patient.ts';
import { useModalAddPatientStore } from './hooks/ModalAddPatientStore.ts';
import DeleteConfirm from './modals/DeleteConfirm.tsx';
import { usePatientListFilterStore } from './hooks/PatientListFilterStore.ts';
import { FixedSizeList } from 'react-window';
import PatientRow from './PatientRow.tsx';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ModalPremium from '../ModalPremium.tsx';
import Empty from '../../../components/Empty.tsx';

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

const filterPatient = (patients: (Patient & { patient_id: string })[], query: string) => {
  return patients.filter((patient) => {
    let matchesQuery = true;

    if (query.length) {
      matchesQuery = patient.patient_full_name.toLowerCase().includes(query.toLowerCase());
    }

    return matchesQuery;
  });
};

const ListPatient = () => {
  const { handleOpenModal } = useModalAddPatientStore();
  const query = usePatientListFilterStore((state) => state.query);
  const [showModalPremium, setShowModalPremium] = useState(false);

  const { getPatients } = usePatientStore();

  const handleClickOpenModalAddPatient = async () => {
    handleOpenModal();
  };

  const result = useQuery({
    queryKey: ['my-patients'],
    queryFn: getPatients,
  });

  const filteredData = (result.data?.length && query.length) ? filterPatient(result.data ?? [], query) : result.data ?? [];

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
        </Card.Body>
        <ModalPremium showModal={showModalPremium} setShowModal={setShowModalPremium} />
      </Card>

      <ModalAddPatient />
      <DeleteConfirm />
    </>
  );
};

export default ListPatient;
