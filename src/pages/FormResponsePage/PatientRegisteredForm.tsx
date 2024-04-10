import { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import $ from 'jquery';
import '../../settings/bootstrap';
import Dropzone, { defaultClassNames, IFileWithMeta, StatusValue } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import useFormStore from './hook';
import { useQueryClient } from '@tanstack/react-query';
import usePatientFolderStore from '../PatientMenu/patient-folder/hooks/PatientFolderStore';
import { Form } from '../../types/FormBuilder';
import { notify } from '../../components/toast/NotificationIcon';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import DropzonePreview from '../../components/dropzone/DropzonePreview';

declare global {
  interface JQuery {
    // eslint-disable-next-line no-unused-vars
    formBuilder(options?: unknown): unknown;
  }
}

import 'jquery-ui-sortable';
import 'formBuilder';
import 'formBuilder/dist/form-render.min';
import { apiUrl } from '../../services/useAxios';
import useFormPatientNotRegisteredFilesStore from './hook/FormPatientNotRegisteredFiles';
import { useNotSignedAnswerStoreStore } from '../FormLoose/Hooks/NotSignedAnswerStore';

let formRender: {
  clear(): unknown;
  userData: string[];
};

type Props = {
  form: Form;
};

const PatientRegisteredForm = ({ form }: Props) => {
  const queryClient = useQueryClient();
  const uploaderRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const answer_id = new URLSearchParams(window.location.search).get('answer_id');

  const fb = useRef<HTMLDivElement | null>(null);

  const { addReplyForm } = useFormStore();
  const { updateFormAnswer } = useNotSignedAnswerStoreStore();
  const { removePatientFile } = usePatientFolderStore();
  const { removeFormFile } = useFormPatientNotRegisteredFilesStore();

  const handleSendForm = async () => {
    setIsSaving(true);
    const formData = formRender.userData;

    const payload = {
      data: new Date().toISOString(),
      tipo: 'PROFISSIONAL',
      respostas: JSON.stringify(formData),
      id_formulario: form.id,
    };

    answer_id ? await updateFormAnswer(+answer_id, payload) : await addReplyForm(payload, queryClient);

    setIsSaving(false);
    answer_id ? window.location.replace('https://www.OdontCloud.com.br') : window.location.replace('/painel-paciente');
  };

  const handleChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    const response = file?.xhr?.response && JSON.parse(file.xhr.response);

    switch (status) {
      case 'error_validation':
        file.remove();
        break;
      case 'rejected_file_type':
        notify('Tipo de arquivo inválido.', 'Erro', 'close', 'danger');
        break;
      case 'error_file_size':
        notify('Tamanho de arquivo excede o limite permitido.', 'Erro', 'close', 'danger');
        file.remove();
        break;
      case 'rejected_max_files':
        notify('Não é possível enviar mais de 5 arquivos!', 'Erro', 'close', 'danger');
        file.remove?.();
        break;
      case 'removed':
        if (!file?.xhr?.response || !file.xhr.response) return console.error('Erro ao remover arquivo');
        if (!file.xhr.response[0]) return console.error('Erro ao remover arquivo');

        response && (answer_id ? removeFormFile(response[0]) : removePatientFile(response[0], queryClient));

        break;
      case 'error_upload':
        notify('Erro ao enviar arquivo', 'Erro', 'close', 'danger');
        file.remove?.();
        break;
      default:
        break;
    }
  };

  const getUploadParams = () => ({ url: apiUrl + (answer_id ? `/fpc-anexo-paciente-nao-cadastrado/${answer_id}/upload` : `/pasta-do-paciente/${form.paciente_id}/upload`) });

  useEffect(() => {
    if (!fb) return;
    formRender = $(fb.current).formRender({ dataType: 'xml', formData: JSON.parse(form.form) });
  }, [form, fb]);

  return (
    <Row className="h-100 d-flex justify-content-center align-items-center">
      <h3 className="text-center">{form.nome}</h3>
      <Col md={8}>
        <Card body>
          <div id="fb-editor" ref={fb} />
          <div className="dropzone">
            <p className="mb-0">Enviar arquivos importantes - Máximo 5 (10MB) (Opcional)</p>
            <p className="text-medium text-muted text-truncate mb-0">
              Use essa área para enviar arquivos importantes, como resultado de exames, foto de remédios ou suplementos, e etc.
            </p>
            <div className="filled">
              <CsLineIcons icon="upload" />

              <Dropzone
                ref={uploaderRef}
                submitButtonContent={null}
                onChangeStatus={handleChangeStatus}
                PreviewComponent={DropzonePreview}
                getUploadParams={getUploadParams}
                submitButtonDisabled
                maxFiles={5}
                accept="image/*, application/pdf"
                maxSizeBytes={16 * 1024 * 1024} // 16 MB
                inputWithFilesContent={null}
                classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
                inputContent="Clique aqui para selecionar os arquivos"
              />
            </div>
          </div>
        </Card>
        <div className="text-center mt-3">
          <Button onClick={handleSendForm} disabled={false} variant="primary" size="lg" className="hover-scale-down">
            {isSaving ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              <div className="d-flex align-items-center justify-content-center gap-2">
                <CsLineIcons icon="save" />
                <span>Enviar formulário</span>
              </div>
            )}
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default PatientRegisteredForm;
