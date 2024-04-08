import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import ModalAddServiceLocation from './modals/ModalAddServiceLocation';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useServiceLocationStore } from '../../../hooks/professional/ServiceLocationStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import { useModalAddLocalStore } from './hooks/ModalAddLocalStore';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import { useDeleteConfirmationModalStore } from './hooks/DeleteConfirmationModalStore';
import Empty from '../../../components/Empty';

const ServiceLocation = () => {
  const queryClient = useQueryClient();

  const selectedLocation = useServiceLocationStore((state) => state.selectedLocation);

  const { getServiceLocations, handleToggleLocationStatus } = useServiceLocationStore();
  const { handleShowModalAddLocalStore, handleSelectLocal } = useModalAddLocalStore();
  const { setDeleteSelectedLocation } = useDeleteConfirmationModalStore();

  const getServiceLocations_ = async () => {
    try {
      const response = await getServiceLocations();

      if (response === false) throw new Error('Error on get service locations');

      return response;
    } catch (error) {
      console.error('Error on get service locations', error);
      throw error;
    }
  };

  const resultLocals = useQuery({ queryKey: ['my-locals'], queryFn: getServiceLocations_ });

  return (
    <>
      {resultLocals.isLoading ? (
        <div className="sh-30 d-flex align-items-center justify-content-center">
          <StaticLoading />
        </div>
      ) : resultLocals.isError ? (
        <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao carregar os locais de atendimento</div>
      ) : resultLocals.data && resultLocals.data.length ? (
        resultLocals.data.map((local) => (
          <div className="border-bottom border-separator-light mb-2 pb-2" key={local.id}>
            <Row className="g-0 sh-6">
              <Col xs="auto" className="d-flex align-items-center">
                <label className="form-check custom-icon mb-0 checked-opacity-75">
                  <input
                    type="radio"
                    name='ativo'
                    className="form-check-input"
                    checked={local.id === selectedLocation?.id}
                    value={local.id}
                    onChange={() => handleToggleLocationStatus(local, queryClient)}
                  />
                </label>
                <img
                  src={local.logo ? `https://${local.url_base_logo}/${local.logo}` : '/img/product/dietsystem.webp'}
                  className="card-img rounded-xl sh-6 sw-6"
                  alt="thumb"
                />
              </Col>
              <Col>
                <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                  <div className="d-flex flex-column">
                    <div>{local.nome}</div>
                    <div className="text-medium text-muted">
                      {local.rua}, {local.numero}, {local.cidade} - {local.uf}
                    </div>
                  </div>
                  <div className="d-flex">
                    <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectLocal(local)}>
                      <CsLineIcons icon="edit" />
                    </Button>
                    <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => setDeleteSelectedLocation(local)}>
                      <CsLineIcons icon="bin" />
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        ))
      ) : (
        <div className="sh-30 d-flex align-items-center justify-content-center"><Empty classNames='mt-0' /></div>
      )}

      <div className="text-center mb-3">
        <Button type="submit" size="lg" variant="primary" onClick={handleShowModalAddLocalStore}>
          Cadastrar local de atendimento
        </Button>
      </div>

      <ModalAddServiceLocation />
      <DeleteConfirmationModal />
    </>
  );
};

export default ServiceLocation;
