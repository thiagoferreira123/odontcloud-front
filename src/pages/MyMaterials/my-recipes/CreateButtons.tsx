import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useModalAddRecipeStore } from '/src/pages/Recipe/Modals/ModalAddRecipe/hooks/ModalAddRecipeStore';
import { useRecipeFormikStore } from '/src/pages/Recipe/Modals/ModalAddRecipe/hooks/RecipeFormikStore';
import React from 'react';
import { Button, Col } from 'react-bootstrap';
import { Recipe } from '/src/types/ReceitaCulinaria';

export default function CreateButtons() {
  const { handleSelectRecipe } = useModalAddRecipeStore();
  const { setRecipe } = useRecipeFormikStore();

  const handleCreateFood = () => {
    const newRecipe: Recipe = {
      nome: '',
      tempo_preparo: '',
      peso_receita: 0,
      porcao_receita: '',
      quantidade_porcao: 0,
      data_cadastro: '',
      compartilhada: 'SIM',
      preparos: [],
      alimentos: [],
      categorias: []
    };

    setRecipe(newRecipe);

    handleSelectRecipe(newRecipe);
  };

  return (
    <Col className="d-flex justify-content-center gap-2 mt-4">
      <Button variant="primary" className="btn-icon btn-icon-start mb-2" onClick={() => handleCreateFood()}>
        <CsLineIcons icon="check" /> <span>Cadastrar uma receita culinária</span>
      </Button>
    </Col>
  );
}
