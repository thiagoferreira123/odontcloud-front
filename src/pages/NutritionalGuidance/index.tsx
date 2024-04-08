import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import * as Yup from 'yup';

import { useNutritionalGuidanceModalStore } from './hooks';
import NutritionalGuidanceSelect from './NutritionalGuidanceSelect';
import { notify, updateNotify } from '../../components/toast/NotificationIcon';
import { FormikHelpers, useFormik } from 'formik';
import AsyncButton from '../../components/AsyncButton';
import { useNutricionalGuidanceStore } from './hooks/NutricionalGuidanceStore';
import useNutritionalGuidanceStore from '../PatientMenu/nutritional-guidance/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { downloadPDF } from '../../helpers/PdfHelpers';
import api from '../../services/useAxios';
import SendPdfModal from './modals/ModalSendPDF';
import { useSendPdfModalStore } from './hooks/SendPdfModalStore';
import { NutritionalGuidanceSelectedPatient } from '../PatientMenu/nutritional-guidance/hooks/types';

interface FormValues {
  orientacao: string;
}

const NutritionalGuidanceModal = () => {
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const toastId = useRef<React.ReactText>();

  const showModal = useNutritionalGuidanceModalStore((state) => state.showModal);
  const selectedNutritionalGuidanceSelectedPatient = useNutritionalGuidanceModalStore((state) => state.selectedNutritionalGuidanceSelectedPatient);

  const initialValues: FormValues = { orientacao: '' };

  const validationSchema = Yup.object().shape({
    orientacao: Yup.string().required('Insira ums orientação válido'),
  });

  const { hideModal, handleUpdateNutritionalGuidanceSelectedPatient } = useNutritionalGuidanceModalStore();
  const { addNutritionalGuidance, updateNutritionalGuidance } = useNutricionalGuidanceStore();
  const { updateNutritionalGuidanceSelectedPatient } = useNutritionalGuidanceStore();
  const { showSendPdfModalStore } = useSendPdfModalStore();

  const onSubmit = async (values: FormValues, formikHelpers?: FormikHelpers<FormValues>) => {
    setIsSaving(true);

    try {
      if (!selectedNutritionalGuidanceSelectedPatient) return false;

      const nome = selectedNutritionalGuidanceSelectedPatient.identification;

      const response = selectedNutritionalGuidanceSelectedPatient.nutritionalGuidance?.id
        ? await updateNutritionalGuidance({ ...selectedNutritionalGuidanceSelectedPatient.nutritionalGuidance, ...values, nome })
        : await addNutritionalGuidance({ ...values, nome });

      if (response === false) return false;

      handleUpdateNutritionalGuidanceSelectedPatient({
        ...selectedNutritionalGuidanceSelectedPatient,
        orientation_id: response.id,
        nutritionalGuidance: response,
      });

      await updateNutritionalGuidanceSelectedPatient(
        { ...selectedNutritionalGuidanceSelectedPatient, orientation_id: response.id, nutritionalGuidance: response },
        queryClient
      );

      formikHelpers && hideModal();
      setIsSaving(false);
      return { ...selectedNutritionalGuidanceSelectedPatient, orientation_id: response.id, nutritionalGuidance: response };
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      notify('Erro ao salvar orientação', 'Erro', 'close', 'danger');
      return false;
    }
  };

  const handleDownloadPDF = async (nutritionalGuidanceData: NutritionalGuidanceSelectedPatient) => {
    if (!nutritionalGuidanceData?.nutritionalGuidance?.id) return;

    toastId.current = notify('Gerando pdf, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.post(
        '/orientacao-nutricional-pdf/' + nutritionalGuidanceData.nutritionalGuidance.id,
        {},
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );

      downloadPDF(data, 'orientacao-nutricional-' + nutritionalGuidanceData.id);

      updateNotify(toastId.current, 'Pdf gerado com sucesso!', 'Sucesso', 'check', 'success');
    } catch (error) {
      updateNotify(toastId.current, 'Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const handleClickDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const submitResponse = await onSubmit(values);

      submitResponse && (await handleDownloadPDF(submitResponse));
      setIsDownloading(false);
    } catch (error) {
      console.error(error);
      notify('Erro ao gerar pdf!', 'Erro', 'close', 'danger');
      setIsDownloading(false);
    }
  };

  const handleShowSendPdfModal = async () => {
    setIsDownloading(true);
    await onSubmit(values);

    showSendPdfModalStore();
    setIsDownloading(false);
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, resetForm, setValues, setFieldValue, values, touched, errors } = formik;

  useEffect(() => {
    if (!selectedNutritionalGuidanceSelectedPatient) return resetForm();

    setValues({
      orientacao: selectedNutritionalGuidanceSelectedPatient.nutritionalGuidance?.orientacao ?? '',
    });
  }, [resetForm, selectedNutritionalGuidanceSelectedPatient, setValues]);

  return (
    <Modal className="modal-close-out" size="xl" backdrop="static" show={showModal} onHide={hideModal}>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Orientações para o paciente</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row className="mb-3 d-flex">
            <div>
              <NutritionalGuidanceSelect setFieldValue={setFieldValue} />
            </div>
          </Row>

          <div>
            <div className="d-flex text-end">
              <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Download PDF</Tooltip>}>
                <span>
                  <AsyncButton
                    isSaving={isDownloading}
                    loadingText=" "
                    variant="outline-primary"
                    size="sm"
                    className="btn-icon btn-icon-only mb-1 me-1"
                    onClickHandler={handleClickDownloadPDF}
                  >
                    <CsLineIcons icon="print" />
                  </AsyncButton>
                </span>
              </OverlayTrigger>{' '}
              <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Enviar para o e-mail do paciente</Tooltip>}>
                <span>
                  <AsyncButton
                    isSaving={isDownloading}
                    loadingText=" "
                    variant="outline-primary"
                    size="sm"
                    className="btn-icon btn-icon-only mb-1 me-1"
                    onClickHandler={handleShowSendPdfModal}
                  >
                    <CsLineIcons icon="send" />
                  </AsyncButton>
                </span>
              </OverlayTrigger>{' '}
            </div>

            <Editor
              apiKey="bef3ulc00yrfvjjiawm3xjxj41r1k2kl33t9zlo8ek3s1rpg"
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar:
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                table: {
                  title: 'Table',
                  items: 'inserttable | cell row column | advtablesort | tableprops deletetable',
                },
                language: 'pt_BR',
              }}
              value={values.orientacao}
              onEditorChange={(orientacao) => formik.setFieldValue('orientacao', orientacao)}
            />
            {errors.orientacao && touched.orientacao && <div className="error">{errors.orientacao}</div>}
          </div>

          <div className="text-center mt-2">
            <AsyncButton isSaving={isSaving} variant="primary" size="lg" className="hover-scale-down mt-3" type="submit">
              <CsLineIcons icon="save" /> <span>Salvar orientação</span>
            </AsyncButton>{' '}
          </div>
        </Modal.Body>
      </form>

      <SendPdfModal />
    </Modal>
  );
};

export default NutritionalGuidanceModal;
