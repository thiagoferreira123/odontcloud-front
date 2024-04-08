import { SingleValue } from "react-select";
import { Child5to19AntropometricData, AntropometricAssessmentHistory } from "../../../../../../types/AntropometricAssessment";
import { Option } from "../../../../../../types/inputs";

export type ParametersStore = {
  apiAssessmentDataUrl: string;

  patientId: number;
  patientAge: number;
  patientIsMale: boolean;

  getAssessmentData: (id: number) => Promise<AntropometricAssessmentHistory<Child5to19AntropometricData>>;
  updateData: (apiAssessmentDataUrl: string, data?:Partial<Child5to19AntropometricData>) => Promise<void>;
} &
  SkinFoldsState &
  WeigthAndHeigthState &
  CircunferencesState &
  BoneDiametersState;

export type SkinFoldsState = {
  selectedBodyDensityEquation: SingleValue<Option>;
  selectedBodyFatEquation: SingleValue<Option>;

  bicipital: number | string;
  tricipital: number | string;
  axilarMedia: number | string;
  suprailiaca: number | string;
  abdominal: number | string;
  subescapular: number | string;
  toracica: number | string;
  coxa: number | string;
  panturrilha: number | string;

  setBodyDensityEquation: (option: SingleValue<Option>) => void;
  setBodyFatEquation: (option: SingleValue<Option>) => void;
};

export type WeigthAndHeigthState = {
  weight: number | string;
  height: number | string;

  setWeight: (value: number | string) => void;
  setHeight: (value: number | string) => void;
};

export type BoneDiametersState = {
  fist: number | string;
  femur: number | string;

  setFist: (value: number | string) => void;
  setFemur: (value: number | string) => void;
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