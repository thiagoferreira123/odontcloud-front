import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import ModalAddSecretary from './ModalAddSecretary';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useSecretaryStore } from '../../../hooks/professional/SecretaryStore';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import { useModalAddSecretaryStore } from './hooks/ModalAddSecretaryStore';
import { useDeleteConfirmationModalStore } from './hooks/DeleteConfirmationModalStore';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Empty from '../../../components/Empty';

const Secretary = () => {
  const { getSecretaries } = useSecretaryStore();
  const { handleShowModalAddSecretaryStore, handleSelectSecretary } = useModalAddSecretaryStore();
  const { setDeleteSelectedSecretary } = useDeleteConfirmationModalStore();

  const getServiceSecreataries_ = async () => {
    try {
      const response = await getSecretaries();

      if (response === false) throw new Error('Error on get service secretaries');

      return response;
    } catch (error) {
      console.error('Error on get service secretaries', error);
      throw error;
    }
  };

  const resultSecretaries = useQuery({ queryKey: ['my-secretaries'], queryFn: getServiceSecreataries_ });

  return (
    <>
      {resultSecretaries.isLoading ? (
        <div className="sh-30 d-flex align-items-center justify-content-center">
          <StaticLoading />
        </div>
      ) : resultSecretaries.isError ? (
        <div className="sh-30 d-flex align-items-center justify-content-center">Ocorreu um erro ao carregar os acessos aos locais de atendimento</div>
      ) : resultSecretaries.data && resultSecretaries.data.length ? (
        resultSecretaries.data.map((secretary) => (
          <div className="border-bottom border-separator-light mb-2 pb-2" key={secretary.id}>
            <Row className="g-0 sh-6">
              <Col>
                <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
                  <div className="d-flex flex-column">
                    <div>{secretary.nome}</div>
                    <div className="text-medium text-muted">{secretary.email}</div>
                  </div>
                  <div className="d-flex">
                    <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleSelectSecretary(secretary)}>
                      <CsLineIcons icon="edit" />
                    </Button>
                    <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => setDeleteSelectedSecretary(secretary)}>
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
      <ModalAddSecretary />
      <DeleteConfirmationModal />
      <div className="text-center mb-3">
        <Button type="submit" size="lg" variant="primary" onClick={handleShowModalAddSecretaryStore}>
          Cadastrar local de atendimento
        </Button>
      </div>
    </>
  );
};

export default Secretary;
