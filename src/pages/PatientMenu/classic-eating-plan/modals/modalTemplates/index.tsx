import React, { useMemo } from 'react';
import { Button, Col, Modal, Pagination, Row, Spinner } from 'react-bootstrap';
import SearchInput from './SearchInput';
import { useQuery } from '@tanstack/react-query';
import useClassicPlans from '../../hooks/useClassicPlans';
import { AxiosError } from 'axios';
import usePatientMenuStore from '../../../hooks/patientMenuStore';
import { ClassicPlan } from '../../../../../types/PlanoAlimentarClassico';
import api from '../../../../../services/useAxios';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';

interface ModalTemplatesProps {
  show: boolean;
  closeModal: () => void;
}

const ModalTemplates = (props: ModalTemplatesProps) => {
  const [type, setType] = React.useState('personalPlans' as 'personalPlans' | 'OdontCloudPlans' | 'reminder');
  const [selectedPage, setSelectedPage] = React.useState(1);
  const [query, setQuery] = React.useState('' as string);

  const patientId = usePatientMenuStore((state) => state.patientId);

  const { setSelectedTemplate, setSelectedPlan, setShowModalConfig } = useClassicPlans();

  const actualPage = useMemo(() => {
    const actualIndex = (selectedPage - 1) * 5;
    return [actualIndex, actualIndex + 5];
  }, [selectedPage]);

  const pages = useMemo(() => {
    const pagesArray = [];
    let page = selectedPage;

    if (page === 1) {
      page = 2;
    }

    for (let i = page - 1; i < page - 1 + 4; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  }, [selectedPage]);

  const handleSetType = (type: 'personalPlans' | 'OdontCloudPlans' | 'reminder') => {
    setSelectedPage(1);
    setType(type);
  };

  const handleSelectTemplate = async (template: ClassicPlan) => {
    setSelectedTemplate(template);
    setSelectedPlan(undefined);
    props.closeModal();
    setShowModalConfig(true);
  };

  const getClassicPlanTemplates = async () => {
    let url = 'plano_alimentar/template/professional';

    switch (type) {
      case 'personalPlans':
        url = '/plano_alimentar/template/professional';
        break;
      case 'OdontCloudPlans':
        url = '/plano_alimentar/template/shared';
        break;
      case 'reminder':
        url = '/plano_alimentar/template/reminder/' + patientId;
        break;
      default:
        break;
    }

    try {
      const response = await api.get(url);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status != 404) throw error;
      else return [];
    }
  };

  const response = useQuery({ queryKey: ['meal-templates', type], queryFn: getClassicPlanTemplates, enabled: props.show });

  const filteredTemplates = response.data
    ? response.data.filter((template: ClassicPlan) => String(template.nome).toLowerCase().includes(query.toLowerCase()))
    : [];

  const slicedTemplates = filteredTemplates ? filteredTemplates.slice(actualPage[0], actualPage[1]) : [];

  return (
    <Modal show={props.show} onHide={props.closeModal} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Escolha um modelo de refeição</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex justify-content-center mb-3 mt-2">
          <Button variant={type === 'personalPlans' ? 'primary' : 'outline-primary'} className="mb-1 ms-2" onClick={() => handleSetType('personalPlans')}>
            Meus modelos
          </Button>{' '}
          <Button variant={type === 'OdontCloudPlans' ? 'primary' : 'outline-primary'} className="mb-1 ms-2" onClick={() => handleSetType('OdontCloudPlans')}>
            Modelos do OdontCloud
          </Button>{' '}
          <Button variant={type === 'reminder' ? 'primary' : 'outline-primary'} className="mb-1 ms-2" onClick={() => handleSetType('reminder')}>
            Recordatórios
          </Button>{' '}
        </div>

        <Row className="d-flex align-items-end mt-3 mb-3">
          <div className="me-3">
            <div className="w-100 w-md-auto search-input-container border border-separator">
              <SearchInput query={query} setQuery={setQuery} placeholder={`Digite o nome da ${type === 'reminder' ? 'receita' : 'refeição'}`} />
            </div>
          </div>
        </Row>

        {response.isLoading ? (
          <div className="w-100 d-flex justify-content-center p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : response.isError ? (
          <div className="w-100 d-flex justify-content-center p-5">Erro ao carregar os modelos de plano alimentar.</div>
        ) : filteredTemplates && filteredTemplates.length ? (
          slicedTemplates.map((template: ClassicPlan) => (
            <div className="border-bottom border-separator-light  mb-2 pb-2" key={template.id}>
              <Row className="g-0 sh-6 pointer" onClick={() => handleSelectTemplate(template)}>
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{template.nome}</div>
                    </div>
                    <div className="d-flex">
                      <div className="d-flex flex-row ms-3">
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">CHO</div>
                          <div className="text-alternate">{template.vrCarboidratos}%</div>
                        </div>
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">PTN</div>
                          <div className="text-alternate">{template.vrProteinas}%</div>
                        </div>
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">LIP</div>
                          <div className="text-alternate">{template.vrLipideos}%</div>
                        </div>
                        <div className="d-flex flex-column align-items-center ms-5">
                          <div className="text-muted text-small">KCAL</div>
                          <div className="text-alternate">{template.vrCalorias}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <div className="w-100 d-flex justify-content-center p-5">Nenhum modelo de plano alimentar encontrado.</div>
        )}

        {/* Footer */}
        <div className="d-flex justify-content-center mt-4 mb-0">
          <nav>
            <Pagination className="bordered">
              <Pagination.Prev onClick={() => setSelectedPage(selectedPage - 1)} disabled={selectedPage === 1}>
                <CsLineIcons icon="chevron-left" />
              </Pagination.Prev>
              {pages.map((page) => (
                <Pagination.Item key={page} onClick={() => setSelectedPage(page)} active={selectedPage === page} disabled={page > filteredTemplates.length / 5}>
                  {page}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setSelectedPage(selectedPage + 1)} disabled={selectedPage >= filteredTemplates.length / 5}>
                <CsLineIcons icon="chevron-right" />
              </Pagination.Next>
            </Pagination>
          </nav>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalTemplates;
