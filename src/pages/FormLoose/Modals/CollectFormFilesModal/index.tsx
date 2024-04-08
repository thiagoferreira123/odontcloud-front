import React from 'react';
import { Modal, Row } from 'react-bootstrap';
import { useCollectFormFilesModalStore } from '../../Hooks/modals/CollectFormFilesModalStore';
import SearchInput from './SearchInput';
import usePatients from '../../../../hooks/usePatients';
import { useQuery } from '@tanstack/react-query';
import { Patient } from '../../../../types/Patient';
import StaticLoading from '../../../../components/loading/StaticLoading';
import { FixedSizeList } from 'react-window';
import PatientRow from './PatientRow';

const CollectFormFilesModal = () => {
  const showModal = useCollectFormFilesModalStore((state) => state.showModal);
  const query = useCollectFormFilesModalStore((state) => state.query);

  const { hideModal } = useCollectFormFilesModalStore();
  const { getPatients } = usePatients();

  const getPatients_ = async () => {
    try {
      const response = await getPatients();

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['my-patients'], queryFn: getPatients_ });

  const filteredResults = result.data ? result.data.filter((patient: Patient) => String(patient.name).toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Selecione um paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <Row className="d-flex align-items-end mb-4">
          <div className="me-3">
            <div className="w-100 w-md-auto search-input-container border border-separator">
              <SearchInput />
            </div>
          </div>
        </Row>

        <div className="scroll-out">
          {result.isLoading ? (
            <div className="h-100 w-100 d-flex justify-content-center align-items-center">
              <StaticLoading />
            </div>
          ) : result.isError ? (
            <div className="h-100 w-100 d-flex justify-content-center align-items-center">Erro ao consultar pacientes</div>
          ) : !filteredResults.length ? (
            <div className="h-100 w-100 d-flex justify-content-center align-items-center">Nenhum paciente encontrado</div>
          ) : (
            <FixedSizeList
              height={300}
              itemCount={filteredResults.length}
              itemSize={58}
              width={'100%'}
              itemData={filteredResults}
              overscanCount={5}
              className="override-native overflow-auto sh-35 pe-3"
            >
              {PatientRow}
            </FixedSizeList>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CollectFormFilesModal;
