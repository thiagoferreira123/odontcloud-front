import React, { useCallback } from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import TemplateMealSelect from './TemplateMealSelect';
import { useQuery } from '@tanstack/react-query';
import { TemplateMeal, useTemplateMealStore } from '../hooks/TemplateMealStore';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useQualitativeEatingPlanStore } from '../hooks/QualitativeEatingPlanStore';
import { useFilterStore } from '../hooks/FilterStore';
import SearchInput from './SearchInput';
import { useParams } from 'react-router-dom';
import { useDeleteTemplateConfirmationModalStore } from '../hooks/modals/DeleteMealConfirmationModalStore';

export default function TemplateMeals() {
  const templateMeals = useTemplateMealStore((state) => state.templateMeals);
  const qualitativeEatingPlanMealOptions = useFilterStore((state) => state.qualitativeEatingPlanMealOptions);
  const query = useFilterStore((state) => state.query);
  const { id } = useParams();

  const { getTemplateMeals } = useTemplateMealStore();
  const { handleDeleteTemplateMeal } = useDeleteTemplateConfirmationModalStore();
  const { handleSelectTemplateMeal } = useQualitativeEatingPlanStore();

  const getTemplateMeals_ = useCallback(async () => {
    try {
      const templateMeals = await getTemplateMeals();

      if (templateMeals === false) throw new Error('Erro ao buscar templateMeales');

      return templateMeals;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [getTemplateMeals]);

  const handleSelectTemplate = (template: TemplateMeal) => {
    if (!id) return console.error('id is not defined');
    handleSelectTemplateMeal({ ...template, qualitativePlanId: +id });
  };

  const result = useQuery({ queryKey: ['qualitative-template-meals'], queryFn: getTemplateMeals_ });
  const filteredResult = templateMeals.length
    ? templateMeals.filter((template) => {
        return (
          (qualitativeEatingPlanMealOptions.length > 0 ? qualitativeEatingPlanMealOptions.find((option) => option.label === template.category) : true) &&
          template.name.toLowerCase().includes(query.toLowerCase())
        );
      })
    : [];

  return (
    <Card>
      <Card.Body>
        <label>Selecione as refeições</label>
        <Row>
          <Col xxl="6" className="mb-3 mt-2">
            <TemplateMealSelect isLoading={result.isLoading} />
          </Col>
          <Col xxl="6" className="mb-3 mt-2">
            <div className="w-100 w-md-auto search-input-container border border-separator">
              <SearchInput />
            </div>
          </Col>
        </Row>

        <div className="scroll-out">
          <div className="override-native overflow-auto sh-60 pe-3">
            {result.isLoading ? (
              <div className="h-100 w-100 d-flex align-items-center">
                <StaticLoading />
              </div>
            ) : !templateMeals.length ? (
              <div className="h-100 w-100 d-flex align-items-center">
                <Empty message="Nenhum modelo de refeição cadastrado" />
              </div>
            ) : (
              filteredResult.map((template) => (
                <div className="border-bottom border-separator-light mb-2 pb-2" key={template.id}>
                  <Row className="g-0 sh-6">
                    <Col>
                      <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                          <div>{template.name}</div>
                          {template.category ? (
                            <div>
                              <Badge bg="primary" className="me-1">
                                {' '}
                                <CsLineIcons icon="tag" className="me-1" size={15} />
                                {template.category}
                              </Badge>
                            </div>
                          ) : null}
                        </div>
                        <div className="d-flex">
                          <Button variant="outline-secondary" size="sm" className="ms-1" onClick={() => handleSelectTemplate(template)}>
                            Selecionar
                          </Button>
                          {template.professional_id ? (
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="btn-icon btn-icon-only mb-1 ms-1"
                              onClick={() => handleDeleteTemplateMeal(template)}
                            >
                              <CsLineIcons icon="bin" />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
