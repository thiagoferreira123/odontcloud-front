import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import 'react-dropzone-uploader/dist/styles.css';
import { useParams } from 'react-router-dom';
import Dropzone, { IFileWithMeta, StatusValue } from 'react-dropzone-uploader';
import { useRequestingExamsStore } from '../hooks/RequestingExamsStore';
import { RequestingExamAttachment } from '../../../../types/RequestingExam';
import { notify } from '../../../../components/toast/NotificationIcon';
import api, { apiUrl } from '../../../../services/useAxios';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import AsyncButton from '../../../../components/AsyncButton';
import DropzonePreview from '../../../../components/dropzone/DropzonePreview';

interface ModalUploadExamPDFProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Values {
  fileName: string;
  linkAwsS3: string;
}

const ModalUploadExamPDF = ({ showModal, setShowModal }: ModalUploadExamPDFProps) => {
  const validationSchema = Yup.object().shape({
    fileName: Yup.string().required('Insira um nome válido'),
  });

  const { id } = useParams();

  const initialValues: Values = { fileName: '', linkAwsS3: ''};
  const [isSaving, setIsSaving] = useState(false);
  const [deleteApiEnabled, setDeleteApiEnabled] = useState(true);
  const [removeFile, setRemoveFile] = React.useState<(() => void) | null>(null);

  const onSubmit = async (values: Values) => {
    try {

      setIsSaving(true);
      setDeleteApiEnabled(false);

      if(!id) throw new Error('Id do paciente não encontrado');

      const payload: RequestingExamAttachment = {
        fileName: values.fileName,
        dataCreation: new Date(),
        linkAwsS3: values.linkAwsS3,
        patientID: +id
      };

      const response = await addExam(payload);

      notify('Exame adicionado com sucesso', 'Sucesso', 'close', 'success');
      setIsSaving(false);
      setShowModal(false);
      resetForm();
      removeFile && removeFile();
      if(response === false) throw new Error('Erro ao adicionar exame');
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      notify('Erro ao adicionar exame', 'Erro', 'close', 'danger');
    }

  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, resetForm, values, touched, errors } = formik;
  const { addExam } = useRequestingExamsStore();

  const getUploadParams = () => ({ url: apiUrl + `/exame-de-sangue-anexo/${id}/upload` });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');

      const response = JSON.parse(file.xhr.response);

      setFieldValue('fileName', response.fileName);
      setFieldValue('linkAwsS3', response.linkAwsS3);
      setRemoveFile(() => file.remove);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');

      const response = JSON.parse(file.xhr.response);

      deleteApiEnabled && api.delete('/exame-de-sangue-anexo/file', { data: { url: response.linkAwsS3 } });
      setFieldValue('file', '');
      setDeleteApiEnabled(true);
    }
  };

  return (
    <Modal className="modal-close-out" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Anexar PDF de exames anteriores</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          <div className="mb-3 filled">
            <CsLineIcons icon="vaccine" />
            <Form.Control type="text" name="fileName" value={values.fileName} onChange={handleChange} placeholder="Identificação do arquivo" />
            {errors.fileName && touched.fileName && <div className="error">{errors.fileName}</div>}
          </div>
          <div className="mb-3 filled">
            <CsLineIcons icon="upload" />
            <Dropzone
              getUploadParams={getUploadParams}
              PreviewComponent={DropzonePreview}
              submitButtonContent={null}
              accept="application/pdf"
              submitButtonDisabled
              inputWithFilesContent={null}
              onChangeStatus={onChangeStatus}
              inputContent="Insira uma imagem"
              maxFiles={1}
            />
          </div>
          <div className="text-center">
            <AsyncButton isSaving={isSaving} variant="primary" size="lg" className="mt-2 hover-scale-down" type="submit">
              Salvar arquivo
            </AsyncButton>{' '}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUploadExamPDF;
