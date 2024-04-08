import React, { useCallback, useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';
import { useRequestingExamStore } from './hooks/RequestingExamStore';
import { useExamsSelectStore } from './hooks/ExamsSelectStore';
import { SelectedExam } from '../../types/RequestingExam';
import { Option } from '../../types/inputs';
import { notEmpty } from '../../helpers/Utils';
import { useParams } from 'react-router-dom';

const ExamsSelect = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams<{ id: string }>();

  const selectedExamOptions = useRequestingExamStore((state) => state.selectedExamOptions);
  const selectedExams = useRequestingExamStore((state) => state.selectedExams);
  const exams = useExamsSelectStore((state) => state.exams);

  const { setSelectedExamOptions, setSelectedExams } = useRequestingExamStore();
  const { getExams } = useExamsSelectStore();

  const handleChangeSelectedOptions = useCallback((selectedOptions: MultiValue<Option>) => {
    setSelectedExamOptions(selectedOptions);
    setSelectedExams(selectedOptions.map((option) => {

      const previousSelected = selectedExams.find((exam) => exam.exam.examName === option.value);

      if(previousSelected) return previousSelected;

      const exam = exams.find((exam) => exam.examName === option.value);

      if(!exam) return;

      const payload: SelectedExam = {
        id: btoa(Date.now().toString()),
        examsBloodSelectedValueObtained: 0,
        exam
      }

      return payload;
    }).filter(notEmpty));
  }, [exams, selectedExams, setSelectedExamOptions, setSelectedExams]);

  const buildOptions = useCallback(async () => {
    setIsLoading(true);

    try {
      const exams = await getExams();

      if(exams === false) throw new Error('Erro ao buscar exames');

      setOptions(exams.map((exam) => ({ label: exam.examName, value: exam.examName })));

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [getExams])

  useEffect(() => {
    if(options.length === exams.length || isLoading) return;

    buildOptions();
  }, [buildOptions, exams.length, isLoading, options.length]);

  return (
    <Select
      classNamePrefix="react-select"
      isMulti
      options={options}
      value={selectedExamOptions}
      onChange={handleChangeSelectedOptions}
      placeholder="Digite o nome do exame"
    />
  );
};

export default ExamsSelect;
