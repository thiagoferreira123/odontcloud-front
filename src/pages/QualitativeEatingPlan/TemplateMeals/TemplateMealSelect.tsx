import React, { useMemo } from 'react';
import Select from 'react-select';
import { Option } from '/src/types/inputs';
import { useTemplateMealStore } from '../hooks/TemplateMealStore';
import StaticLoading from '../../../components/loading/StaticLoading';
import { useFilterStore } from '../hooks/FilterStore';

interface TemplateMealSelectPRops {
  isLoading: boolean;
}

const TemplateMealSelect = (props: TemplateMealSelectPRops) => {

  const qualitativeEatingPlanMealsOptions = useFilterStore((state) => state.qualitativeEatingPlanMealOptions);
  const templateMeals = useTemplateMealStore((state) => state.templateMeals);

  const { setQualitativeEatingPlanMealOptions } = useFilterStore();

  const options = useMemo(() => {
    try {
      return templateMeals.reduce((acc: Option[], templateMeal) => {

        if(acc.find(category => category.label === templateMeal.category) || templateMeal.category === 'null' || !templateMeal.category?.length) return acc;

        acc.push({ label: templateMeal.category, value: templateMeal.category })

        return acc;
      }, []);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [templateMeals])

  return (
    props.isLoading ? <StaticLoading /> :
    <Select
      classNamePrefix="react-select"
      isMulti
      options={options}
      value={qualitativeEatingPlanMealsOptions}
      onChange={value => setQualitativeEatingPlanMealOptions(value as Option[])}
      placeholder="Categoria da refeição"
    />
  );
};

export default TemplateMealSelect;
