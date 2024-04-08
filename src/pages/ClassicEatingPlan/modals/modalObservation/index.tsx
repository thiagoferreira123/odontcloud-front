import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useClassicPlan from '../../hooks/useClassicPlan';
import { toast } from 'react-toastify';
import SelectObservation from './SelectObservation';
import { ClassicPlanOrientation } from '../../../../types/PlanoAlimentarClassico';
import api from '../../../../services/useAxios';
import NotificationIcon, { notify } from '../../../../components/toast/NotificationIcon';
import { downloadPDF } from '../../../../helpers/PdfHelpers';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../../components/AsyncButton';
import { htmlToPlainText } from '../../../../helpers/InputHelpers';

interface ModalOrientationProps {
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

const ModalOrientation: React.FC<ModalOrientationProps> = (props: ModalOrientationProps) => {
  const planId = useClassicPlan((state) => state.planId);
  const orientations = useClassicPlan((state) => state.orientations);

  const { updatePlan } = useClassicPlan();

  const toastId = useRef<React.ReactText>();

  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const initialValues = { textObservation: '' };

  const validationSchema = Yup.object().shape({
    textObservation: Yup.string().required('Insira uma observação válida'),
  });

  const onSubmit = async (values: FormValues) => {
    if (!planId) return;

    setIsSaving(true);

    try {
      const payload: ClassicPlanOrientation = {
        orientacao: values.textObservation,
        orientacao_text: values.textObservation,
        id_plano: planId,
        id: orientations[0] ? orientations[0].id : undefined,
      };

      if (!orientations[0]) {
        const response = await api.post('/plano-alimentar-classico-orientacao/', payload);
        updatePlan({ orientations: [response.data] });
      } else {
        await api.patch('/plano-alimentar-classico-orientacao/' + orientations[0].id, payload);
        updatePlan({ orientations: [payload] });
      }

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

  const onGetObservation = (textObservation: string) => {
    setFieldValue('textObservation', textObservation);
  };

  const handleRemoveOrientation = async () => {
    if (orientations[0] && orientations[0].id) await api.delete('/plano-alimentar-classico-orientacao/' + orientations[0].id);

    notify('Orientação removida com sucesso', 'Sucesso', 'check', 'success');
    updatePlan({ orientations: [] });
    formik.resetForm();
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    await handleSubmit();

    toastId.current = notify('Gerando pdf da orientação, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.get(
        '/plano-alimentar-classico-pdf/' + planId + '/orientacao',
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );
      downloadPDF(data, 'orientacao-' + planId);

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
    if (orientations) {
      setFieldValue('textObservation', orientations[0] ? orientations[0].orientacao : '');
    }
  }, [orientations, setFieldValue]);

  return (
    <Modal show={props.show} onHide={props.onClose} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Insira uma orientação</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <SelectObservation show={props.show} onGetObservation={onGetObservation} />
          </div>

          <div className="mb-3 position-relative">
            <Form.Control as="textarea" rows={8} name="textObservation" onChange={handleChange} value={htmlToPlainText(values.textObservation)} />
            {errors.textObservation && touched.textObservation && <LabelEndTooltip>{errors.textObservation}</LabelEndTooltip>}

            {orientations[0] || values.textObservation.length ? (
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
          <AsyncButton isSaving={isSaving} type="submit" className="mb-1 btn btn-primary">
            Salvar observação
          </AsyncButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalOrientation;
