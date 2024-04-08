import api from "../../../services/useAxios";
import { CaloricExpenditureMet } from "../../../types/CaloricExpenditure";
import { CaloricExpenditureStore, MetActivityState } from "./types";

// eslint-disable-next-line no-unused-vars
const useMetActivityState = (set: (partial: (state: CaloricExpenditureStore) => Partial<CaloricExpenditureStore>) => void) => (<MetActivityState>{
  mets: [],

  updateMet: async (met) => {
    try {
      set((state) => ({
        mets: state.mets.map((m) => {
          if (m.id === met.id) {
            return { ...m, ...met };
          }
          return m;
        }),
      }))

      if(typeof met.id_met !== 'number') return console.error('id_met is required')
      if(!met.id_gasto_calorico) return console.error('id_gasto_calorico is required')

      const payload: CaloricExpenditureMet = {
        id_gasto_calorico: met.id_gasto_calorico,
        id_met: met.id_met,
        duracao: Number(met.duracao ?? 0),
      }

      if(typeof met.id === 'number') {
        const { data } = await api.patch('/gasto-calorico-met-paciente/' + met.id, payload);

        return data ?? false;
      } else {
        const { data } = await api.post('/gasto-calorico-met-paciente/', payload);

        set((state) => ({
          mets: state.mets.map((m) => {
            if (m.id === met.id) {
              return { ...m, id: data.id };
            }
            return m;
          }),
        }))

        return data ?? false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  addMet: async (met) => {
    set((state) => ({ mets: [...state.mets, met] }))
  },

  removeMet: async (met) => {
    try {
      set((state) => ({ mets: state.mets.filter((m) => m.id !== met.id) }));

      await api.delete('/gasto-calorico-met-paciente/' + met.id);

      return true;
    } catch (error) {
      set((state) => ({ mets: [...state.mets, met] }));
      return false;
    }
  }
})

export default useMetActivityState;