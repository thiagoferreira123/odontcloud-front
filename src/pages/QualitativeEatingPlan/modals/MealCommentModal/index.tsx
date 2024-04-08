import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SelectObservation from './SelectObservation';
import AsyncButton from '/src/components/AsyncButton';
import api from '/src/services/useAxios';
import { useMealCommentModalStore } from '../../hooks/modals/MealCommentModalStore';
import { useQualitativeEatingPlanStore } from '../../hooks/QualitativeEatingPlanStore';
import { notify } from '../../../../components/toast/NotificationIcon';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

interface FormValues {
  comment: string;
}

const LabelEndTooltip = ({ children }: { children: React.ReactNode }) => {
  const refError = useRef(null);
  const [left, setLeft] = useState(10);

  useEffect(() => {
    if (refError.current) {
      try {
        const parentElement = refError.current as HTMLElement | null;
        if (parentElement) {
          const labelElement = parentElement.querySelector('label');
          if (labelElement) {
            setLeft(labelElement.clientWidth + 10);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    return () => {};
  }, []);

  return (
    <div ref={refError} className="error" style={{ left }}>
      {children}
    </div>
  );
};

const MealCommentModal: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const showModal = useMealCommentModalStore((state) => state.showModal);
  const selectedMeal = useMealCommentModalStore((state) => state.selectedMeal);

  const initialValues = { comment: '' };

  const validationSchema = Yup.object().shape({
    comment: Yup.string().required('Insira um comentário'),
  });
  const { updateMeal } = useQualitativeEatingPlanStore();
  const { closeModal } = useMealCommentModalStore();

  const onSubmit = async (values: FormValues) => {
    if (!selectedMeal) return;

    setIsSaving(true);

    try {
      updateMeal({ ...selectedMeal, ...values });
      closeModal();

      await api.patch(`/plano-alimentar-qualitativo-refeicao/${selectedMeal.id}`, values);
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      notify('Erro ao salvar orientação', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, values, touched, errors } = formik;

  const onGetObservation = (observation: string) => {
    setFieldValue('comment', observation);
  };

  const handleRemoveOrientation = async () => {
    if (!selectedMeal) return;

    await api.patch(`/plano-alimentar-qualitativo-refeicao/${selectedMeal.id}`, initialValues);

    notify('Orientação removida com sucesso', 'Sucesso', 'check', 'success');
    updateMeal({ ...selectedMeal, ...initialValues });
    formik.resetForm();
  };

  useEffect(() => {
    if (selectedMeal) {
      setFieldValue('comment', selectedMeal.comment);
    }
  }, [selectedMeal, setFieldValue]);

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Insira um comentário na refeição</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <SelectObservation show={showModal} onGetObservation={onGetObservation} />
        </div>

        <div className="mb-3 position-relative">
          <Form.Control as="textarea" rows={8} name="comment" onChange={handleChange} value={values.comment} />
          {errors.comment && touched.comment && <LabelEndTooltip>{errors.comment}</LabelEndTooltip>}

          {values.comment.length ? (
            <button
              onClick={handleRemoveOrientation}
              className="btn btn-sm btn-icon btn-icon-only btn-primary m-1 position-absolute bottom-0 end-0"
              type="button"
            >
              <CsLineIcons icon="bin" />
            </button>
          ) : (
            false
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
          Salvar observação
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default MealCommentModal;
