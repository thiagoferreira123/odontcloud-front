import { BodyDensityEquationSelectOptions, BodyFatEquationSelectOptions } from "../../constants";
import { ParametersStore, SkinFoldsState } from "./types";

const selectedBodyDensityEquation = BodyDensityEquationSelectOptions[0] ?? { value: "", label: "" };
const selectedBodyFatEquation = BodyFatEquationSelectOptions[0] ?? { value: "", label: "" };

// eslint-disable-next-line no-unused-vars
export const useSkinFoldsState = (set: (partial: (state: ParametersStore) => Partial<ParametersStore>) => void) => (<SkinFoldsState>{
  selectedBodyDensityEquation: selectedBodyDensityEquation,
  selectedBodyFatEquation: selectedBodyFatEquation,

  bicipital: 0,
  tricipital: 0,
  axilarMedia: 0,
  suprailiaca: 0,
  abdominal: 0,
  subescapular: 0,
  toracica: 0,
  coxa: 0,
  panturrilha: 0,

  setBodyDensityEquation: (option) => set(() => { return { selectedBodyDensityEquation: option } }),
  setBodyFatEquation: (option) => set(() => { return { selectedBodyFatEquation: option } }),
})