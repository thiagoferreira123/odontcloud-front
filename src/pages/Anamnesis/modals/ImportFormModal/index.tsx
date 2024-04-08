import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useImportFormModalStore } from '../../hooks/modals/ImportFormModalStore';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../../components/loading/StaticLoading';
import { AnsweredForm } from '../../../../types/FormBuilder';
import { useEditModalStore } from '../../hooks/EditModalStore';
import SearchInput from './SearchInput';

const ImportFormModal = () => {
  const showModal = useImportFormModalStore((state) => state.showModal);
  const query = useImportFormModalStore((state) => state.query);
  const selectedAnamnesis = useEditModalStore((state) => state.selectedAnamnesis);

  const { hideModal, getAnsweredForms, parseAnsweredFormToHTMLString } = useImportFormModalStore();
  const { handleChangeAnamnesis } = useEditModalStore();

  const getAnsweredForms_ = async () => {
    try {
      const response = await getAnsweredForms();

      if (response === false) throw new Error('Erro ao buscar modelos de anamnese');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSelectAnsweredForm = (form: AnsweredForm) => {
    const content = parseAnsweredFormToHTMLString(form);
    handleChangeAnamnesis({ ...selectedAnamnesis, textFromAnamnesis: (selectedAnamnesis?.textFromAnamnesis ?? '') + '<br>' +  content });
    hideModal();
  };

  const result = useQuery({ queryKey: ['answered_forms'], queryFn: getAnsweredForms_, enabled: !!showModal });
  const filteredResults = result.data?.length ? result.data.filter((form: AnsweredForm) => form.nome.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Busque por um formulário pré-consulta avulso</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-4">
        <div>
        <div className="me-3">
            <label className="mb-1">Busque pelo formulário</label>
            <div className="w-100 w-md-auto search-input-container border border-separator">
              <SearchInput />
            </div>
          </div>

          <div className="scroll-out">
            <div className="override-native overflow-auto sh-30 pe-3">
              {result.isLoading ? (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                  <StaticLoading />
                </div>
              ) : result.isError ? (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">Erro ao consultar formulários pré-consulta</div>
              ) : !filteredResults.length ? (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">Nenhum formulário pré-consulta encontrado</div>
              ) : (
                <>
                  {filteredResults.map((form) => (
                    <div className="border-bottom border-separator-light mb-2 pb-2" key={form.id}>
                      <Row className="g-0 sh-6">
                        <Col>
                          <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
                            <div className="d-flex flex-column">
                              <div>{form.nome}</div>
                              <small className='text-medium'>Paciente: {form.nome_paciente}</small>
                            </div>
                            <div className="d-flex">
                              <Button variant="outline-secondary" size="sm" className="ms-1" onClick={() => handleSelectAnsweredForm(form)}>
                                Selecionar
                              </Button>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ImportFormModal;
