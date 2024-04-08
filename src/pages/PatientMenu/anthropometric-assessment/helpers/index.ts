import { AntropometricAssessmentHistory } from "../../../../types/AntropometricAssessment";

export function getAntropometricPageLink(assessment: AntropometricAssessmentHistory<unknown>) {

  let link = '/app/avaliacao-antropometrica/';

  if(assessment.id_bioimpedancia) {
    link = '/app/avaliacao-antropometrica-bioimpedancia/';
  } else {
    switch (assessment.faixa_etaria) {
      case 1:
        link = '/app/avaliacao-antropometrica-infantil/';
        break;
      case 2:
        link = '/app/avaliacao-antropometrica-adolescentes/';
        break;
      case 3:
        link = '/app/avaliacao-antropometrica/';
        break;
      case 4:
        link = '/app/avaliacao-antropometrica/';
        break;
      case 5:
        link = '/app/avaliacao-antropometrica-gestante/';
        break;
      default:
        break;
    }
  }

  return link + assessment.dados_geral_id;
}

export function getComparativePageLink(assessment: AntropometricAssessmentHistory<unknown>) {
  if(assessment.id_bioimpedancia)
    return `/app/avaliacao-antropometrica-comparativo/bioimpedancia/${assessment.paciente_id}`;
  else if(assessment.faixa_etaria === 1)
    return `/app/avaliacao-antropometrica-comparativo/paciente-0-a-5-anos/${assessment.paciente_id}`;
  else if(assessment.faixa_etaria === 2)
    return `/app/avaliacao-antropometrica-comparativo/paciente-5-a-19-anos/${assessment.paciente_id}`;
  else if(assessment.faixa_etaria === 3)
    return `/app/avaliacao-antropometrica-comparativo/${assessment.paciente_id}`;
  else if(assessment.faixa_etaria === 5)
    return `/app/avaliacao-antropometrica-comparativo/paciente-gestante/${assessment.paciente_id}`;
  else
    return `/app/avaliacao-antropometrica-comparativo/${assessment.paciente_id}`;
}