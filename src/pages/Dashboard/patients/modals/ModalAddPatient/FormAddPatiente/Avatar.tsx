import React from 'react';
import CsLineIcons from '../../../../../../cs-line-icons/CsLineIcons';
import { FormikErrors, FormikTouched } from 'formik';
import { FormikValues } from '.';
import Dropzone, { IFileWithMeta, StatusValue, defaultClassNames } from 'react-dropzone-uploader';
import api, { apiUrl } from '../../../../../../services/useAxios';
import DropzonePreview from '../../../../../../components/dropzone/DropzonePreview';

type AvatarProps = {
  formik: {
    handleChange: {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
      (e: React.ChangeEvent<any>): void;
      // eslint-disable-next-line no-unused-vars
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    // eslint-disable-next-line no-unused-vars
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: FormikValues;
    errors: FormikErrors<FormikValues>;
    touched: FormikTouched<FormikValues>;
  };
};

export default function Avatar(props: AvatarProps) {

  const { setFieldValue, touched, errors } = props.formik;

  const getUploadParams = () => ({ url: apiUrl + '/paciente/file' });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      setFieldValue('photoLink', file.xhr.response);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      api.delete('/paciente/file', { data: { url: file.xhr.response } });
      setFieldValue('photoLink', '');
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
        inputContent="Insira uma foto do paciente"
      />
      {errors.photoLink && touched.photoLink && <div className="error">{errors.photoLink}</div>}
    </div>
  );
}
