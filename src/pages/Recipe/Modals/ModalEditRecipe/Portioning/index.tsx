import React, { useEffect, useMemo, useState } from 'react';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { parseFloatNumber } from '/src/helpers/MathHelpers';
import { regexNumberFloat } from '/src/helpers/InputHelpers';
import { useEditReciptStore } from '/src/pages/Recipe/hooks/EditRecipeStore';
import { buildCalcium, buildCholesterol, buildFiber, buildRecipeCalories, buildRecipeCarbohydrate, buildRecipeProtein, buildReciptLipid, buildSaturatedFattyAcids, buildSodium, calculatePortionNutrientByWeigth } from '../../ModalAddRecipe/panes/Ingredients/utils/MathHelper';

export default function Portioning() {
  const [totalWeight, setTotalWeight] = useState('' as string);
  const [portionQuantity, setPortionQuantity] = React.useState('' as string);
  const [portionName, setPortionName] = React.useState('' as string);

  const selectedRecipe = useEditReciptStore((state) => state.selectedRecipe);

  // const foods = useMemo(() => {
  //   const result = selectedRecipe?.alimentos ?? [].map(food => food.food) ?? [];
  //   return result.filter(notEmpty) ?? [];
  // }, [selectedRecipe]);

  const { updateSelectedRecipe } = useEditReciptStore();

  const handleUpdateRecipe = () => {
    updateSelectedRecipe({
      peso_receita: parseFloatNumber(totalWeight),
      porcao_receita: portionName,
      quantidade_porcao: parseFloatNumber(portionQuantity),
    });
  };

  const handleChangePortionWeigth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTotalWeight(parseFloatNumber(Number(regexNumberFloat(value)) * Number(portionQuantity)).toString());
  };

  const handleChangePortionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPortionName(event.target.value);
  };

  const handleChangePortionQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPortionQuantity(regexNumberFloat(event.target.value));
  };

  const handleChangeTotalWeigth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTotalWeight(regexNumberFloat(event.target.value));
  };

  const portionWeight = parseFloatNumber(Number(totalWeight) / Number(portionQuantity)).toString();

  const carbohydrates = useMemo(() => {
    return buildRecipeCarbohydrate(selectedRecipe?.alimentos ?? [])
  }, [selectedRecipe?.alimentos]);

  const proteins = useMemo(() => {
    return buildRecipeProtein(selectedRecipe?.alimentos ?? []);
  }, [selectedRecipe?.alimentos]);

  const lipids = useMemo(() => {
    return buildReciptLipid(selectedRecipe?.alimentos ?? []);
  }, [selectedRecipe?.alimentos]);

  const calories = useMemo(() => {
    return buildRecipeCalories(selectedRecipe?.alimentos ?? []);
  }, [selectedRecipe?.alimentos]);

  const fiber = useMemo(() => {
    return buildFiber(selectedRecipe?.alimentos ?? []);
  }, [selectedRecipe?.alimentos]);

  const calcium = useMemo(() => {
    return buildCalcium(selectedRecipe?.alimentos ?? []);
  }, [selectedRecipe?.alimentos]);

  const sodium = useMemo(() => {
    return buildSodium(selectedRecipe?.alimentos ?? []);
  }, [selectedRecipe?.alimentos]);

  const saturatedFattyAcids = useMemo(() => {
    return buildSaturatedFattyAcids(selectedRecipe?.alimentos ?? []);
  }, [selectedRecipe?.alimentos]);

  const cholesterol = useMemo(() => {
    return buildCholesterol(selectedRecipe?.alimentos ?? []);
  }, [selectedRecipe?.alimentos]);

  useEffect(() => {
    if (!selectedRecipe) return;

    setTotalWeight(parseFloatNumber(selectedRecipe.peso_receita).toString());
    setPortionName(selectedRecipe.porcao_receita ?? '');
    setPortionQuantity(parseFloatNumber(selectedRecipe.quantidade_porcao).toString());
  }, [selectedRecipe]);

  return (
    <Row className="align-items-center">
      <Col md={2}>
        <div className="top-label mb-3">
          < NumericFormat className="form-control" allowemptyformatting="true" value={totalWeight} onChange={handleChangeTotalWeigth} onBlur={handleUpdateRecipe} />
          <Form.Label>PESO TOTAL</Form.Label>
        </div>
      </Col>
      <Col md={6}>
        <div className="top-label mb-3">
          <Form.Control type="text" name="recipePortionName" value={portionName} onChange={handleChangePortionName} onBlur={handleUpdateRecipe} />
          <Form.Label>NOME DA PORÇÃO</Form.Label>
        </div>
      </Col>
      <Col md={2}>
        <div className="top-label mb-3">
          < NumericFormat className="form-control" allowemptyformatting="true" value={portionWeight} onChange={handleChangePortionWeigth} onBlur={handleUpdateRecipe} />
          <Form.Label>PESO TOTAL</Form.Label>
        </div>
      </Col>
      <Col md={2}>
        <div className="top-label mb-3">
          < NumericFormat
            className="form-control"
            allowemptyformatting="true"
            name="recipePortionQuantity"
            value={portionQuantity}
            onChange={handleChangePortionQuantity}
            onBlur={handleUpdateRecipe}
          />
          <Form.Label>NÚMERO DA PORÇÃO</Form.Label>
        </div>
      </Col>

      <div className="mb-2 text-center">
        Ao totalizar os ingredientes da receita, que somam {parseFloatNumber(totalWeight)} gramas, cada porção resultante será de{' '}
        {parseFloatNumber(portionWeight)} gramas. <br></br>
        Essas porções podem ser incorporadas ao planejamento dietético do seu paciente.
      </div>

      <Col md={12}>
        <Table bordered>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">
                Nutrientes por {portionName} ({parseFloatNumber(portionWeight)}g){' '}
              </th>
              <th scope="col">Nutrientes por 100g </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Carboidratos (g)</th>
              <td>{calculatePortionNutrientByWeigth(totalWeight, carbohydrates, portionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(totalWeight, carbohydrates, 100)}</td>
            </tr>
            <tr>
              <th>Proteínas (g)</th>
              <td>{calculatePortionNutrientByWeigth(totalWeight, proteins, portionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(totalWeight, proteins, 100)}</td>
            </tr>
            <tr>
              <th>Lipídeos (g)</th>
              <td>{calculatePortionNutrientByWeigth(totalWeight, lipids, portionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(totalWeight, lipids, 100)}</td>
            </tr>
            <tr>
              <th>Calorias (kcal)</th>
              <td>{calculatePortionNutrientByWeigth(totalWeight, calories, portionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(totalWeight, calories, 100)}</td>
            </tr>
            <tr>
              <th>Fibras (g)</th>
              <td>{calculatePortionNutrientByWeigth(totalWeight, fiber, portionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(totalWeight, fiber, 100)}</td>
            </tr>
            <tr>
              <th>Cálcio (mg)</th>
              <td>{calculatePortionNutrientByWeigth(totalWeight, calcium, portionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(totalWeight, calcium, 100)}</td>
            </tr>
            <tr>
              <th>Sódio (mg)</th>
              <td>{calculatePortionNutrientByWeigth(totalWeight, sodium, portionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(totalWeight, sodium, 100)}</td>
            </tr>
            <tr>
              <th>Ácidos Graxos Saturados (g)</th>
              <td>{calculatePortionNutrientByWeigth(totalWeight, saturatedFattyAcids, portionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(totalWeight, saturatedFattyAcids, 100)}</td>
            </tr>
            <tr>
              <th>Colesterol (mg)</th>
              <td>{calculatePortionNutrientByWeigth(totalWeight, cholesterol, portionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(totalWeight, cholesterol, 100)}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
