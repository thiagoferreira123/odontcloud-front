import React from 'react';
import { Card, Col, Container, Row, Accordion, useAccordionButton, Button, Table } from 'react-bootstrap';
import MicronutrientAdequacyReport from './MicronutrientAdequacyReport';
import MacronutrientsByMeal from './MacronutrientsByMeal';
import CalorieDistributionGraph from './CalorieDistributionGraph';
import useClassicPlan from '../hooks/useClassicPlan';
import FoodGroupChart from './FoodGroupChart';
import { parseFloatNumber } from '/src/helpers/MathHelpers';
import { getFoodGroups } from './utils/FoodGroup';
import useFoods from '/src/hooks/useFoods';
import { ClassicPlanMealFood } from '/src/types/PlanoAlimentarClassico';

function CustomAccordionToggle({ children, eventKey, customClass }: { children: React.ReactNode; eventKey: string; customClass?: string }) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {});

  return (
    <Card.Body className="py-4" onClick={decoratedOnClick} role="button">
      <Button variant="link" className={`list-item-heading p-0 ${customClass ?? ''}`}>
        {children}
      </Button>
    </Card.Body>
  );
}

const CardMicronutrientAnalisys = () => {

  const meals = useClassicPlan(state => state.meals);
  const foods = useFoods(state => state.foods);

  const mealFoods = meals.reduce((foods: ClassicPlanMealFood[], meal) => {
    foods.push(...meal.alimentos);
    return foods;
  }, []);

  const groups = getFoodGroups(mealFoods, foods);

  return (
    <Container>
      <Row>
        <Col xs="12">
          <Accordion className="mb-n2" defaultActiveKey="2">
            <Card className="d-flex mb-5 flex-grow-1 mt-2">
              <CustomAccordionToggle eventKey="1">Relatório e adequação de micronutrientes</CustomAccordionToggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <MicronutrientAdequacyReport />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>
      <Row>
        <Col xs="12">
          <Accordion className="mb-n2" defaultActiveKey="2">
            <Card className="d-flex mb-2 flex-grow-1">
              <CustomAccordionToggle eventKey="1">Macronutrientes e distribuição calórica por refeição</CustomAccordionToggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body className="pt-0">
                  <MacronutrientsByMeal />
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>

      <Row>
        <Col xs="12">
          <Accordion className="mb-n2" defaultActiveKey="2">
            <Card className="d-flex mb-5 flex-grow-1 mt-4">
              <CustomAccordionToggle eventKey="1">Gráficos de distribuição calórica por refeição</CustomAccordionToggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body className="pt-0">
                  <div className="sh-35">
                    <CalorieDistributionGraph meals={meals} />
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
        <Col xs="12">
          <Accordion className="mb-n2" defaultActiveKey="2">
          <Card className="d-flex mb-5 flex-grow-1">
              <CustomAccordionToggle eventKey="1">Gráfico de grupos alimentares</CustomAccordionToggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body className="pt-0">
                  <div className="d-flex">
                    <Table striped className="w-50">
                      <thead>
                        <tr>
                          <th scope="col">Grupo Alimentar</th>
                          <th scope="col">Qtd (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groups.map((group) => (
                          <tr key={group.id}>
                            <td>{group.title}</td>
                            <td>
                              {parseFloatNumber(group.grams)}g - ({parseFloatNumber(group.percentage)}%)
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="sh-45 w-50">
                      <FoodGroupChart groupValues={groups} />
                    </div>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
};

export default CardMicronutrientAnalisys;
