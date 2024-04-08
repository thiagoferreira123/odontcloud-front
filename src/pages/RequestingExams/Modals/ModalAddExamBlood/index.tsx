import React, { useEffect, useState } from 'react';
import { Col, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CategorySelect from './CategorySelect';
import { Exam } from '/src/types/RequestingExam';
import AsyncButton from '/src/components/AsyncButton';
import { useExamsSelectStore } from '/src/pages/RequestingExams/hooks/ExamsSelectStore';
import { notify } from '/src/components/toast/NotificationIcon';
import { useModalAddExamBloodStore } from '/src/pages/RequestingExams/hooks/ModalAddExamBloodStore';
import { useMyExamsStore } from '/src/pages/MyMaterials/my-exams/hooks/MyExamsStore';
import { useQueryClient } from '@tanstack/react-query';

interface FormValues {
  ExameName: string;
  examMeasurementUnit: string;
  examCategory: string;
  minRangeFemale: string;
  maxRangeFemale: string;
  maxRangeMale: string;
  situationsIndicatingIncreaseOrPositivity: string;
  situationsIndicatingDecreaseOrNegativity: string;
  minRangeMale: string;
  bloodDescription: string;
}

const ModalAddExamBlood = () => {
  const validationSchema = Yup.object().shape({
    ExameName: Yup.string().required('Insira um nome válido'),
    examMeasurementUnit: Yup.string().required('Insira uma medida válido, exemplo mg/dL'),
    examCategory: Yup.string().required('Insira uma categoria válido'),
    maxRangeFemale: Yup.number().typeError('Insira um valor válido').required('Insira um valor válido'),
    minRangeFemale: Yup.number().typeError('Insira um valor válido').required('Insira um valor válido'),
    maxRangeMale: Yup.number().typeError('Insira um valor válido').required('Insira um valor válido'),
    minRangeMale: Yup.number().typeError('Insira um valor válido').required('Insira um valor válido'),
    situationsIndicatingIncreaseOrPositivity: Yup.string().required('Insira um texto válido'),
    situationsIndicatingDecreaseOrNegativity: Yup.string().required('Insira um texto válido'),
    bloodDescription: Yup.string().required('Insira um texto válido'),
  });

  const initialValues = {
    ExameName: '',
    examMeasurementUnit: '',
    examCategory: '',
    minRangeFemale: '',
    maxRangeFemale: '',
    maxRangeMale: '',
    situationsIndicatingIncreaseOrPositivity: '',
    situationsIndicatingDecreaseOrNegativity: '',
    minRangeMale: '',
    bloodDescription: '',
  };



  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const showModal = useModalAddExamBloodStore((state) => state.showModal);
  const selectedExam = useModalAddExamBloodStore((state) => state.selectedExam);

  const { addExam } = useExamsSelectStore();
  const { updateExam } = useMyExamsStore();
  const { handleHideModal } = useModalAddExamBloodStore();

  const onSubmit = async (values: FormValues) => {

    setIsSaving(true);

    try {
      const payload: Exam = {
        examName: values.ExameName,
        examMeasurementUnit: values.examMeasurementUnit,
        examCategory: values.examCategory,
        minRangeMale: Number(values.minRangeMale),
        maxRangeMale: Number(values.maxRangeMale),
        minRangeFemale: Number(values.minRangeFemale),
        maxRangeFemale: Number(values.maxRangeFemale),
        situationsIndicatingIncreaseOrPositivity: values.situationsIndicatingIncreaseOrPositivity,
        situationsIndicatingDecreaseOrNegativity: values.situationsIndicatingDecreaseOrNegativity,
        bloodDescription: values.bloodDescription
      }

      if (selectedExam) {
        const response = await updateExam({ ...selectedExam, ...payload }, queryClient);
        if (response === false) throw new Error('Erro ao cadastrar o exame');
        notify('Exame atualizado com sucesso', 'Sucesso', 'check', 'success');
      } else {
        const response = await addExam(payload, queryClient);
        if (response === false) throw new Error('Erro ao cadastrar o exame');
        notify('Exame cadastrado com sucesso', 'Sucesso', 'check', 'success');
      }

      setIsSaving(false);
      handleHideModal();
      formik.resetForm();
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      notify('Ocorreu um erro ao cadastrar o exame', 'Erro', 'close', 'danger');
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { setValues, resetForm } = formik;


  useEffect(() => {
    if (!selectedExam) resetForm();

    setValues({
      ExameName: selectedExam?.examName || '',
      examMeasurementUnit: selectedExam?.examMeasurementUnit || '',
      examCategory: selectedExam?.examCategory || '',
      minRangeFemale: selectedExam?.minRangeFemale.toString() || '',
      maxRangeFemale: selectedExam?.maxRangeFemale.toString() || '',
      maxRangeMale: selectedExam?.maxRangeMale.toString() || '',
      situationsIndicatingIncreaseOrPositivity: selectedExam?.situationsIndicatingIncreaseOrPositivity || '',
      situationsIndicatingDecreaseOrNegativity: selectedExam?.situationsIndicatingDecreaseOrNegativity || '',
      minRangeMale: selectedExam?.minRangeMale.toString() || '',
      bloodDescription: selectedExam?.bloodDescription || '',
    });
  }, [resetForm, selectedExam, setValues]);


  const createChangeHandler = (formik: any, fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueWithDot = e.target.value.replace(/,/g, '.');
    formik.setFieldValue(fieldName, valueWithDot);
  };


  return (
    <Modal className="modal-close-out" size="xl" show={showModal} onHide={handleHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastre os seus próprios exames</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <div className="d-flex">
            <Col md={6}>
              <div className="top-label mb-3 me-1">
                <Form.Control type="text" name="ExameName" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.ExameName} />
                <Form.Label>NOME DO EXAME</Form.Label>
                {formik.touched.ExameName && formik.errors.ExameName && <div className="error">{formik.errors.ExameName}</div>}
              </div>
            </Col>
            <Col md={4}>
              <div className="top-label mb-3 me-1">
                <Form.Label>CATEGORIA DO EXAME</Form.Label>
                <CategorySelect
                  touched={formik.touched}
                  errors={formik.errors}
                  value={formik.values.examCategory}
                  values={formik.values}
                  name='examCategory'
                  handleChange={formik.handleChange}
                  setFieldValue={formik.setFieldValue}
                />
              </div>
            </Col>
            <Col md={2}>
              <div className="top-label mb-3 me-1">
                <Form.Control
                  type="text"
                  name="examMeasurementUnit"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.examMeasurementUnit}
                />
                <Form.Label>UNIDADE</Form.Label>
                {formik.touched.examMeasurementUnit && formik.errors.examMeasurementUnit && <div className="error">{formik.errors.examMeasurementUnit}</div>}
              </div>
            </Col>
          </div>
          <div className="d-flex">
            <Col md={3}>
              <div className="top-label mb-3 me-1">
                <Form.Control
                  type="text"
                  name="maxRangeFemale"
                  onChange={createChangeHandler(formik, 'maxRangeFemale')}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxRangeFemale}
                />
                <Form.Label>VALOR MÁXIMO (FEMININO)</Form.Label>
                {formik.touched.maxRangeFemale && formik.errors.maxRangeFemale && <div className="error">{formik.errors.maxRangeFemale}</div>}
              </div>
            </Col>
            <Col md={3}>
              <div className="top-label mb-3 me-1">
                <Form.Control
                  type="text"
                  name="minRangeFemale"
                  onChange={createChangeHandler(formik, 'minRangeFemale')}
                  onBlur={formik.handleBlur}
                  value={formik.values.minRangeFemale}
                />
                <Form.Label>VALOR MÍNIMO (FEMININO)</Form.Label>
                {formik.touched.minRangeFemale && formik.errors.minRangeFemale && <div className="error">{formik.errors.minRangeFemale}</div>}
              </div>
            </Col>
            <Col md={3}>
              <div className="top-label mb-3 me-1">
                <Form.Control
                  type="text"
                  name="maxRangeMale"
                  onChange={createChangeHandler(formik, 'maxRangeMale')}
                  onBlur={formik.handleBlur}
                  value={formik.values.maxRangeMale} />
                <Form.Label>VALOR MÁXIMO (MASCULINO)</Form.Label>
                {formik.touched.maxRangeMale && formik.errors.maxRangeMale && <div className="error">{formik.errors.maxRangeMale}</div>}
              </div>
            </Col>
            <Col md={3}>
              <div className="top-label mb-3 me-1">
                <Form.Control
                  type="text"
                  name="minRangeMale"
                  onChange={createChangeHandler(formik, 'minRangeMale')}
                  onBlur={formik.handleBlur}
                  value={formik.values.minRangeMale} />
                <Form.Label>VALOR MÍNIMO (MASCULINO)</Form.Label>
                {formik.touched.minRangeMale && formik.errors.minRangeMale && <div className="error">{formik.errors.minRangeMale}</div>}
              </div>
            </Col>
          </div>
          <div>
            <Col md={12}>
              <div className="top-label mb-3 me-1">
                <Form.Control
                  type="textarea"
                  name="situationsIndicatingIncreaseOrPositivity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.situationsIndicatingIncreaseOrPositivity}
                />
                <Form.Label>SITUAÇÕES/MORBIDADES QUE DETERMINAM AUMENTO/POSITIVIDADE:</Form.Label>
                {formik.touched.situationsIndicatingIncreaseOrPositivity && formik.errors.situationsIndicatingIncreaseOrPositivity && (
                  <div className="error">{formik.errors.situationsIndicatingIncreaseOrPositivity}</div>
                )}
              </div>
            </Col>
            <Col md={12}>
              <div className="top-label mb-3 me-1">
                <Form.Control
                  type="textarea"
                  name="situationsIndicatingDecreaseOrNegativity"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.situationsIndicatingDecreaseOrNegativity}
                />

                <Form.Label>SITUAÇÕES/MORBIDADES QUE DETERMINAM DIMINUIÇÃO/NEGATIVIDADE:</Form.Label>
                {formik.touched.situationsIndicatingDecreaseOrNegativity && formik.errors.situationsIndicatingDecreaseOrNegativity && (
                  <div className="error">{formik.errors.situationsIndicatingDecreaseOrNegativity}</div>
                )}
              </div>
            </Col>
            <Col md={12}>
              <div className="top-label mb-3 me-1">
                <Form.Control
                  type="textarea"
                  name="bloodDescription"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bloodDescription}
                />

                <Form.Label>DESCRIÇÃO DO EXAME</Form.Label>
                {formik.touched.bloodDescription && formik.errors.bloodDescription && <div className="error">{formik.errors.bloodDescription}</div>}
              </div>
            </Col>
          </div>
          <Col className="mt-3 text-center  ">
            <AsyncButton isSaving={isSaving} type="submit" size="lg" className="btn btn-primary mt-2 hover-scale-down">
              {selectedExam ? 'Atualizar' : 'Cadastrar'} exame
            </AsyncButton>
          </Col>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddExamBlood;
