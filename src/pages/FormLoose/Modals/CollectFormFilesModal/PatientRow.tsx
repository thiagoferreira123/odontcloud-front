import React, { useState } from 'react';
import { ListChildComponentProps } from 'react-window';
import { Patient } from '../../../../types/Patient';
import { Col, Row } from 'react-bootstrap';
import { getAvatarByGender } from '../../../PatientMenu/hooks/patientMenuStore';
import { useCollectFormFilesModalStore } from '../../Hooks/modals/CollectFormFilesModalStore';
import AsyncButton from '../../../../components/AsyncButton';

export default React.memo(function PatientRow({ data, index, style }: ListChildComponentProps<Patient[]>) {
  const patient = data[index];
  const [isLoading, setIsLoading] = useState(false);

  const selectedForm = useCollectFormFilesModalStore((state) => state.selectedForm);
  const { handleSelectPatient, hideModal } = useCollectFormFilesModalStore();

  const handleSelectPatient_ = async () => {
    setIsLoading(true);
    const response = selectedForm && (await handleSelectPatient(patient, selectedForm));
    setIsLoading(false);
    response?.length && hideModal();
  };

  return (
    <div className="border-bottom border-separator-light mb-2 pb-2" key={patient.id} style={style}>
      <Row className="g-0 sh-6 mb-2" key={patient.id}>
        <Col xs="auto">
          <img src={patient.photoLink ? patient.photoLink : getAvatarByGender(patient.gender)} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
        </Col>
        <Col>
          <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
            <div className="d-flex flex-column">
              <div>{patient.name}</div>
            </div>
            <div className="d-flex">
              <AsyncButton isSaving={isLoading} loadingText='Coletando...' variant="outline-secondary" size="sm" className="ms-1" onClickHandler={handleSelectPatient_}>
                Selecionar
              </AsyncButton>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});
