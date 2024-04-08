import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Row } from 'react-bootstrap';
import $ from 'jquery';
import '../../settings/bootstrap';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useFormStore } from './hooks/FormStore';
import { useAnswerStore } from './hooks/AnswerStore';
import { useSendFormToEmailModalStore } from '../FormLoose/Hooks/modals/SendFormToEmailModalStore';
import { useSendFormToWhatsAppModalStore } from '../FormLoose/Hooks/modals/SendFormToWhatsAppModalStore';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';
import useConfirm from '../../hooks/useConfirm';
import HtmlHead from '../../components/html-head/HtmlHead';
import LoadingButton from '../../components/LoadingButton';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import SendFormToWhatsAppModal from '../FormLoose/Modals/SendFormToWhatsAppModal';

interface FormBuilder {
  getData: () => unknown;
  // eslint-disable-next-line no-unused-vars
  setData: (data: string) => unknown;
}

declare global {
  interface JQuery {
    // eslint-disable-next-line no-unused-vars
    formBuilder(options?: unknown): unknown;
  }
}

import 'jquery-ui-sortable';
import 'formBuilder';
import PatientMenuRow from '../../components/PatientMenuRow';

type Params = {
  id: string;
  patientId: string;
};

type Modals = 'delete' | 'email' | 'whatsapp' | '';

const FormPatientRegistered = () => {
  const queryClient = useQueryClient();
  const fb = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const { patient, getPatient } = usePatientMenuStore((state) => state);

  const isEditing = searchParams.get('editing');

  const navigate = useNavigate();
  const { id, patientId } = useParams<Params>();

  const [formBuilder, setFormBuilder] = useState<FormBuilder | null>(null);
  const options = useMemo(() => {
    return {
      disableInjectedStyle: 'bootstrap',
      disabledActionButtons: ['data', 'clear', 'save'],
      disabledAttrs: ['className'],
      disableFields: ['autocomplete', 'button', 'file', 'hidden', 'checkbox-group'],
      i18n: {
        location: 'https://raw.githubusercontent.com/kevinchappell/formBuilder-languages/master/',
        locale: 'pt-BR',
      },
    };
  }, []);

  const { confirm, handleClose, ConfirmModalComponent } = useConfirm();
  const { getForm, createForm, editForm } = useFormStore();
  const { handleSendFormToEmail } = useSendFormToEmailModalStore();
  const { handleSendFormToWhatsApp } = useSendFormToWhatsAppModalStore();
  const { deleteAnswer } = useAnswerStore();
  const { setPatientId } = usePatientMenuStore();

  const handleButtonClick = (sentMode?: Modals) => {
    if (isEditing) {
      return confirm({
        title: 'Deseja mesmo editar o formulário?',
        description: 'Todas as respostas serão perdidas',
        onCancel: function (): void {
          handleClose();
        },
        onOk: function (): void {
          handleSubmit(sentMode);
          handleClose();
        },
      });
    }

    handleSubmit(sentMode);
  };

  const handleSubmit = async (sentMode?: Modals) => {
    if (!formBuilder || !patient) return;

    try {
      if (!patientId) throw new Error('patientId is required');

      setIsLoading(true);

      const formData = formBuilder.getData();
      const payload = {
        data: new Date().toISOString(),
        form: JSON.stringify(formData),
        status: 'ABERTO',
        tipo: 'PACIENTE',
        paciente_id: +patientId,
      };

      if (isEditing) {
        if (!id) throw new Error('id is required');

        const response = await editForm(
          {
            ...payload,
            id: +id,
          },
          queryClient
        );

        if (response === false) throw new Error('Falha ao editar formulário');

        if (response?.resposta) {
          await deleteAnswer(response?.resposta, queryClient);
        }

        setTimeout(() => {
          if (sentMode === 'email' && response.key) handleSendFormToEmail(response.key);
          else if (sentMode === 'whatsapp' && response.key) handleSendFormToWhatsApp(response.key);
          else return navigate(-1);
        }, 0);
      } else {
        const response = await createForm(payload, queryClient);

        if (response === false) throw new Error('Falha ao criar formulário');

        setTimeout(() => {
          if (sentMode === 'email' && response.key) handleSendFormToEmail(response.key);
          else if (sentMode === 'whatsapp' && response.key) handleSendFormToWhatsApp(response.key);
          else return navigate(-1);
        }, 0);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getForm_ = async () => {
    try {
      if (!id) throw new Error('id is required');

      const response = await getForm(id);

      if (response === false) throw new Error('Falha ao buscar formulário');
      patientId && setPatientId(+patientId);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const title = 'Construtor de formulário';

  const result = useQuery({
    queryKey: ['form', id],
    queryFn: getForm_,
    enabled: !!id,
  });

  useEffect(() => {
    if (!patient) {
      getPatient(Number(patientId));
    }
  }, [getPatient, patient, patientId]);

  useEffect(() => {
    if (!fb) return;
    setFormBuilder($(fb.current).formBuilder(options));
  }, [fb, options]);

  useEffect(() => {
    if (!result.data || !formBuilder?.setData) return;

    formBuilder.setData(result.data.form);
  }, [result.data, formBuilder]);

  return (
    <>
      {patientId ? <PatientMenuRow /> : null}

      <HtmlHead title={title} />
      {ConfirmModalComponent}
      {/* Title Start */}
      <div className="page-title-container">
        <h1 className="mb-0 pb-0 display-4">{title}</h1>
      </div>
      {/* Title End */}
      <Card className="mb-2">
        <Card.Body>
          <Row className="d-flex justify-content-start">
            <div
              style={{ zIndex: 1000 }}
              className={classNames('mt-5 mb-5', {
                'overlay-spinner': result.isLoading,
              })}
            >
              <div
                id="fb-editor"
                className={classNames({
                  'd-none': result.isLoading,
                })}
                ref={fb}
              />
            </div>
          </Row>
        </Card.Body>
      </Card>

      <div className="text-center">
        <LoadingButton isLoading={isLoading} onClick={() => handleButtonClick()} variant="primary" size="lg" className="hover-scale-down" type="submit">
          <CsLineIcons icon="save" /> <span>Salvar formulário</span>
        </LoadingButton>{' '}
        <Button disabled={isLoading} onClick={() => handleButtonClick('whatsapp')} variant="primary" size="lg" className="hover-scale-down" type="submit">
          <CsLineIcons icon="send" /> <span>Enviar por WhatsApp</span>
        </Button>{' '}
      </div>

      <SendFormToWhatsAppModal />
    </>
  );
};

export default FormPatientRegistered;
