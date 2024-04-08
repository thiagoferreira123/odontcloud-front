import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Card, Col, Row } from 'react-bootstrap';

import CardAnalisyComparation from './CardAnalisyComparation';
import ChartExam from './ChartExam';
import { RequestingExam } from '../../types/RequestingExam';
import PatientMenuRow from '../../components/PatientMenuRow';

export type ExamAnalyse = {
  id: string;
  selectedExamIds: number[];
  value: number[];
  dates: string[];
  name: string;
};

export default function RequestingExamsComparative() {
  const [selectedExams, setSelectedExams] = useState<Array<RequestingExam | null>>([null, null, null, null, null]);

  const exams = selectedExams.reduce((acc: ExamAnalyse[], exam, index) => {
    if (!exam?.examsSelected) return acc;

    const exams = exam.examsSelected.reduce((acc2: ExamAnalyse[], selectedExam) => {
      if (!selectedExam.exam.id) return acc2;

      if (acc.find((item) => item.name === selectedExam.exam.examName)) {
        acc = acc.map((item) => {
          if (item.name === selectedExam.exam.examName) {
            item.value[index] += selectedExam.examsBloodSelectedValueObtained;
            item.dates[index] = new Date(exam.requestDate).toLocaleDateString();
          }
          return item;
        });

        return acc2;
      }

      const value = Array(selectedExams.length).fill(0);
      const dates = Array(selectedExams.length).fill(' ');
      const selectedExamIds = Array(selectedExams.length).fill(' ');

      value[index] = selectedExam.examsBloodSelectedValueObtained;
      dates[index] = new Date(exam.requestDate).toLocaleDateString();
      selectedExamIds[index] = exam.id;

      const payload: ExamAnalyse = {
        id: selectedExam.exam.id,
        selectedExamIds,
        value,
        dates,
        name: selectedExam.exam.examName,
      };

      acc2.push(payload);

      return acc2;
    }, []);

    acc.push(...exams);
    return acc;
  }, []);

  return (
    <>
      <PatientMenuRow />

      <CardAnalisyComparation selectedExams={selectedExams} setSelectedExams={setSelectedExams} exams={exams} />

      <Col xs="12">
        <section className="scroll-section" id="largeLineCharts">
          <Row className="g-2 mt-3">
            {exams
              .reduce((acc: ExamAnalyse[], e) => {
                if (!acc.find((item) => item.name === e.name)) {
                  acc.push(e);
                }
                return acc;
              }, [])
              .map((exam) => (
                <Col xs="12" lg="6" xxl="4" key={exam.name}>
                  <Card className="mb-2 h-auto sh-xl-24" id="introFirst">
                    <Card.Body>
                      <Row className="g-0 h-100">
                        <ChartExam exam={exam} />
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </section>
      </Col>
    </>
  );
}
