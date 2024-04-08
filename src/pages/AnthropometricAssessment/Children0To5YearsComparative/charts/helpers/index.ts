import { AntropometricAssessmentHistory, Child0to5AntropometricData } from "/src/types/AntropometricAssessment";


export const getAssessmentHeight = (assessments: (AntropometricAssessmentHistory<Child0to5AntropometricData> | null)[], month: string) => {
  const assessment = assessments.find((assessment) => assessment?.data?.idade === month);

  return assessment?.data?.altura ? Number(assessment.data?.altura) : null;
};