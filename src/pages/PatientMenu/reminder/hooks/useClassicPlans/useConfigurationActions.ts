import { createConfigurations } from "/src/types/PlanoAlimentarClassico";
import { createClassicPlanStore, ConfigurationActions } from "./types";

// eslint-disable-next-line no-unused-vars
const useConfigurationActions = (set: (partial: (state: createClassicPlanStore) => Partial<createClassicPlanStore>) => void) => (<ConfigurationActions>{
  setWeekDays: (weekDays) =>
    set(() => {
      return { weekDays: weekDays };
    }),

  setParsedWeekDays: (parsedWeekDays) =>
    set(() => {
      return { parsedWeekDays: parsedWeekDays };
    }),

  updatePlanConfigurations: (config) =>
    set((state) => {
      const updatedConfigurations: createConfigurations = {
        nome: state.createConfigurations.nome,
        periodizacaoFim: state.createConfigurations.periodizacaoFim,
        periodizacaoInicio: state.createConfigurations.periodizacaoInicio,
        ...config,
      };

      return {
        ...state,
        createConfigurations: updatedConfigurations,
      };
    }),
})

export default useConfigurationActions;