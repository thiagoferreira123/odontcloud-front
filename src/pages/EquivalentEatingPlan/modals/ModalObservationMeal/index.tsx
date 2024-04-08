import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import AsyncButton from '/src/components/AsyncButton';
import SelectObservation from './SelectObservation';
import { useModalsStore } from '/src/pages/EquivalentEatingPlan/hooks/modalsStore';
import api from '/src/services/useAxios';
import { useEquivalentEatingPlanStore } from '/src/pages/EquivalentEatingPlan/hooks/equivalentEatingPlanStore';
import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';

type ModalObservationMealProps = {
  show: boolean;
  onClose: () => void;
};

interface FormValues {
  comentario: string;
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

const notify = (message: string, title: string, icon: string, status?: string, isLoading?: boolean) =>
  toast(<NotificationIcon message={message} title={title} icon={icon} status={status} isLoading={isLoading} />, { autoClose: isLoading ? false : 5000 });


export default function ModalObservationMeal(props: ModalObservationMealProps) {

  const [isSaving, setIsSaving] = useState(false);
  const initialValues = { comentario: '' };

  const selectedMeal = useModalsStore((state) => state.selectedMeal);

  const { updateMeal } = useEquivalentEatingPlanStore();

  const validationSchema = Yup.object().shape({
    comentario: Yup.string().required('Insira uma observação válida'),
  });

  const onSubmit = async (values: FormValues) => {
    if (!selectedMeal) return;

    setIsSaving(true);

    try {
      await api.patch(`/plano-alimentar-equivalente-refeicao/${selectedMeal.id}`, values);

      updateMeal({ ...selectedMeal, comentario: values.comentario });
      setIsSaving(false);
      props.onClose();

    } catch (error) {
      console.error(error);
      notify('Erro ao salvar orientação', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, values, touched, errors } = formik;

  const onGetObservation = (comentario: string) => {
    setFieldValue('comentario', comentario);
  };

  useEffect(() => {
    if (selectedMeal) {
      setFieldValue('comentario', selectedMeal.comentario);
    }
  }, [selectedMeal, setFieldValue]);

  return (
    <Modal show={props.show} onHide={props.onClose} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Insira uma observação na refeição</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <SelectObservation show={props.show} onGetObservation={onGetObservation} />
        </div>

        <Form.Control as="textarea" rows={8} name="comentario" onChange={handleChange} value={values.comentario} />
        {errors.comentario && touched.comentario && <LabelEndTooltip>{errors.comentario}</LabelEndTooltip>}
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
          Salvar observação
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
}
