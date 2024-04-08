import React, { useCallback, useEffect } from 'react';
import MacrosLabel from './MacrosLabel';
import StaticLoading from '/src/components/loading/StaticLoading';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';

import Food from './Food';
import { RecipeHistoryRecipeFood } from '/src/types/ReceitaCulinaria';
import useFoods from '/src/hooks/useFoods';
import { useQuery } from '@tanstack/react-query';
import Empty from '/src/components/Empty';
import TotalValuesMacros from './TotalValuesMacros';
import { useModalAddRecipeStore } from '../../hooks/ModalAddRecipeStore';

export default function Ingredients() {
  const foods = useModalAddRecipeStore((state) => state.foods);

  const { getFoods } = useFoods();
  const { addFood } = useModalAddRecipeStore();

  const handleAddFood = useCallback(() => {
    if (!foods) return console.error('foods is required');

    const payload: RecipeHistoryRecipeFood = {
      id: btoa(Math.random().toString()).substring(0, 12),
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

    addFood(payload);
  }, [addFood, foods]);

  const resultFood = useQuery({ queryKey: ['foods'], queryFn: getFoods });

  useEffect(() => {
    if(foods.length) return;

    handleAddFood()
  }, [foods.length, handleAddFood]);

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
        foods.map((food) => {
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
