import { ParametersStore, CircunferencesState } from "./types";

export const useCircunferencesState = (set: (partial: (state: ParametersStore) => Partial<ParametersStore>) => void) => (<CircunferencesState>{
  neck: 0,
  shoulder: 0,
  chest: 0,
  waist: 0,
  hip: 0,
  abdomen: 0,

  right_relaxed_arm: 0,
  left_relaxed_arm: 0,

  right_contracted_arm: 0,
  left_contracted_arm: 0,

  right_proximal_thigh: 0,
  right_medial_thigh: 0,
  right_distal_thigh: 0,

  left_proximal_thigh: 0,
  left_medial_thigh: 0,
  left_distal_thigh: 0,

  right_calf: 0,
  left_calf: 0,

  left_fist: 0,
  right_fist: 0,
  forearm_left: 0,
  forearm_right: 0,
  ulnar_style_diameter: 0,
  thorax: 0,
  abdominal: 0,
  suprailiaca: 0,
  subscapularis: 0,
  thigh: 0,
  calf_media: 0,
})