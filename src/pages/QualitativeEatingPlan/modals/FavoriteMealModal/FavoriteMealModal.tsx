import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import AsyncButton from '/src/components/AsyncButton';
import { useFavoriteMealModal } from '../../hooks/modals/FavoriteMealModalStore';
import { useTemplateMealStore } from '../../hooks/TemplateMealStore';
import CategorySelect from './CategorySelect';

interface FormValies {
  name: string;
  category: string;
}

const FavoriteMealModal: React.FC = () => {
  const selectedMeal = useFavoriteMealModal((state) => state.selectedMeal);
  const showModal = useFavoriteMealModal((state) => state.showModal);
  const [isSaving, setIsSaving] = React.useState(false);

  const { closeModal } = useFavoriteMealModal();
  const { saveMealAsTemplate } = useTemplateMealStore();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Insira um name válido'),
    category: Yup.string().typeError('Selecione uma categoria válida').required('Selecione uma categoria'),
  });

  const initialValues: FormValies = { name: '', category: '' };
  const onSubmit = async (values: FormValies) => {
    setIsSaving(true);

    await saveMealAsTemplate({ ...selectedMeal, ...values });

    closeModal();
    setIsSaving(false);
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, values, touched, errors } = formik;

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" className="modal-close-out">
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

export default FavoriteMealModal;
