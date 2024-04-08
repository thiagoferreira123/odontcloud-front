import { isValidNumber } from "../../../helpers/MathHelpers";
import { CaloricExpenditureStore } from "../hooks/types";
import { Cunningham1980, DRI2023Pregnant, HenryERees1991, HorieWaitzberg, KatchMcArdle1996, MiffliStJeor, Schofield1985, TenHaaf2014LeanMass, TenHaaf2014Weight, Tinsley2019MuscularWeight, Tinsley2019Weight, calculateAdultEER, calculateAdultEERPa, calculateLactatingGirlsEER, calculatePaAdult, calculatePregnancyEER, calculatePregnancyEERAdult, dRI20050a3years, dRI20053a8years, dRI20053a8yearsPa, dRI20230a2yearsTEE, dRI202319years, dRI20233a18years, dRI2023LactatioBigger19years7to12MonthsPostpartum, dRI2023LactatioSmaller19years7to12MonthsPostpartum, dRI2023Lactation19to0a6MonthsPostpartum, dri200519yearsObesity, dri200519yearsObesityPa, eerIom9a18years, eerIom9a18yearsPa, herrisBenedict1919, herrisBenedict1984RevisedRozaAndShizgal } from "./MathHelpers";

export const getGebValues = (state: CaloricExpenditureStore) => {

  const basalEnergyExpenditure =
    isValidNumber(state.height) && isValidNumber(state.weight) && Number(state.height) && Number(state.weight)
      ? dRI20230a2yearsTEE({ sex: state.patientIsMale ? 1 : 0, ageYears: state.patientAge, height: Number(state.height), weight: Number(state.weight) })
      : 0;

  const basalEnergyExpenditure3a18 =
    isValidNumber(state.height) && isValidNumber(state.weight) && Number(state.height) && Number(state.weight)
      ? dRI20233a18years({ sex: state.patientIsMale ? 1 : 0, age: state.patientAge, height: Number(state.height), weight: Number(state.weight), activityLevel: state.selectedActivityFactor })
      : 0;

  const basalEnergyExpenditure19Years =
    isValidNumber(state.height) && isValidNumber(state.weight) && Number(state.height) && Number(state.weight)
      ? dRI202319years({ sex: state.patientIsMale ? 1 : 0, age: state.patientAge, height: Number(state.height), weight: Number(state.weight), activityLevel: state.selectedActivityFactor })
      : 0;

  const dri20050a3Years = isValidNumber(state.weight) && Number(state.weight) && state.patientAge <= 2 ? dRI20050a3years({ ageYears: state.patientAge, weight: Number(state.weight) }) : 0;

  const dri20053a8Years =
    isValidNumber(state.height) && isValidNumber(state.height) && Number(state.height) && Number(state.height)
      ? dRI20053a8years({
        sex: state.patientIsMale ? 1 : 0,
        age: state.patientAge,
        weight: Number(state.weight),
        height: Number(state.height) / 100,
      })
      : 0;
  const dri20053a8YearsPa =
    isValidNumber(state.height) && isValidNumber(state.height) && Number(state.height) && Number(state.height)
      ? dRI20053a8yearsPa({
        sex: state.patientIsMale ? 1 : 0,
        age: state.patientAge,
        weight: Number(state.weight),
        height: Number(state.height) / 100,
        pal: state.selectedPhysicalActivityFactor,
      })
      : 0;
  const dri20059a18Years =
    isValidNumber(state.height) && isValidNumber(state.height) && Number(state.height) && Number(state.height)
      ? eerIom9a18years({
        gender: state.patientIsMale ? 1 : 0,
        age: state.patientAge,
        weight: Number(state.weight),
        height: Number(state.height) / 100,
        pal: state.selectedPhysicalActivityFactor,
      })
      : 0;
  const dri20059a18YearsPa =
    isValidNumber(state.height) && isValidNumber(state.height) && Number(state.height) && Number(state.height)
      ? eerIom9a18yearsPa({
        gender: state.patientIsMale ? 1 : 0,
        age: state.patientAge,
        weight: Number(state.weight),
        height: Number(state.height) / 100,
        pal: state.selectedPhysicalActivityFactor,
      })
      : 0;
  const driAdult =
    isValidNumber(state.height) && isValidNumber(state.height) && Number(state.height) && Number(state.height)
      ? calculateAdultEER({
        gender: state.patientIsMale ? 1 : 0,
        age: state.patientAge,
        weight: Number(state.weight),
        height: Number(state.height) / 100,
      })
      : 0;
  const driAdultPa =
    isValidNumber(state.height) && isValidNumber(state.height) && Number(state.height) && Number(state.height)
      ? calculateAdultEERPa({
        gender: state.patientIsMale ? 1 : 0,
        age: state.patientAge,
        weight: Number(state.weight),
        height: Number(state.height) / 100,
        pal: state.selectedPhysicalActivityFactor,
      })
      : 0;
  const schofield1985 =
    isValidNumber(state.weight) && Number(state.weight) ? Schofield1985(state.patientAge, Number(state.weight), state.patientIsMale ? 1 : 0) : 0;

  const henryERees = isValidNumber(state.weight) && Number(state.weight) ? HenryERees1991({ weight: Number(state.weight), gender: state.patientIsMale ? 1 : 0 }) : 0;
  const cunningham =
    isValidNumber(state.muscularWeight) && Number(state.muscularWeight) ? Cunningham1980(Number(state.muscularWeight)) : 0;
  const katchMcArdle1996 =
    isValidNumber(state.muscularWeight) && Number(state.muscularWeight)
      ? KatchMcArdle1996(Number(state.muscularWeight))
      : 0;
  const tenHaaf2014LeanMass =
    isValidNumber(state.muscularWeight) && Number(state.muscularWeight)
      ? TenHaaf2014LeanMass(Number(state.muscularWeight))
      : 0;
  const tenHaaf2014Weight =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height)
      ? TenHaaf2014Weight(Number(state.weight), Number(state.height) / 100, state.patientAge, state.patientIsMale ? 1 : 0)
      : 0;
  const tinsley2019MuscularWeight =
    isValidNumber(state.muscularWeight) && Number(state.muscularWeight)
      ? Tinsley2019MuscularWeight(Number(state.muscularWeight))
      : 0;
  const tinsley2019Weight =
    isValidNumber(state.weight) && Number(state.weight) ? Tinsley2019Weight(Number(state.weight)) : 0;
  const dRI2023Pregnant =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height) && isValidNumber(state.gestationWeek) && Number(state.gestationWeek)
      ? DRI2023Pregnant({
        age: state.patientAge,
        height: Number(state.height),
        weight: Number(state.weight),
        gestation: Number(state.gestationWeek),
        activityLevel: state.selectedActivityFactor,
      })
      : 0;
  const pregnancy14a19anos =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height) && isValidNumber(state.gestationTrimester) && Number(state.gestationTrimester)
      ? calculatePregnancyEER({
        age: state.patientAge,
        height: Number(state.height) / 100,
        weight: Number(state.weight),
        trimester: state.gestationTrimester,
        pal: 1,
      })
      : 0;
  const pregnancy14a19anosPa =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height) && isValidNumber(state.gestationTrimester) && Number(state.gestationTrimester)
      ? calculatePregnancyEER({
        age: state.patientAge,
        height: Number(state.height) / 100,
        weight: Number(state.weight),
        trimester: state.gestationTrimester,
        pal: state.selectedPhysicalActivityFactor,
      })
      : 0;
  const pregnancy19anos =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height) && isValidNumber(state.gestationTrimester) && Number(state.gestationTrimester)
      ? calculatePregnancyEERAdult({
        age: state.patientAge,
        height: Number(state.height) / 100,
        weight: Number(state.weight),
        trimester: state.gestationTrimester,
        pal: 1,
      })
      : 0;
  const pregnancy19anosPa =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height) && isValidNumber(state.gestationTrimester) && Number(state.gestationTrimester)
      ? calculatePregnancyEERAdult({
        age: state.patientAge,
        height: Number(state.height) / 100,
        weight: Number(state.weight),
        trimester: state.gestationTrimester,
        pal: state.selectedPhysicalActivityFactor,
      })
      : 0;
  const dri200519Obesity =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height)
      ? dri200519yearsObesity({
        age: state.patientAge,
        height: Number(state.height) / 100,
        weight: Number(state.weight),
        gender: state.patientIsMale ? 1 : 0,
      })
      : 0;
  const dri200519ObesityPa =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height)
      ? dri200519yearsObesityPa({
        age: state.patientAge,
        height: Number(state.height) / 100,
        weight: Number(state.weight),
        gender: state.patientIsMale ? 1 : 0,
        pal: state.selectedPhysicalActivityFactor,
      })
      : 0;
  const horieWaitzbergGonzalez =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.muscularWeight) && Number(state.muscularWeight)
      ? HorieWaitzberg(Number(state.weight), Number(state.muscularWeight))
      : 0;
  const mifflinStJeor1990 =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height)
      ? MiffliStJeor(Number(state.weight), Number(state.height), state.patientAge, state.patientIsMale ? 1 : 0)
      : 0;
  const harrisBenedic1919 =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height)
      ? herrisBenedict1919({ weight: Number(state.weight), height: Number(state.height), age: state.patientAge, gender: state.patientIsMale ? 1 : 0 })
      : 0;
  const harrisBenedic1984 =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height)
      ? herrisBenedict1984RevisedRozaAndShizgal({ weight: Number(state.weight), height: Number(state.height), age: state.patientAge, gender: state.patientIsMale ? 1 : 0 })
      : 0;
  const dri2023Lactante1Semestre14a19anos =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height) && isValidNumber(state.lactationMonth) && Number(state.lactationMonth)
      ? calculateLactatingGirlsEER({ age: state.patientAge, weight: Number(state.weight), height: Number(state.height), activityLevel: state.selectedActivityFactor, lactationMonth: Number(state.lactationMonth) })
      : 0;
  const dri2023Lactante2Semestre14a19anos =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height) && isValidNumber(state.lactationMonth) && Number(state.lactationMonth)
      ? dRI2023LactatioSmaller19years7to12MonthsPostpartum({ age: state.patientAge, weight: Number(state.weight), height: Number(state.height), activityLevel: state.selectedActivityFactor, lactationMonth: Number(state.lactationMonth) })
      : 0;
  const dri2023Lactante1Semestre19anos =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height) && isValidNumber(state.lactationMonth) && Number(state.lactationMonth)
      ? dRI2023Lactation19to0a6MonthsPostpartum({ age: state.patientAge, weight: Number(state.weight), height: Number(state.height), activityLevel: state.selectedActivityFactor, lactationMonth: Number(state.lactationMonth) })
      : 0;
  const dri2023Lactante2Semestre19anos =
    isValidNumber(state.weight) && Number(state.weight) && isValidNumber(state.height) && Number(state.height) && isValidNumber(state.lactationMonth) && Number(state.lactationMonth)
      ? dRI2023LactatioBigger19years7to12MonthsPostpartum({ age: state.patientAge, weight: Number(state.weight), height: Number(state.height), activityLevel: state.selectedActivityFactor, lactationMonth: Number(state.lactationMonth) })
      : 0;

  // const pa = calculatePa(state.patientIsMale ? 1 : 0, state.selectedPhysicalActivityFactor);
  const paAdult = calculatePaAdult(state.patientIsMale ? 1 : 0, state.selectedPhysicalActivityFactor);

  const totalMetskcal = state.mets.reduce((acc, met) => acc + (met?.kcal ?? 0), 0);

  return {
    basalEnergyExpenditure,
    basalEnergyExpenditure3a18,
    basalEnergyExpenditure19Years,
    dri20050a3Years,
    dri20053a8Years,
    dri20053a8YearsPa,
    dri20059a18Years,
    dri20059a18YearsPa,
    driAdult,
    driAdultPa,
    schofield1985,
    henryERees,
    cunningham,
    katchMcArdle1996,
    tenHaaf2014LeanMass,
    tenHaaf2014Weight,
    tinsley2019MuscularWeight,
    tinsley2019Weight,
    dRI2023Pregnant,
    pregnancy14a19anos,
    pregnancy14a19anosPa,
    pregnancy19anos,
    pregnancy19anosPa,
    dri200519Obesity,
    dri200519ObesityPa,
    horieWaitzbergGonzalez,
    mifflinStJeor1990,
    harrisBenedic1919,
    harrisBenedic1984,
    dri2023Lactante1Semestre14a19anos,
    dri2023Lactante2Semestre14a19anos,
    dri2023Lactante1Semestre19anos,
    dri2023Lactante2Semestre19anos,
    totalMetskcal,
    paAdult,
  }
}

