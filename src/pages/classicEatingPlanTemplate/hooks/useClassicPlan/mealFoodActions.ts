import { useIndexedDB } from "/src/services/useIndexedDB";
import { ClassicPlanStore, MealFoodActions } from "./types";
import { ClassicPlanMealFood } from "/src/types/PlanoAlimentarClassico";

const useMealFoodActions = (
  // eslint-disable-next-line no-unused-vars
  set: (partial: (state: ClassicPlanStore) => Partial<ClassicPlanStore>, replace?: boolean, name?: string) => void
) => {
  const { getData } = useIndexedDB();

  return (
    <MealFoodActions>{
      addMealFood: (food) => {
        set((state) => {
          const meals = state.meals.map((meal) => {
            if (meal.id === food.id_refeicao) {
              meal.alimentos.push(food);

              return { ...meal };
            }
            return meal;
          });

          return { meals: meals };
        });
      },

      updateMealFood: (food) => {
        set((state) => {
          const meals = state.meals.map((meal) => {
            if (meal.id === food.id_refeicao) {
              meal.alimentos = meal.alimentos.map((actualFood) => {
                if (actualFood.id === food.id) {
                  return { ...actualFood, ...food };
                }
                return actualFood;
              });

              return { ...meal };
            }
            return meal;
          });

          return { meals: meals };
        });

        set((state) => {
          const totalCalories = state.meals.reduce((total, meal) => {
            const mealCalories = meal.alimentos.reduce((total, food) => {
              return total + Number(food.calories ?? 0);
            }, 0);

            return total + mealCalories;
          }, 0);

          return { totalCalories };
        });

        set((state) => {
          const meals = state.meals.map((m) => {
            if (m.id === food.id_refeicao) {
              const carbohydrate = m.alimentos.reduce((acumulador, alimento) => acumulador + Number(alimento.carbohydrate ? Number(alimento.carbohydrate) : 0), 0).toFixed(1);
              const protein = m.alimentos.reduce((acumulador, alimento) => acumulador + Number(alimento.protein ? Number(alimento.protein) : 0), 0).toFixed(1);
              const lipid = m.alimentos.reduce((acumulador, alimento) => acumulador + Number(alimento.lipid ? Number(alimento.lipid) : 0), 0).toFixed(1);
              const calories = m.alimentos.reduce((acumulador, alimento) => acumulador + Number(alimento.calories ? Number(alimento.calories) : 0), 0).toFixed(1);

              return { ...m, carboidratos: carbohydrate, proteinas: protein, lipideos: lipid, kcal: calories };
            }
            return m;
          });

          return { meals: meals };
        });
      },

      changeMealFoodId: (foodId, food) => {
        set((state) => {
          const meals = state.meals.map((meal) => {
            if (meal.id === food.id_refeicao) {
              meal.alimentos = meal.alimentos.map((actualFood) => {
                if (actualFood.id === foodId) {
                  return { ...actualFood, ...food };
                }
                return actualFood;
              });

              return { ...meal };
            }
            return meal;
          });

          return { meals: meals };
        });
      },

      removeMealFood: (food) => {
        set((state) => {
          const meals = state.meals.map((meal) => {
            if (meal.id === food.id_refeicao) {
              meal.alimentos = meal.alimentos.filter((actualFood) => actualFood.id !== food.id);

              return { ...meal };
            }
            return meal;
          });

          return { meals: meals };
        });
      },

      updateMealFoodEquivalents: (food, equivalents) => {
        set((state) => {
          const meals = state.meals.map((meal) => {
            if (meal.id === food.id_refeicao) {
              meal.alimentos = meal.alimentos.map((actualFood) => {
                if (actualFood.id === food.id) {
                  return { ...actualFood, alimentoequivalentes: equivalents };
                }
                return actualFood;
              });

              return { ...meal };
            }
            return meal;
          });

          return { meals: meals };
        });
      },

      removeMealFoodEquivalents: (mealId, equivalent) => {
        set((state) => {
          const meals = state.meals.map((meal) => {
            if (meal.id === mealId) {
              meal.alimentos = meal.alimentos.map((actualFood) => {
                if (actualFood.id == equivalent.idRefeicaoAlimento) {
                  return { ...actualFood, alimentoequivalentes: actualFood.alimentoequivalentes?.filter((e) => e.id !== equivalent.id) };
                }
                return actualFood;
              });

              return { ...meal };
            }
            return meal;
          });

          return { meals: meals };
        });
      },

      getFoodsData: async (meals) => {
        const foodsData = await getData('Alimentos');

        const foods = meals.reduce((accumulator: ClassicPlanMealFood[], meal) => {
          return [...accumulator, ...meal.alimentos];
        }, []);

        return foods.map(food => { return { ...foodsData.find(foodData => foodData.id == food.id_alimento && foodData.tabela == food.tabela), gramas: food.gramas } });
      }
    }
  )
}

export default useMealFoodActions;