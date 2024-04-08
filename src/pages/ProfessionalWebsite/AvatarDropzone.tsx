import React from 'react';
import Dropzone, { IFileWithMeta, IUploadParams, StatusValue, defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import api, { apiUrl } from '../../services/useAxios';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import DropzonePreview from '../../components/dropzone/DropzonePreview';

type AvatarDropzoneProps = {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };

    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
  };
};

export default function AvatarDropzone({ formik }: AvatarDropzoneProps) {
  const { setFieldValue } = formik;

  const getUploadParams = (): IUploadParams | Promise<IUploadParams> => ({
    url: apiUrl + '/material-cadastrado-pelo-profissional/upload',
  });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      setFieldValue('professionalPhotoLink', file.xhr.response);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      api.delete('/material-cadastrado-pelo-profissional/upload', { data: { url: file.xhr.response } });
      setFieldValue('professionalPhotoLink', '');
    }
  };

  return (
    <div className="filled mb-3 ">
      <CsLineIcons icon="upload" />
      <Dropzone
        getUploadParams={getUploadParams}
        PreviewComponent={DropzonePreview}
        submitButtonContent={null}
        accept="image/*"
        submitButtonDisabled
        inputWithFilesContent={null}
        onChangeStatus={onChangeStatus}
        classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
        inputContent="Insira uma imagem"
      />
    </div>
  );
}
