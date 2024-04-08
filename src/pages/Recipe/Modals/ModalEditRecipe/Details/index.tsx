import { useEditReciptStore } from '/src/pages/Recipe/hooks/EditRecipeStore';
import React, { useEffect } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { NumericFormat } from 'react-number-format';

export default function Details() {
  const selectedRecipe = useEditReciptStore((state) => state.selectedRecipe);

  const [name, setName] = React.useState('' as string);
  const [description, setDescription] = React.useState('' as string);
  const [timeOfPreparation, setTimeOfPreparation] = React.useState('' as string);

  const { updateSelectedRecipe } = useEditReciptStore();

  const handleUpdateRecipe = () => {
    updateSelectedRecipe({
      nome: name,
      descricao: description,
      tempo_preparo: timeOfPreparation,
    });
  };

  const handleChangeRecipeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeRecipeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleChangeTimeOfPreparation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeOfPreparation(event.target.value);
  };

  useEffect(() => {
    if (!selectedRecipe) return;

    setName(selectedRecipe.nome);
    setDescription(selectedRecipe.descricao ?? '');
    setTimeOfPreparation(selectedRecipe.tempo_preparo.slice(0, 5) ?? '');
  }, [selectedRecipe]);

  return (
    <>
      <Row>
        <Col md={3}>
          <Form.Floating className="mb-3">
            <Form.Control type="text" placeholder="Nome" value={name} onChange={handleChangeRecipeName} onBlur={handleUpdateRecipe} />
            <label>Nome da receita</label>
          </Form.Floating>
        </Col>
        <Col md={7}>
          <Form.Floating className="mb-3">
            <Form.Control type="text" placeholder="Descrição" value={description} onChange={handleChangeRecipeDescription} onBlur={handleUpdateRecipe} />
            <label>Descricao da receita</label>
          </Form.Floating>
        </Col>
        <Col md={2}>
          <Form.Floating className="mb-3">
            < NumericFormat
              className="form-control"
              format="##:##"
              mask="_"
              placeholder="HH:MM"
              allowemptyformatting="true"
              value={timeOfPreparation}
              onChange={handleChangeTimeOfPreparation}
              onBlur={handleUpdateRecipe}
            />
            <label>Tempo de preparo</label>
          </Form.Floating>
        </Col>
      </Row>
    </>
  );
}
