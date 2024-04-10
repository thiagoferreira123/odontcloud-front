import Dropzone, { IFileWithMeta, StatusValue, defaultClassNames } from 'react-dropzone-uploader';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useParams } from 'react-router-dom';
import 'react-dropzone-uploader/dist/styles.css';
import usePatientFolderStore from './hooks/PatientFolderStore';
import { useQueryClient } from '@tanstack/react-query';
import { apiUrl } from '../../../services/useAxios';
import DropzonePreview from '../../../components/dropzone/DropzonePreview';

export default function PatientFolderDropzone() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const uploadedFiles = usePatientFolderStore((state) => state.uploadedFiles);

  const { addUploadedFile, removeUploadedFile, increaseLoadingCount, decreaseLoadingCount, removePatientFile } = usePatientFolderStore();

  const getUploadParams = () => ({ url: apiUrl + `/patient-documents/${id}/upload` });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response || !file.xhr.response) return console.error('Erro ao enviar arquivo');
      const response = file.xhr.response && JSON.parse(file.xhr.response);
      if (!file.xhr.response[0]) return console.error('Erro ao enviar arquivo');

      addUploadedFile({ file: response[0], remove: file.remove });
      decreaseLoadingCount();
    } else if (status === 'removed') {
      if (!file?.xhr?.response || !file.xhr.response) return console.error('Erro ao remover arquivo');
      const response = file.xhr.response && JSON.parse(file.xhr.response);
      if (!file.xhr.response[0]) return console.error('Erro ao remover arquivo');

      uploadedFiles.find((file) => file.file.documents_id === response[0].documents_id) && removePatientFile(response[0], queryClient);
      removeUploadedFile(response[0]);
    } else if (status === 'preparing') {
      increaseLoadingCount();
    }
  };

  return (
    <div className="filled mb-3 ">
      <CsLineIcons icon="upload" />
      <Dropzone
        getUploadParams={getUploadParams}
        PreviewComponent={DropzonePreview}
        submitButtonContent={null}
        accept="image/*, application/pdf"
        submitButtonDisabled
        inputWithFilesContent={null}
        onChangeStatus={onChangeStatus}
        classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
        inputContent="Insira um arquivo"
      />
    </div>
  );
}
