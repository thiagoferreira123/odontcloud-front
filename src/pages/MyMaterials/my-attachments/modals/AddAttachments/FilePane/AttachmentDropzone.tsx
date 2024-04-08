import React from 'react';
import { FormikErrors, FormikTouched } from 'formik';
import Dropzone, { IFileWithMeta, IUploadParams, StatusValue, defaultClassNames } from 'react-dropzone-uploader';
import api, { apiUrl } from '../../../../../../services/useAxios';
import CsLineIcons from '../../../../../../cs-line-icons/CsLineIcons';
import DropzonePreview from '../../../../../../components/dropzone/DropzonePreview';
import 'react-dropzone-uploader/dist/styles.css';
import { FileFormValues } from '.';

type AttachmentDropzoneProps = {
  formik: {
    handleChange: {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
      (e: React.ChangeEvent<any>): void;
      // eslint-disable-next-line no-unused-vars
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    // eslint-disable-next-line no-unused-vars
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: FileFormValues;
    errors: FormikErrors<FileFormValues>;
    touched: FormikTouched<FileFormValues>;
  };
};

export default function AttachmentDropzone(props: AttachmentDropzoneProps) {
  const { setFieldValue, touched, errors, values } = props.formik;

  const getUploadParams = (): IUploadParams | Promise<IUploadParams> => ({
    url: apiUrl + '/material-cadastrado-pelo-profissional/upload',
  });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      setFieldValue('s3_link', file.xhr.response);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      api.delete('/material-cadastrado-pelo-profissional/upload', { data: { url: file.xhr.response } });
      setFieldValue('s3_link', '');
    }
  };

  return (
      <div className="filled mb-3 ">
        <CsLineIcons icon="upload" />
        <Dropzone
          getUploadParams={getUploadParams}
          PreviewComponent={DropzonePreview}
          submitButtonContent={null}
          accept="image/*, application/*"
          submitButtonDisabled
          inputWithFilesContent={null}
          onChangeStatus={onChangeStatus}
          classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
          inputContent="Insira um arquivo"
          disabled={!values.name.length}
        />
        {errors.s3_link && touched.s3_link && <div className="error">{errors.s3_link}</div>}
      </div>
  );
}
