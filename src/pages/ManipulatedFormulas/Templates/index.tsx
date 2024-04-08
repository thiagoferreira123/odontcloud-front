import React from 'react';
import { Badge, Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useTemplateStore } from '../hooks/TemplateStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import Filters from './Filters';
import { useFiltersStore } from '../hooks/FiltersStore';
import { useManipuledFormulaStore } from '../hooks';
import { useParams } from 'react-router-dom';
import DeleteTemplateConfirmation from '../modals/DeleteTemplateConfirmation';
import { useDeleteTemplateConfirmationModalStore } from '../hooks/modals/DeleteTemplateConfirmationModalStore';
import { useAuth } from '../../Auth/Login/hook';

export default function Templates() {
  const selectedCategories = useFiltersStore((state) => state.selectedCategories);
  const content = useManipuledFormulaStore((state) => state.content);
  const query = useFiltersStore((state) => state.query);
  const showOnlyMyTemplates = useFiltersStore((state) => state.showOnlyMyTemplates);
  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();
  const user = useAuth((state) => state.user);

  const { getTemplates } = useTemplateStore();
  const { handleSelectTemplate } = useManipuledFormulaStore();
  const { handleDeleteTemplate } = useDeleteTemplateConfirmationModalStore();

  const getTemplates_ = async () => {
    try {
      const result = await getTemplates();

      if (result === false) throw new Error('Erro ao buscar fórmula manipulada');

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['manipulated-formula-templates'], queryFn: getTemplates_ });

  const filteredResult =
    result.data?.filter((template) => {
      return (
        template.nome.toLowerCase().includes(query.toLowerCase()) &&
        (selectedCategories.length === 0 || selectedCategories.some((category) => category.value === template.categoria)) &&
        (!showOnlyMyTemplates || (user && template.id_profissional == user.id))
      );
    }) ?? [];

  return (
    <>
      <Card>
        <Card.Body className="mb-n3 border-last-none">
          <label className="mb-3"> Selecione as fórmulas que deseja prescrever para o paciente</label>
          <Col className="mb-4">
            <Filters templatesResult={result} />
          </Col>
          <div className="scroll-out">
            <div className="override-native overflow-auto sh-60 pe-3">
              {result.isLoading ? (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">
                  <StaticLoading />
                </div>
              ) : result.isError ? (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">Erro ao consultar fórmulas</div>
              ) : result.data ? (
                <>
                  {filteredResult.map((template) => (
                    <div className="border-bottom border-separator-light mb-2 pb-2" key={template.id}>
                      <Row className="g-0 sh-6">
                        <Col>
                          <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
                            <div className="d-flex flex-column">
                              <div>{template.nome}</div>
                              <div>
                                <Badge bg="primary" className="me-1">
                                  {' '}
                                  <CsLineIcons icon="tag" className="me-1" size={15} />
                                  {template.categoria}
                                </Badge>
                              </div>
                            </div>
                            <div className="d-flex">
                              <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-4">Selecionar fórmula para o paciente</Tooltip>}>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="ms-1"
                                  onClick={() => handleSelectTemplate(template, queryClient, id ?? '')}
                                  disabled={content.includes(template.texto)}
                                >
                                  Selecionar
                                </Button>
                              </OverlayTrigger>
                              {template.id_profissional ? (
                                <OverlayTrigger placement="bottom" overlay={<Tooltip id="button-tooltip-4">Remover fórmula</Tooltip>}>
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    className="btn-icon btn-icon-only ms-1"
                                    onClick={() => handleDeleteTemplate(template)}
                                  >
                                    <CsLineIcons icon="bin" />
                                  </Button>
                                </OverlayTrigger>
                              ) : null}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </>
              ) : (
                <div className="h-100 w-100 d-flex justify-content-center align-items-center">Nenhuma fórmula cadastrada</div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <DeleteTemplateConfirmation />
    </>
  );
}
