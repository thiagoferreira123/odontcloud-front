import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AsyncButton from '/src/components/AsyncButton';
import { useShoppingListModalStore } from '../hooks/modals/ShoppingListModalStore';
import { useQualitativeEatingPlanStore } from '../hooks/QualitativeEatingPlanStore';
import NotificationIcon, { notify } from '../../../components/toast/NotificationIcon';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useParams } from 'react-router-dom';
import { downloadPDF } from '../../../helpers/PdfHelpers';
import api from '../../../services/useAxios';
import { toast } from 'react-toastify';

interface FormValues {
  content: string;
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

const ShoppingListModal: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);

  const { id } = useParams();

  const showModal = useShoppingListModalStore((state) => state.showModal);
  const shoppingList = useQualitativeEatingPlanStore((state) => state.shoppingList);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const toastId = useRef<React.ReactText>();

  const initialValues = { content: '' };

  const validationSchema = Yup.object().shape({
    content: Yup.string().required('Insira um conteúdo'),
  });
  const { addShoppingList, updateShoppingList, removeQualitativeEatingPlanShoppingList } = useQualitativeEatingPlanStore();
  const { closeModal } = useShoppingListModalStore();

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);

    try {
      if (!id) throw new Error('id is required');

      shoppingList ? updateShoppingList({ ...shoppingList, ...values }) : addShoppingList({ ...values, id_plano_qualitativo: +id });
      closeModal();

      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleRemoveOrientation = async () => {
    shoppingList && (await removeQualitativeEatingPlanShoppingList(shoppingList));
    formik.resetForm();
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    await handleSubmit();

    toastId.current = notify('Gerando pdf da lista de compras, por favor aguarde...', 'Sucesso', 'check', 'success', true);

    try {
      const { data } = await api.post(
        '/plano-alimentar-qualitativo-pdf/' + id + '/lista-de-compras',
        {},
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
        }
      );
      downloadPDF(data, 'lista-de-compras-' + id);

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

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setValues, values, touched, errors } = formik;

  useEffect(() => {
    setValues({
      content: shoppingList?.content ?? '',
    });
  }, [setValues, shoppingList?.content]);

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" className="modal-close-out" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Lista de compras</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3 position-relative">
          <Form.Control as="textarea" rows={8} name="content" placeholder="Digite a lista de compras" onChange={handleChange} value={values.content} />
          {errors.content && touched.content && <LabelEndTooltip>{errors.content}</LabelEndTooltip>}

          {values.content.length ? (
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
        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-print-shopping">Realize o download da lista de compras no seu computador.</Tooltip>}>
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
          Salvar lista de compras
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
};

export default ShoppingListModal;
