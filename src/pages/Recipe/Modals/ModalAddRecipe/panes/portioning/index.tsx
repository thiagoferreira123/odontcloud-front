import { FormikErrors, FormikTouched } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';
import { MultiValue } from 'react-select';
import { Option } from '/src/types/inputs';
import { useModalAddRecipeStore } from '../../hooks/ModalAddRecipeStore';
import { buildCalcium, buildCholesterol, buildFiber, buildRecipeCalories, buildRecipeCarbohydrate, buildRecipeGrams, buildRecipeProtein, buildReciptLipid, buildSaturatedFattyAcids, buildSodium, calculatePortionNutrientByWeigth } from '../Ingredients/utils/MathHelper';
import { parseFloatNumber } from '/src/helpers/MathHelpers';
import { FormValues } from '../..';

interface PortioningProps {
  errors: FormikErrors<FormValues>;

  touched: FormikTouched<FormValues>;

  values: FormValues;

  // eslint-disable-next-line no-unused-vars
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: string | MultiValue<Option>, shouldValidate?: boolean | undefined) => void;
}

export default function Portioning(props: PortioningProps) {
  const foods = useModalAddRecipeStore((state) => state.foods);

  const setFieldValue = props.setFieldValue;

  useEffect(() => {
    const grams = buildRecipeGrams(foods);

    setFieldValue('recipeWeight', grams ? grams.toString() : '');
  }, [foods, setFieldValue]);

  useEffect(() => {
    const grams = props.values.recipeWeight ? Number(props.values.recipeWeight) : 0;
    const quantity = props.values.recipePortionQuantity ? Number(props.values.recipePortionQuantity) : 0;
    const portionWeight = quantity ? grams / quantity : 0;

    setFieldValue('recipePortionWeight', portionWeight ? parseFloatNumber(portionWeight).toString() : '');
  }, [foods, props.touched.recipeWeight, props.values.recipePortionQuantity, props.values.recipeWeight, setFieldValue]);

  const carbohydrates = useMemo(() => {
    return buildRecipeCarbohydrate(foods)
  }, [foods]);

  const proteins = useMemo(() => {
    return buildRecipeProtein(foods);
  }, [foods]);

  const lipids = useMemo(() => {
    return buildReciptLipid(foods);
  }, [foods]);

  const calories = useMemo(() => {
    return buildRecipeCalories(foods);
  }, [foods]);

  const fiber = useMemo(() => {
    return buildFiber(foods);
  }, [foods]);

  const calcium = useMemo(() => {
    return buildCalcium(foods);
  }, [foods]);

  const sodium = useMemo(() => {
    return buildSodium(foods);
  }, [foods]);

  const saturatedFattyAcids = useMemo(() => {
    return buildSaturatedFattyAcids(foods);
  }, [foods]);

  const cholesterol = useMemo(() => {
    return buildCholesterol(foods);
  }, [foods]);

  return (
    <Row className="align-items-center">
      <Col md={3}>
        <div className="top-label mb-3">
          < NumericFormat className="form-control" allowemptyformatting="true" name="recipeWeight" value={props.values.recipeWeight} onChange={props.handleChange} />
          <Form.Label>PESO TOTAL</Form.Label>
          {props.errors.recipeWeight && props.touched.recipeWeight && <div className="error">{props.errors.recipeWeight}</div>}
        </div>
      </Col>
      <Col md={6}>
        <div className="top-label mb-3">
          <Form.Control type="text" name="recipePortionName" value={props.values.recipePortionName} onChange={props.handleChange} />
          <Form.Label>NOME DA PORÇÃO</Form.Label>
          {props.errors.recipePortionName && props.touched.recipePortionName && <div className="error">{props.errors.recipePortionName}</div>}
        </div>
      </Col>
      <Col md={3}>
        <div className="top-label mb-3">
          < NumericFormat
            className="form-control"
            allowemptyformatting="true"
            name="recipePortionQuantity"
            value={props.values.recipePortionQuantity ?? ''}
            onChange={props.handleChange}
          />
          <Form.Label>NÚMERO DA PORÇÃO</Form.Label>
          {props.errors.recipePortionQuantity && props.touched.recipePortionQuantity && <div className="error">{props.errors.recipePortionQuantity}</div>}
        </div>
      </Col>

      <div className="mb-2 text-center">
        Ao totalizar os ingredientes da receita, que somam {parseFloatNumber(props.values.recipeWeight)} gramas, cada porção resultante será de{' '}
        {parseFloatNumber(props.values.recipePortionWeight)} gramas. <br></br>
        Essas porções podem ser incorporadas ao planejamento dietético do seu paciente.
      </div>

      <Col md={12}>
        <Table bordered>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">
                Nutrientes por {props.values.recipePortionName} ({parseFloatNumber(props.values.recipePortionWeight)}g){' '}
              </th>
              <th scope="col">Nutrientes por 100g </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Carboidratos (g)</th>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, carbohydrates, props.values.recipePortionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, carbohydrates, 100)}</td>
            </tr>
            <tr>
              <th>Proteínas (g)</th>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, proteins, props.values.recipePortionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, proteins, 100)}</td>
            </tr>
            <tr>
              <th>Lipídeos (g)</th>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, lipids, props.values.recipePortionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, lipids, 100)}</td>
            </tr>
            <tr>
              <th>Calorias (kcal)</th>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, calories, props.values.recipePortionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, calories, 100)}</td>
            </tr>
            <tr>
              <th>Fibras (g)</th>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, fiber, props.values.recipePortionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, fiber, 100)}</td>
            </tr>
            <tr>
              <th>Cálcio (mg)</th>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, calcium, props.values.recipePortionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, calcium, 100)}</td>
            </tr>
            <tr>
              <th>Sódio (mg)</th>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, sodium, props.values.recipePortionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, sodium, 100)}</td>
            </tr>
            <tr>
              <th>Ácidos Graxos Saturados (g)</th>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, saturatedFattyAcids, props.values.recipePortionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, saturatedFattyAcids, 100)}</td>
            </tr>
            <tr>
              <th>Colesterol (mg)</th>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, cholesterol, props.values.recipePortionWeight)}</td>
              <td>{calculatePortionNutrientByWeigth(props.values.recipeWeight, cholesterol, 100)}</td>
            </tr>
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
