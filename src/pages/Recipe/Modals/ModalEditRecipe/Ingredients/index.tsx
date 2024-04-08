import React from 'react';
import MacrosLabel from './MacrosLabel';
import StaticLoading from '/src/components/loading/StaticLoading';

import useFoods from '/src/hooks/useFoods';
import { useQuery } from '@tanstack/react-query';
import Empty from '/src/components/Empty';
import { useEditReciptStore } from '/src/pages/Recipe/hooks/EditRecipeStore';
import Food from './Food';
import TotalValuesMacros from './TotalValuesMacros';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { RecipeHistoryRecipeFood } from '/src/types/ReceitaCulinaria';

export default function Ingredients() {
  const selectedRecipe = useEditReciptStore((state) => state.selectedRecipe);

  const { getFoods } = useFoods();
  const { addSelectedRecipeFood } = useEditReciptStore();

  const handleAddFood = () => {
    if (!selectedRecipe) return console.error('selectedRecipe is required');

    const payload: RecipeHistoryRecipeFood = {
      id: btoa(Math.random().toString()).substring(0, 12),
      id_receita: typeof selectedRecipe.id === 'number' ? selectedRecipe.id : undefined,
      nome: '',
      quantidade: 1,
      medida_caseira: '',
      gramas: 0,
      kcal: 0,
      proteinas: 0,
      carboidratos: 0,
      lipideos: 0,
      tabela: '',
      nome_apelido: '',
      medida_caseira_apelido: '',
    };

    addSelectedRecipeFood(payload);
  };

  const resultFood = useQuery({ queryKey: ['foods'], queryFn: getFoods });

  return (
    <>
      <MacrosLabel />

      {resultFood.isLoading ? (
        <div className="h-50 d-flex justify-content-center align-items-center">
          <StaticLoading />
        </div>
      ) : resultFood.isError ? (
        <div className="h-50 d-flex justify-content-center align-items-center">Ocorreu um erro ao tentar buscar a prescrição de receitas</div>
      ) : !resultFood.data?.length ? (
        <div className="h-50 d-flex justify-content-center align-items-center">
          <Empty />
        </div>
      ) : (
        selectedRecipe?.alimentos.map((food) => {
          return <Food key={food.id} food={food} />;
        })
      )}

      <TotalValuesMacros />

      <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add-separate-food">Adicionar alimento.</Tooltip>}>
        <Button className="btn-icon btn-icon-only my-2 me-2" variant="outline-primary" type="button" size="sm" onClick={handleAddFood}>
          <CsLineIcons icon="plus" />
        </Button>
      </OverlayTrigger>
    </>
  );
}
