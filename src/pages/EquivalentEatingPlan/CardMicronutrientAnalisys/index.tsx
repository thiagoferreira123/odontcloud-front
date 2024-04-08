import React, { useCallback, useEffect, useState } from 'react';
import { Card, Col, Container, Row, Table, Accordion, useAccordionButton, Button } from 'react-bootstrap';
import { useEquivalentEatingPlanStore } from '../hooks/equivalentEatingPlanStore';
import { parseFloatNumber } from '/src/helpers/MathHelpers';
import {
  calories,
  caloriesPercentage,
  carbohydrate,
  carbohydratePercentage,
  fat,
  fatPercentage,
  protein,
  proteinPercentage,
  totalCalories,
  totalCarbohydrate,
  totalFat,
  totalProteins,
} from '../meal/utils/MathHelpers';
import useMacrosStore from '../hooks/useMacrosStore';
import CalorieDistributionGraph from './CalorieDistributionGraph';
import FoodGroupChart from './FoodGroupChart';
import { useEquivalentEatingPlanListStore } from '../hooks/equivalentPlanListStore';
import { calculateGroupData } from './utils/MathHelpers';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';

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

interface GroupValue {
  id: number;
  title: string;
  name: string;
  total: number;
  percentage: number;
  grams: number;
  color: string;
}

const CardMicronutrientAnalisys = () => {
  const meals = useEquivalentEatingPlanStore((state) => state.meals);

  const vrPeso = useMacrosStore((state) => state.vrPeso);

  const selectedFoods = useEquivalentEatingPlanStore((state) => state.selectedFoods);
  const listGroups = useEquivalentEatingPlanListStore((state) => state.listGroups);

  const [groupValues, setGroupValues] = useState<GroupValue[]>([]);

  const { getSelectedGroups } = useEquivalentEatingPlanListStore();

  const buildGroupValues = useCallback(async () => {
    const groupValues = await Promise.all(
      getSelectedGroups(selectedFoods, listGroups).map(async (group) => {
        return await calculateGroupData(selectedFoods, group, meals);
      })
    );

    // const groupValues = await Promise.all(getSelectedGroups(selectedFoods, listGroups).map(async (group) => await calculateGroupData(selectedFoods, group, getGroupFoods)));
    setGroupValues(groupValues);
  }, [getSelectedGroups, listGroups, meals, selectedFoods]);

  useEffect(() => {
    buildGroupValues();
  }, [buildGroupValues]);

  return (
    <Container>
      {/* OFF adequação de micronutrientes */}
      <Row>
        <Col xs="12">
          <Accordion className="mb-n2" defaultActiveKey="2">
            <Card className="d-flex mb-5 flex-grow-1 mt-2">
              <CustomAccordionToggle eventKey="1" customClass="text-danger">
                Relatório e adequação de micronutrientes
              </CustomAccordionToggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body className="pt-0">
                  <div className="mdsa-footer-message mx-5 mt-0">
                    <CsLineIcons icon="info-hexagon" className='me-2' />
                    <span>Não se avalia adequação de micronutrientes no método por equivalentes</span>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>

      {/* Por Refeição */}
      <Row>
        <Col xs="12">
          <Accordion className="mb-n2" defaultActiveKey="2">
            <Card className="d-flex mb-2 flex-grow-1">
              <CustomAccordionToggle eventKey="1">Macronutrientes e distribuição calórica por refeição</CustomAccordionToggle>
              <Accordion.Collapse eventKey="1">
                <Card.Body className="pt-0">
                  <Table striped>
                    <thead>
                      <tr>
                        <th scope="col">Refeições | Horários</th>
                        <th scope="col">Carboidratos (g)</th>
                        <th scope="col">Proteínas (g)</th>
                        <th scope="col">Lípideos (g)</th>
                        <th scope="col">Calorias (kcal)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meals.map((meal) => (
                        <tr key={meal.id}>
                          <td>
                            {meal.nome} - {meal.horario.slice(0, 5)}
                          </td>
                          <td>
                            {parseFloatNumber(carbohydrate(meal.alimentos))} ({carbohydratePercentage(meal.alimentos, meals)}%)
                          </td>
                          <td>
                            {parseFloatNumber(protein(meal.alimentos))} ({proteinPercentage(meal.alimentos, meals)}%)
                          </td>
                          <td>
                            {parseFloatNumber(fat(meal.alimentos))} ({fatPercentage(meal.alimentos, meals)}%)
                          </td>
                          <td>
                            {parseFloatNumber(calories(meal.alimentos))} ({caloriesPercentage(meal.alimentos, meals)}%)
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <th className="fw-bolder">Somatória de macronutrientes</th>
                        <th className="fw-bolder">{parseFloatNumber(totalCarbohydrate(meals))}</th>
                        <th className="fw-bolder">{parseFloatNumber(totalProteins(meals))}</th>
                        <th className="fw-bolder">{parseFloatNumber(totalFat(meals))}</th>
                        <th className="fw-bolder">{parseFloatNumber(totalCalories(meals))}</th>
                      </tr>

                      <tr>
                        <th className="fw-bolder">Total por kilo de peso corporal</th>
                        <th className="fw-bolder">{Number(vrPeso) ? parseFloatNumber(totalCarbohydrate(meals) / Number(vrPeso)) + 'g/kg' : 0}</th>
                        <th className="fw-bolder">{Number(vrPeso) ? parseFloatNumber(totalProteins(meals) / Number(vrPeso)) + 'g/kg' : 0}</th>
                        <th className="fw-bolder">{Number(vrPeso) ? parseFloatNumber(totalFat(meals) / Number(vrPeso)) + 'g/kg' : 0}</th>
                        <th className="fw-bolder">{Number(vrPeso) ? parseFloatNumber(totalCalories(meals) / Number(vrPeso)) + 'g/kg' : 0}</th>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Col>
      </Row>

      {/* Gráficos de distribuição calórica */}
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
                        {groupValues.map((group) => (
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
                      <FoodGroupChart groupValues={groupValues} />
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