export const getTotalGetValue = (state: CaloricExpenditureStore) => {

  const {
    basalEnergyExpenditure,
    basalEnergyExpenditure3a18,
    basalEnergyExpenditure19Years,
    dri20050a3Years,
    dri20053a8YearsPa,
    dri20059a18YearsPa,
    driAdultPa,
    schofield1985,
    henryERees,
    cunningham,
    katchMcArdle1996,
    tenHaaf2014LeanMass,
    tenHaaf2014Weight,
    tinsley2019MuscularWeight,
    tinsley2019Weight,
    dRI2023Pregnant,
    pregnancy14a19anosPa,
    pregnancy19anosPa,
    dri200519ObesityPa,
    horieWaitzbergGonzalez,
    mifflinStJeor1990,
    harrisBenedic1919,
    harrisBenedic1984,
    dri2023Lactante1Semestre14a19anos,
    dri2023Lactante2Semestre14a19anos,
    dri2023Lactante1Semestre19anos,
    dri2023Lactante2Semestre19anos,
    totalMetskcal,
    paAdult,
  } = getGebValues(state);

  return state.selectedEquation === 'dRI20230a2yearsTEE'
    ? (basalEnergyExpenditure + totalMetskcal)
    : state.selectedEquation === 'dRI20233a18years'
      ? (basalEnergyExpenditure3a18 + totalMetskcal)
      : state.selectedEquation === 'dRI202319years'
        ? (basalEnergyExpenditure19Years + totalMetskcal)
        : state.selectedEquation === 'dRI20050a3years'
          ? (dri20050a3Years + totalMetskcal)
          : state.selectedEquation === 'dRI20053a8years'
            ? (dri20053a8YearsPa + totalMetskcal)
            : state.selectedEquation === 'eerIom9a18years'
              ? (dri20059a18YearsPa + totalMetskcal)
              : state.selectedEquation === 'eer2005adult'
                ? (driAdultPa + totalMetskcal)
                : state.selectedEquation === 'schofield'
                  ? (Math.round(schofield1985 * paAdult) + totalMetskcal)
                  : state.selectedEquation === 'henryERees'
                    ? (henryERees + totalMetskcal)
                    : state.selectedEquation === 'cunningham'
                      ? (Math.round(cunningham * paAdult) + totalMetskcal)
                      : state.selectedEquation === 'katchMcArdle1996'
                        ? (Math.round(katchMcArdle1996 * paAdult) + totalMetskcal)
                        : state.selectedEquation === 'tenHaaf2014LeanMass'
                          ? (Math.round(tenHaaf2014LeanMass * paAdult) + totalMetskcal)
                          : state.selectedEquation === 'tenHaaf2014Weight'
                            ? (Math.round(tenHaaf2014Weight * paAdult) + totalMetskcal)
                            : state.selectedEquation === 'tinsley2019MuscularWeight'
                              ? (Math.round(tinsley2019MuscularWeight * paAdult) + totalMetskcal)
                              : state.selectedEquation === 'tinsley2019Weight'
                                ? (Math.round(tinsley2019Weight * paAdult) + totalMetskcal)
                                : state.selectedEquation === 'dRI2023Pregnant'
                                  ? (dRI2023Pregnant + totalMetskcal)
                                  : state.selectedEquation === 'pregnancy14a19anos'
                                    ? (pregnancy14a19anosPa + totalMetskcal)
                                    : state.selectedEquation === 'pregnancy19anos'
                                      ? (pregnancy19anosPa + totalMetskcal)
                                      : state.selectedEquation === 'dri200519Obesity'
                                        ? (dri200519ObesityPa + totalMetskcal)
                                        : state.selectedEquation === 'horieWaitzbergGonzalez'
                                          ? (Math.round(horieWaitzbergGonzalez * paAdult) + totalMetskcal)
                                          : state.selectedEquation === 'mifflinStJeor1990'
                                            ? (Math.round(mifflinStJeor1990 * paAdult) + totalMetskcal)
                                            : state.selectedEquation === 'harrisBenedic1919'
                                              ? (Math.round(harrisBenedic1919 * paAdult) + totalMetskcal)
                                              : state.selectedEquation === 'harrisBenedic1984'
                                                ? (Math.round(harrisBenedic1984 * paAdult) + totalMetskcal)
                                                : state.selectedEquation === 'dri2023Lactante1Semestre14a19anos'
                                                  ? (dri2023Lactante1Semestre14a19anos + totalMetskcal)
                                                  : state.selectedEquation === 'dri2023Lactante1Semestre19anos'
                                                    ? (dri2023Lactante1Semestre19anos + totalMetskcal)
                                                    : state.selectedEquation === 'dri2023Lactante2Semestre14a19anos'
                                                      ? (dri2023Lactante2Semestre14a19anos + totalMetskcal)
                                                      : state.selectedEquation === 'dri2023Lactante2Semestre19anos'
                                                        ? (dri2023Lactante2Semestre19anos + totalMetskcal)
                                                        : 0
}

