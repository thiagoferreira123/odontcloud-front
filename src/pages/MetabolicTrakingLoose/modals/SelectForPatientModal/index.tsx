import React from 'react';
import { Modal, Row } from 'react-bootstrap';
import SearchInput from './SearchInput';
import { useQuery } from '@tanstack/react-query';
import { FixedSizeList } from 'react-window';
import PatientRow from './PatientRow';
import { useSelectTrackingForPatientModalStore } from '../../hooks/SelectTrackingForPatientModalStore';
import usePatientStore from '../../../Dashboard/patientsPatientStore';
import { Patient } from '../../../../types/Patient';
import StaticLoading from '../../../../components/loading/StaticLoading';

const SelectTrackingForPatientModal = () => {
  const showModal = useSelectTrackingForPatientModalStore((state) => state.showModal);
  const query = useSelectTrackingForPatientModalStore((state) => state.query);

  const { hideModal } = useSelectTrackingForPatientModalStore();
  const { getPatients } = usePatientStore();

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

export default SelectTrackingForPatientModal;
