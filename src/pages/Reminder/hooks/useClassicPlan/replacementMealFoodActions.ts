import { ClassicPlanStore, ReplacementMealFoodActions } from "./types";

// eslint-disable-next-line no-unused-vars
const useReplacementMealFoodActions = (set: (partial: (state: ClassicPlanStore) => Partial<ClassicPlanStore>, replace?: boolean, name?: string) => void) => (<ReplacementMealFoodActions>{
  addReplacementMealFood: (food, mealID) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === mealID) {
          const substituicoes = meal.substituicoes.map((s) => {
            if (s.id === food.id_refeicao) {
              return { ...s, alimentos: [...s.alimentos, food] };
            }
            return s;
          });

          return { ...meal, substituicoes };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  updateReplacementMealFood: (food, mealID) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === mealID) {
          const substituicoes = meal.substituicoes.map((s) => {
            if (s.id === food.id_refeicao) {
              const alimentos = s.alimentos.map((a) => {
                if (a.id === food.id) {
                  return { ...a, ...food };
                }
                return a;
              });

              return { ...s, alimentos };
            }
            return s;
          });

          return { ...meal, substituicoes };
        }
        return meal;
      });

      return { meals: meals };
    });

    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === mealID) {
          const substituicoes = meal.substituicoes.map((s) => {
            if (s.id === food.id_refeicao) {
              const carbohydrate = s.alimentos.reduce((acumulador, alimento) => acumulador + Number(Number(alimento.carbohydrate) ?? 0), 0).toFixed(1);
              const protein = s.alimentos.reduce((acumulador, alimento) => acumulador + Number(Number(alimento.protein) ?? 0), 0).toFixed(1);
              const lipid = s.alimentos.reduce((acumulador, alimento) => acumulador + Number(Number(alimento.lipid) ?? 0), 0).toFixed(1);
              const calories = s.alimentos.reduce((acumulador, alimento) => acumulador + Number(Number(alimento.calories) ?? 0), 0).toFixed(1);

              return { ...s, carboidratos: carbohydrate, proteinas: protein, lipideos: lipid, kcal: calories };
            }
            return s;
          });

          return { ...meal, substituicoes };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  changeReplacementMealFoodId: (food, foodId, mealID) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === mealID) {
          const substituicoes = meal.substituicoes.map((s) => {
            if (s.id === food.id_refeicao) {
              const alimentos = s.alimentos.map((a) => {
                if (a.id === foodId) {
                  return { ...a, ...food };
                }
                return a;
              });

              return { ...s, alimentos };
            }
            return s;
          });

          return { ...meal, substituicoes };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  removeReplacementMealFood: (food, mealID) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === mealID) {
          const substituicoes = meal.substituicoes.map((s) => {
            if (s.id == food.id_refeicao) {
              return { ...s, alimentos: s.alimentos.filter((a) => a.id != food.id) };
            }
            return s;
          });

          return { ...meal, substituicoes };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  updateReplacementMealFoodEquivalents: (food, mealID, equivalents) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === mealID) {
          const substituicoes = meal.substituicoes.map((s) => {
            if (s.id === food.id_refeicao) {
              const alimentos = s.alimentos.map((a) => {
                if (a.id === food.id) {
                  return { ...a, alimentoequivalentes: equivalents };
                }
                return a;
              });
              return { ...s, alimentos };
            }
            return s;
          });

          return { ...meal, substituicoes };
        }
        return meal;
      });

      return { meals: meals };
    });
  },

  removeReplacementMealFoodEquivalents: (replacementId, mealId, equivalent) => {
    set((state) => {
      const meals = state.meals.map((meal) => {
        if (meal.id === mealId) {
          const substituicoes = meal.substituicoes.map((s) => {
            if (s.id === replacementId) {
              const alimentos = s.alimentos.map((a) => {
                if (a.id == equivalent.idRefeicaoAlimento) {
                  const alimentoequivalentes = a.alimentoequivalentes?.filter((e) => e.id !== equivalent.id);
                  return { ...a, alimentoequivalentes };
                }
                return a;
              });
              return { ...s, alimentos };
            }
            return s;
          });

          return { ...meal, substituicoes };
        }
        return meal;
      });

      return { meals: meals };
    });
  },
})

export default useReplacementMealFoodActions;