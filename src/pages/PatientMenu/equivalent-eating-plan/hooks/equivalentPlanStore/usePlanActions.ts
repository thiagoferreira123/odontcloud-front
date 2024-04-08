import { createEquivalentEatingPlanStore, PlanActions } from "./types";

// eslint-disable-next-line no-unused-vars
const usePlanActions = (set: (partial: (state: createEquivalentEatingPlanStore) => Partial<createEquivalentEatingPlanStore>) => void) => (<PlanActions>{
  setPlans: (plans) =>
    set(() => {
      return { plans };
    }),

  addPlan: (plan) =>
    set((state) => {
      return { plans: [...state.plans, plan] };
    }),

  updatePlan: (plan) =>
    set((state) => {
      return { plans: state.plans.map((item) => (item.id === plan.id ? { ...item, ...plan } : item)) };
    }),

  removePlan: (planId) => set((state) => ({ plans: state.plans.filter((plan) => plan.id !== planId) })),
})

export default usePlanActions;