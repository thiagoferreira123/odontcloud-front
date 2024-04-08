import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { Option } from '/src/types/inputs';
import { useRequestingExamStore } from './hooks/RequestingExamStore';
import { useExamsSelectStore } from './hooks/ExamsSelectStore';
import { SelectedExam } from '/src/types/RequestingExam';

const SelectByCategory = () => {
  const [value, setValue] = useState<SingleValue<Option>>();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([] as Option[]);

  const exams = useExamsSelectStore((state) => state.exams);
  const templates = useExamsSelectStore((state) => state.templates);

  const { addSelectedExams } = useRequestingExamStore();
  const { getExams, getExamTemplates } = useExamsSelectStore();

  const handleSelectCategory = (newValue: SingleValue<Option>) => {
    setValue(newValue);

    if(newValue?.value && newValue.value.includes('@@')) {

      const templateId = newValue.value.replace('@@', '');

      const tempalte = templates.find((template) => template.id === templateId);

      if(!tempalte) return;

      addSelectedExams(tempalte.selectedExams.reduce((acc: SelectedExam[], selectedExam) => {
        const payload: SelectedExam = {
          id: btoa(Math.random().toString()),
          examsBloodSelectedValueObtained: 0,
          exam: selectedExam.examesBloodInfo,
        };

        return [...acc, payload];
      }, []));

    } else {
      const selectedExams = exams
        .filter((exam) => exam.examCategory === newValue?.value)
        .map((exam) => {
          const payload: SelectedExam = {
            id: btoa(Math.random().toString()),
            examsBloodSelectedValueObtained: 0,
            exam,
          };

          return payload;
        });

      addSelectedExams(selectedExams);
    }

  };

  const categoryOptions: Option[] = useMemo(() => {
    return exams
      ? exams.reduce((acc: Option[], exam) => {
          if (acc.find((option) => option.value === exam.examCategory)) return acc;

          return [...acc, { label: exam.examCategory, value: exam.examCategory }];
        }, [])
      : [];
  }, [exams]);
  const templateOptions: Option[] = useMemo(() => {
    return templates
      ? templates.map((template) => ({
          label: template.examsBloodTemplateName,
          value: `@@${template.id}`,
        }))
      : [];
  }, [templates]);

  const buildOptions = useCallback(async () => {
    setIsLoading(true);

    try {
      !exams.length && await getExams();
      !templates.length && await getExamTemplates();

      setOptions([...categoryOptions, ...templateOptions]);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [categoryOptions, exams.length, getExamTemplates, getExams, templateOptions, templates.length]);

  useEffect(() => {
    if ((options.length && (categoryOptions.length + templateOptions.length) === options.length) || isLoading) return;

    buildOptions();
  }, [buildOptions, categoryOptions.length, isLoading, options.length, templateOptions.length]);

  return <Select classNamePrefix="react-select" options={options} value={value} onChange={handleSelectCategory} placeholder="Digite o label do nutriente" />;
};

export default SelectByCategory;
