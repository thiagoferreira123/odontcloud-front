import { AdultAntropometricData, AntropometricAssessmentHistory, Child0to5AntropometricData } from "../../../../../types/AntropometricAssessment";

export type ParametersStore = {
  apiAssessmentDataUrl: string;

  patientId: number;
  patientAge: number;
  patientIsMale: boolean;

  // eslint-disable-next-line no-unused-vars
  getAssessmentData: (id: number) => Promise<AntropometricAssessmentHistory<Child0to5AntropometricData> | false>;
  // eslint-disable-next-line no-unused-vars
  updateData: (apiAssessmentDataUrl: string, data?: Partial<AdultAntropometricData>) => Promise<void>;
} & WeigthAndHeigthState & CircunferencesState;

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