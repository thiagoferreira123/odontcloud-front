import { BioimpedanceAntropometricData, AntropometricAssessmentHistory } from "/src/types/AntropometricAssessment";

export type ParametersStore = {
  apiAssessmentDataUrl: string;

  patientId: number;
  patientAge: number;
  patientIsMale: boolean;

  // eslint-disable-next-line no-unused-vars
  getAssessmentData: (id: number) => Promise<AntropometricAssessmentHistory<BioimpedanceAntropometricData>>;
  // eslint-disable-next-line no-unused-vars
  updateData: (apiAssessmentDataUrl: string, data?: Partial<BioimpedanceAntropometricData>) => Promise<void>;
} & WeigthAndHeigthState
  & CircunferencesState
  & BioimpedanceDataState;

export type WeigthAndHeigthState = {
  weight: number | string;
  height: number | string;

  // eslint-disable-next-line no-unused-vars
  setWeight: (value: number | string) => void;
  // eslint-disable-next-line no-unused-vars
  setHeight: (value: number | string) => void;
};

export type CircunferencesState = {
  neck: number | string,
  shoulder: number | string,
  chest: number | string,
  waist: number | string,
  hip: number | string,
  abdomen: number | string,

  right_relaxed_arm: number | string,
  left_relaxed_arm: number | string,

  right_contracted_arm: number | string,
  left_contracted_arm: number | string,

  right_proximal_thigh: number | string,
  right_medial_thigh: number | string,
  right_distal_thigh: number | string,

  left_proximal_thigh: number | string,
  left_medial_thigh: number | string,
  left_distal_thigh: number | string,

  right_calf: number | string,
  left_calf: number | string,

  left_fist: number | string,
  right_fist: number | string,
  forearm_left: number | string,
  forearm_right: number | string,
  ulnar_style_diameter: number | string,
  thorax: number | string,
  abdominal: number | string,
  suprailiaca: number | string,
  subscapularis: number | string,
  thigh: number | string,
  calf_media: number | string,
}

export type BioimpedanceDataState = {
  bmi: number | string,
  body_fat_percentage: number | string,
  fat_mass: number | string,
  lean_mass_percentage: number | string,
  lean_mass: number | string,
  bone_mass: number | string,
  residual_mass: number | string,
  muscle_mass: number | string,
  visceral_fat: number | string,
  metabolic_age: number | string,
  total_body_water: number | string,
  skeletal_muscle_mass_percentage: number | string,
  ideal_weight: number | string,
  total_body_water_percentage: number | string,
  visceral_fat_percentage: number | string,
}