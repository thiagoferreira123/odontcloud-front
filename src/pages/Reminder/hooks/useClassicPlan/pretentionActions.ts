import { ClassicPlanStore, PretentionActions } from "./types";

// eslint-disable-next-line no-unused-vars
const usePretentionActions = (set: (partial: (state: ClassicPlanStore) => Partial<ClassicPlanStore>) => void) => (<PretentionActions>{
  handleChangeProteins: (vrProteins: number) => set((state) => {
    const vrCarbohydrates = 100 - vrProteins - Number(state.vrLipideos);

    if (vrProteins >= 0 && vrProteins <= 100) {
      return { vrProteinas: String(vrProteins), vrCarboidratos: String(vrCarbohydrates) };
    } else return {}
  }),

  handleChangeCarbohydrates: (vrCarbohydrates: number) => set((state) => {
    const vrProteinas = 100 - vrCarbohydrates - Number(state.vrLipideos);

    if (vrCarbohydrates >= 0 && vrCarbohydrates <= 100) {
      return { vrCarboidratos: String(vrCarbohydrates), vrProteinas: String(vrProteinas) };
    } else return {}
  }),

  handleChangeLipids: (vrLipids: number) => set((state) => {
    const vrCarbohydrates = 100 - Number(state.vrProteinas) - vrLipids;

    if (vrLipids >= 0 && vrLipids <= 100) {
      return { vrLipideos: String(vrLipids), vrCarboidratos: String(vrCarbohydrates) }
    } else return {}
  }),
})

export default usePretentionActions;