export const getTotalGebValue = (state: CaloricExpenditureStore) => {
  const {
    basalEnergyExpenditure,
    basalEnergyExpenditure3a18,
    basalEnergyExpenditure19Years,
    dri20050a3Years,
    dri20053a8Years,
    dri20059a18Years,
    driAdult,
    schofield1985,
    henryERees,
    cunningham,
    katchMcArdle1996,
    tenHaaf2014LeanMass,
    tenHaaf2014Weight,
    tinsley2019MuscularWeight,
    tinsley2019Weight,
    dRI2023Pregnant,
    pregnancy14a19anos,
    pregnancy19anos,
    dri200519Obesity,
    horieWaitzbergGonzalez,
    mifflinStJeor1990,
    harrisBenedic1919,
    harrisBenedic1984,
    dri2023Lactante1Semestre14a19anos,
    dri2023Lactante2Semestre14a19anos,
    dri2023Lactante1Semestre19anos,
    dri2023Lactante2Semestre19anos,
  } = getGebValues(state);

  return state.selectedEquation === 'dRI20230a2yearsTEE'
  ? basalEnergyExpenditure
  : state.selectedEquation === 'dRI20233a18years'
  ? basalEnergyExpenditure3a18
  : state.selectedEquation === 'dRI202319years'
  ? basalEnergyExpenditure19Years
  : state.selectedEquation === 'dRI20050a3years'
  ? dri20050a3Years
  : state.selectedEquation === 'dRI20053a8years'
  ? dri20053a8Years
  : state.selectedEquation === 'eerIom9a18years'
  ? dri20059a18Years
  : state.selectedEquation === 'eer2005adult'
  ? driAdult
  : state.selectedEquation === 'schofield'
  ? schofield1985
  : state.selectedEquation === 'henryERees'
  ? henryERees
  : state.selectedEquation === 'cunningham'
  ? cunningham
  : state.selectedEquation === 'katchMcArdle1996'
  ? katchMcArdle1996
  : state.selectedEquation === 'tenHaaf2014LeanMass'
  ? tenHaaf2014LeanMass
  : state.selectedEquation === 'tenHaaf2014Weight'
  ? tenHaaf2014Weight
  : state.selectedEquation === 'tinsley2019MuscularWeight'
  ? tinsley2019MuscularWeight
  : state.selectedEquation === 'tinsley2019Weight'
  ? tinsley2019Weight
  : state.selectedEquation === 'dRI2023Pregnant'
  ? dRI2023Pregnant
  : state.selectedEquation === 'pregnancy14a19anos'
  ? pregnancy14a19anos
  : state.selectedEquation === 'pregnancy19anos'
  ? pregnancy19anos
  : state.selectedEquation === 'dri200519Obesity'
  ? dri200519Obesity
  : state.selectedEquation === 'horieWaitzbergGonzalez'
  ? horieWaitzbergGonzalez
  : state.selectedEquation === 'mifflinStJeor1990'
  ? mifflinStJeor1990
  : state.selectedEquation === 'harrisBenedic1919'
  ? harrisBenedic1919
  : state.selectedEquation === 'harrisBenedic1984'
  ? harrisBenedic1984
  : state.selectedEquation === 'dri2023Lactante1Semestre14a19anos'
  ? dri2023Lactante1Semestre14a19anos
  : state.selectedEquation === 'dri2023Lactante1Semestre19anos'
  ? dri2023Lactante1Semestre19anos
  : state.selectedEquation === 'dri2023Lactante2Semestre14a19anos'
  ? dri2023Lactante2Semestre14a19anos
  : state.selectedEquation === 'dri2023Lactante2Semestre19anos'
  ? dri2023Lactante2Semestre19anos
  : 0
}