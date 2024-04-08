import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SelectObservation from './SelectObservation';
import useClassicPlan from '../../hooks/useClassicPlan';
import api from '../../../../services/useAxios';
import { notify } from '../../../../components/toast/NotificationIcon';
import AsyncButton from '../../../../components/AsyncButton';

interface ModalObservationMealProps {
  show: boolean;
  onClose: () => void;
}

interface FormValues {
  textObservation: string;
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

const ModalObservationMeal: React.FC<ModalObservationMealProps> = (props: ModalObservationMealProps) => {
   const [isSaving, setIsSaving] = useState(false);

  const selectedMeal = useClassicPlan((state) => state.selectedMeal);
  const selectedMealId = useClassicPlan((state) => state.selectedMealId);
  const { updateMeal, updateReplacementMeal } = useClassicPlan();

  const initialValues = { textObservation: '' };

  const validationSchema = Yup.object().shape({
    textObservation: Yup.string().required('Insira uma observação válida'),
  });

  const onSubmit = async (values: FormValues) => {
    if (!selectedMeal) return;

    setIsSaving(true);

    try {
      const payload = {
        obs: values.textObservation,
      };

      if (!selectedMealId) {
        await api.patch(`/plano-alimentar-classico-refeicao/${selectedMeal.id}`, payload);

        updateMeal({ ...selectedMeal, obs: values.textObservation });
        setIsSaving(false);
        props.onClose();
      } else {
        await api.patch(`/plano-alimentar-classico-refeicao-substituta/${selectedMeal.id}`, payload);

        updateReplacementMeal({ ...selectedMeal, obs: values.textObservation });
        setIsSaving(false);
        props.onClose();
      }

    } catch (error) {
      console.error(error);
      notify('Erro ao salvar orientação', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, values, touched, errors } = formik;

  const onGetObservation = (observation: string) => {
    setFieldValue('textObservation', observation);
  };

  useEffect(() => {
    if (selectedMeal) {
      setFieldValue('textObservation', selectedMeal.obs);
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

        <Form.Control as="textarea" rows={8} name="textObservation" onChange={handleChange} value={values.textObservation} />
        {errors.textObservation && touched.textObservation && <LabelEndTooltip>{errors.textObservation}</LabelEndTooltip>}
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
          Salvar observação
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalObservationMeal;
