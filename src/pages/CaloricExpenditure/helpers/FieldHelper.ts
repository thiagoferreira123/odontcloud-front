export function getEquationFilterFields(equationFilter: string) {
  let fields: string[] = [];

  switch (equationFilter) {
    case 'atletas':
      fields = [
        "cunningham",
        "katchMcArdle1996",
        "tenHaaf2014LeanMass",
        "tenHaaf2014Weight",
        "tinsley2019MuscularWeight",
        "tinsley2019Weight"
    ];
      break;
    case 'lactantes':
      fields = [
        "dri2023Lactante1Semestre14a19anos",
        "dri2023Lactante1Semestre19anos",
        "dri2023Lactante2Semestre14a19anos",
        "dri2023Lactante2Semestre19anos"
    ];
      break;
    case 'gestantes':
      fields = [
        "dRI2023Pregnant",
        "pregnancy14a19anos",
        "pregnancy19anos",
    ];
      break;
    case 'publico_em_geral':
      fields = [
        "dRI20230a2yearsTEE",
        "dRI20233a18years",
        "dRI202319years",
        "dRI20050a3years",
        "dRI20053a8years",
        "eerIom9a18years",
        "eer2005adult",
        "schofield",
        "henryERees",
        "cunningham",
        "katchMcArdle1996",
        "tenHaaf2014LeanMass",
        "tenHaaf2014Weight",
        "tinsley2019MuscularWeight",
        "tinsley2019Weight",
        "dRI2023Pregnant",
        "pregnancy14a19anos",
        "pregnancy19anos",
        "dri200519Obesity",
        "horieWaitzbergGonzalez",
        "mifflinStJeor1990",
        "harrisBenedic1919",
        "harrisBenedic1984"
    ];
      break;
    case 'Sobrepeso_e_obesidade':
      fields = [
        "horieWaitzbergGonzalez",
        "mifflinStJeor1990",
        "dri200519Obesity",
    ];
      break;
  }

  return fields;
}