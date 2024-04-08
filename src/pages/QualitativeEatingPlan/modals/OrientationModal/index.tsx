import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SelectObservation from './SelectObservation';
import { useOrientationModalStore } from '../../hooks/modals/OrientationModalStore';
import { useQualitativeEatingPlanStore } from '../../hooks/QualitativeEatingPlanStore';
import NotificationIcon, { notify } from '../../../../components/toast/NotificationIcon';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { useParams } from 'react-router-dom';
import { downloadPDF } from '../../../../helpers/PdfHelpers';
import { toast } from 'react-toastify';
import api from '../../../../services/useAxios';
import AsyncButton from '../../../../components/AsyncButton';
import { convertPlainTextToHTML } from '../../../../helpers/StringHelpers';
import { htmlToPlainText } from '../../../../helpers/InputHelpers';

interface FormValues {
  orientation: string;
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

const OrientationModal: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const { id } = useParams();

  const showModal = useOrientationModalStore((state) => state.showModal);
  const orientation = useQualitativeEatingPlanStore((state) => state.orientation);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const initialValues = { orientation: '' };

  const toastId = useRef<React.ReactText>();

  const validationSchema = Yup.object().shape({
    orientation: Yup.string().required('Insira uma orientação'),
  });
  const { updateOrientation } = useQualitativeEatingPlanStore();
  const { closeModal } = useOrientationModalStore();

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);

    try {
      if (!id) throw new Error('id is required');

      const stateResult = await updateOrientation((values.orientation));
      if (!stateResult) throw new Error('Orientation update failed');

      await api.patch(`/plano-alimentar-qualitativo-historico/${id}`, { orientation: convertPlainTextToHTML(values.orientation) ?? '' });

      closeModal();
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
    setFieldValue('orientation', observation);
  };

  const handleRemoveOrientation = async () => {
    try {
      updateOrientation('');
      await api.patch(`/plano-alimentar-qualitativo-historico/${id}`, initialValues);

      notify('Orientação removida com sucesso', 'Sucesso', 'check', 'success');
      formik.resetForm();
    } catch (error) {
      console.error(error);
      notify('Erro ao remover orientação', 'Erro', 'close', 'danger');
      setIsSaving(false);
    }

    if (!id) throw new Error('id is required');
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    await handleSubmit();

    toastId.current = notify('Gerando pdf da orientação, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.post(
        '/plano-alimentar-qualitativo-pdf/' + id + '/orientacao',
        {},
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );
      downloadPDF(data, 'orientacao-' + id);

      toast.update(toastId.current, {
        render: <NotificationIcon message={'Pdf gerado com sucesso!'} title={'Sucesso'} icon={'check'} status={'success'} />,
        autoClose: 5000,
      });

      setIsGeneratingPdf(false);
    } catch (error) {
      setIsGeneratingPdf(false);
      toast.update(toastId.current, {
        render: <NotificationIcon message={'Erro ao gerar pdf!'} title={'Erro'} icon={'close'} status={'danger'} />,
        autoClose: 5000,
      });
      console.error(error);
    }
  };

  useEffect(() => {
    if (orientation) {
      setFieldValue('orientation', htmlToPlainText(orientation));
    }
  }, [orientation, setFieldValue]);

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Insira uma orientação no plano alimentar</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <SelectObservation show={showModal} onGetObservation={onGetObservation} />
        </div>

        <div className="mb-3 position-relative">
          <Form.Control as="textarea" rows={8} name="orientation" onChange={handleChange} value={values.orientation} />
          {errors.orientation && touched.orientation && <LabelEndTooltip>{errors.orientation}</LabelEndTooltip>}

          {values.orientation.length ? (
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
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-print-shopping">Realize o download da orientação no seu computador.</Tooltip>}>
          <span>
            <AsyncButton
              loadingText=" "
              isSaving={isGeneratingPdf}
              onClickHandler={handleDownloadPdf}
              type="button"
              className="btn-icon btn-icon-only mb-1 ms-1"
            >
              <CsLineIcons icon="print" />
            </AsyncButton>
          </span>
        </OverlayTrigger>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
          Salvar observação
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default OrientationModal;
