import { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useModalNewProcedureStore } from '../hooks/ModalNewProcedureStore';
import SelectTeeth from './SelectTeeth';
import ProcedureSelect from './ProcedureSelect';
import AsyncButton from '../../../components/AsyncButton';
import { useQueryClient } from '@tanstack/react-query';
import { notify } from '../../../components/toast/NotificationIcon';
import useProcedureStore from '../hooks/ProcedureStore';
import { useParams } from 'react-router-dom';

interface ModalNewProcedure {
  showModal: boolean;
  onHide: () => void;
}

export interface ModalNewProcedureFormValues {
  procedure_name: string;
  // procedure_professional_id: string;
  procedure_value: string;
  procedure_deciduous_or_permanent: 'deciduos' | 'permanent';
  procedure_observations: string;
  procedure_status: 'pending' | 'realized' | 'pre-existing';
  teeth: {
    tooth_number: string;
    tooth_quadrant?: string;
  }[];
  tooth_faces: string[];
}

const ModalNewProcedure = ({ showModal, onHide }: ModalNewProcedure) => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const selectedProcedure = useModalNewProcedureStore((state) => state.selectedProcedure);
  const showOnlyClinicProcedures = useModalNewProcedureStore((state) => state.showOnlyClinicProcedures);

  const initialValues: ModalNewProcedureFormValues = {
    procedure_name: '',
    procedure_value: '',
    procedure_deciduous_or_permanent: 'deciduos',
    procedure_observations: '',
    procedure_status: 'pending',
    teeth: [],
    tooth_faces: [],
  };

  const validationSchema = Yup.object().shape({
    // procedure_name: Yup.string().required('Insira um procedimento válido'),
    procedure_value: Yup.string().required('Insira um valor válido'),
    procedure_status: Yup.string().required('Insira um estado válido'),
    teeth: Yup.array()
      .of(
        Yup.object().shape({
          tooth_number: Yup.string(),
          tooth_quadrant: Yup.string(),
        })
      )
      .min(1, 'Selecione pelo menos um dente'),
    // tooth_faces: Yup.array().of(Yup.string()).min(1, 'Selecione pelo menos uma face'),
  });

  const handleChangeMaskMoney = (event: { target: { value: string } }) => {
    const inputValue = (parseInt(event.target.value.replace(/\D/g, ''), 10) / 100)
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    setFieldValue('procedure_value', inputValue);
  };

  const onSubmit = async (values: ModalNewProcedureFormValues) => {
    setIsSaving(true);

    try {
      const payload = {
        procedure_name: values.procedure_name,
        procedure_value: values.procedure_value,
        procedure_deciduous_or_permanent: values.procedure_deciduous_or_permanent,
        procedure_observations: values.procedure_observations,
        procedure_status: values.procedure_status,
        teeth: values.teeth.map(tooth => ({
          tooth_number: tooth.tooth_number,
          tooth_quadrant: tooth.tooth_quadrant,
          tooth_faces: JSON.stringify(values.tooth_faces),
        })),
        procedure_care_plan_id: id,
      };

      if (!selectedProcedure) {
        const response = await addProcedure(payload, queryClient);

        if (response !== false) hideModal();

        resetForm();
      }

      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      notify('Erro ao salvar anamnese como modelo', 'Erro', 'close', 'danger');
    }
  };

  const handleToggleToothFaces = (face: string, checked: boolean) => {
    if (checked) {
      setFieldValue('tooth_faces', [...values.tooth_faces, face]);
    } else {
      setFieldValue(
        'tooth_faces',
        values.tooth_faces.filter((f) => f !== face)
      );
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, resetForm, values, touched, errors } = formik;
  const { setShowOnlyClinicProcedures, hideModal } = useModalNewProcedureStore();
  const { addProcedure } = useProcedureStore();

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Novo procedimento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          {/* <Row>
          <Col xs="12" className="mb-3">
            <Form.Label className="d-block">
              <strong>Profissional</strong>
            </Form.Label>
            <ProcedureSelect />
            {errors.titulo && touched.titulo && <div className="error">{errors.titulo}</div>}
          </Col>
        </Row> */}
          <Row>
            <Form.Label className="d-flex">
              <strong>Procedimentos </strong>
              <Form.Check
                type="checkbox"
                label="Exibir apenas procedimentos da clínica"
                id="stackedCheckbox1"
                defaultChecked={showOnlyClinicProcedures}
                onChange={(e) => setShowOnlyClinicProcedures(e.target.checked)}
                className="ms-3"
              />
            </Form.Label>
            <Col xs="12" className="mb-3">
              <ProcedureSelect formik={formik} />
              {errors.procedure_name && touched.procedure_name && <div className="error">{errors.procedure_name}</div>}
            </Col>
          </Row>
          <Row>
            <Form.Label className="d-block">
              <strong>Valor R$</strong>
            </Form.Label>
            <Col xs="12" className="mb-3 d-flex">
              <Form.Control type="text" name="procedure_value" value={values.procedure_value} onChange={handleChangeMaskMoney} />
              {errors.procedure_value && touched.procedure_value && <div className="error">{errors.procedure_value}</div>}
            </Col>
          </Row>
          <Row>
            <Col xs="12" className="mb-3">
              <Form.Label className="d-flex">
                <strong>Dentes </strong>
                <Form.Check
                  type="radio"
                  label="Permanente"
                  id="procedure_deciduous_or_permanent1"
                  name="procedure_deciduous_or_permanent"
                  className="ms-3"
                  onChange={(e) => setFieldValue('procedure_deciduous_or_permanent', 'permanent')}
                  checked={values.procedure_deciduous_or_permanent == 'permanent'}
                />
                <Form.Check
                  type="radio"
                  label="Decíduo"
                  id="procedure_deciduous_or_permanent2"
                  name="procedure_deciduous_or_permanent"
                  className="ms-3"
                  onChange={(e) => setFieldValue('procedure_deciduous_or_permanent', 'deciduos')}
                  checked={values.procedure_deciduous_or_permanent == 'deciduos'}
                />
              </Form.Label>
              <SelectTeeth formik={formik} />
              {errors.teeth && touched.teeth && <div className="error">{errors.teeth.toString()}</div>}
            </Col>
          </Row>
          <Row>
            <Form.Label className="d-block">
              <strong>Faces do dente 51:</strong>
            </Form.Label>
            <Col xs="12" className="mb-3 d-flex">
              <Form.Check
                type="checkbox"
                label="Oclusal/Incisal"
                id="tooth_faces1"
                className="me-4"
                checked={values.tooth_faces.includes('Oclusal/Incisal')}
                onChange={(e) => handleToggleToothFaces('Oclusal/Incisal', e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Lingual/Palatina"
                id="tooth_faces2"
                className="me-4"
                checked={values.tooth_faces.includes('Lingual/Palatina')}
                onChange={(e) => handleToggleToothFaces('Lingual/Palatina', e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Vestibular"
                id="tooth_faces3"
                className="me-4"
                checked={values.tooth_faces.includes('Vestibular')}
                onChange={(e) => handleToggleToothFaces('Vestibular', e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Mesial"
                id="tooth_faces4"
                className="me-4"
                checked={values.tooth_faces.includes('Mesial')}
                onChange={(e) => handleToggleToothFaces('Mesial', e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Distal"
                id="tooth_faces5"
                className="me-4"
                checked={values.tooth_faces.includes('Distal')}
                onChange={(e) => handleToggleToothFaces('Distal', e.target.checked)}
              />
            </Col>
          </Row>
          <Row>
            <Form.Label className="d-block">
              <strong>Estado</strong>
            </Form.Label>
            <Col xs="12" className="mb-3 d-flex">
              <Form.Check
                type="radio"
                label="Pendente"
                id="procedure_status1"
                name="procedure_statusRadio"
                checked={values.procedure_status == 'pending'}
                onChange={(e) => setFieldValue('procedure_status', 'pending')}
              />
              <Form.Check
                type="radio"
                label="Realizado"
                id="procedure_status2"
                name="procedure_statusRadio"
                className="ms-3"
                checked={values.procedure_status == 'realized'}
                onChange={(e) => setFieldValue('procedure_status', 'realized')}
              />
              <Form.Check
                type="radio"
                label="Pré-existente"
                id="procedure_status3"
                name="procedure_statusRadio"
                className="ms-3"
                checked={values.procedure_status == 'pre-existing'}
                onChange={(e) => setFieldValue('procedure_status', 'pre-existing')}
              />
              {errors.procedure_status && touched.procedure_status && <div className="error">{errors.procedure_status}</div>}
            </Col>
          </Row>
          <Row>
            <Form.Label className="d-block">
              <strong>Observações</strong>
            </Form.Label>
            <Col xs="12" className="mb-3 d-flex">
              <Form.Control as="textarea" rows={1} name="procedure_observations" value={values.procedure_observations} onChange={handleChange} />
              {errors.procedure_observations && touched.procedure_observations && <div className="error">{errors.procedure_observations}</div>}
            </Col>
          </Row>
          <div className="text-center">
            <AsyncButton type="submit" isSaving={isSaving}>
              Salvar procedimento
            </AsyncButton>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalNewProcedure;
