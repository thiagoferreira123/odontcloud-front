import React, { useEffect } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import AsyncButton from '/src/components/AsyncButton';
import CategorySelect from './CategorySelect';
import { useConfigQualitativeMealModalStore } from '../../hooks/ConfigQualitativeMealModal';
import { useQueryClient } from '@tanstack/react-query';
import { useMyQualitativeMealsStore } from '../../hooks/MyQualitativeMeals';

interface FormValies {
  name: string;
  category: string;
  content: string;
}

const ConfigQualitativeMealModal: React.FC = () => {
  const queryClient = useQueryClient();

  const selectedMeal = useConfigQualitativeMealModalStore((state) => state.selectedMeal);
  const showModal = useConfigQualitativeMealModalStore((state) => state.showModal);
  const [isSaving, setIsSaving] = React.useState(false);

  const { closeModal } = useConfigQualitativeMealModalStore();
  const { createQualitativeMeal, updateQualitativeMeal } = useMyQualitativeMealsStore();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Insira um nome válido'),
    category: Yup.string().typeError('Selecione uma categoria válida').required('Selecione uma categoria'),
    content: Yup.string().typeError('Digite um conteúdo válido').required('Digite um conteúdo'),
  });

  const initialValues: FormValies = { name: '', category: '', content: '' };
  const onSubmit = async (values: FormValies) => {
    setIsSaving(true);

    const response = selectedMeal?.id
      ? await updateQualitativeMeal({ ...selectedMeal, ...values }, queryClient)
      : await createQualitativeMeal({ ...selectedMeal, ...values }, queryClient);

    response && closeModal();
    setIsSaving(false);
    resetForm();
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, resetForm, setValues, values, touched, errors } = formik;

  useEffect(() => {
    if (!selectedMeal) return resetForm();

    setValues({
      name: selectedMeal.name,
      category: selectedMeal.category,
      content: selectedMeal.content,
    });
  }, [resetForm, selectedMeal, setValues]);

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" className="modal-close-out" size="xl">
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Salve essa refeição para usar depois</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="mb-3 filled mt-2">
            <CsLineIcons icon="cupcake" />
            <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Digite um nome para essa refeição" />
            {errors.name && touched.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="mb-3 filled mt-2" style={{ zIndex: 9999 }}>
            <CsLineIcons icon="cupcake" />
            <CategorySelect
              touched={formik.touched}
              errors={formik.errors}
              value={formik.values.category}
              values={formik.values}
              handleChange={formik.handleChange}
              setFieldValue={formik.setFieldValue}
            />
            {errors.category && touched.category && <div className="error">{errors.category}</div>}
          </div>

          <div className="mb-3 filled mt-2">
            <Form.Control
              name="content"
              as="textarea"
              rows={8}
              value={values.content}
              onChange={handleChange}
              placeholder="Digite a refeição"
              className="custom-scrollbar ps-3"
            />
            {errors.content && touched.content && <div className="error">{errors.content}</div>}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
            Salvar refeição
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ConfigQualitativeMealModal;
