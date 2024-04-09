import React from 'react';
import { FormikErrors, FormikTouched } from 'formik';
import Dropzone, { IFileWithMeta, StatusValue, defaultClassNames } from 'react-dropzone-uploader';
import { FormAddProfessionalFormValues } from '.';
import { useCreateAndEditModalStore } from '../../../hooks/CreateAndEditModalStore';
import api, { apiUrl } from '../../../../../services/useAxios';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import DropzonePreview from '../../../../../components/dropzone/DropzonePreview';

type AvatarProps = {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
    values: FormAddProfessionalFormValues;
    errors: FormikErrors<FormAddProfessionalFormValues>;
    touched: FormikTouched<FormAddProfessionalFormValues>;
  };
};

export default function Avatar(props: AvatarProps) {
  const selectedPatient = useCreateAndEditModalStore((professional_state) => professional_state.selectedProfessional);

  const { setFieldValue, touched, errors, values } = props.formik;

  const getUploadParams = () => ({ url: apiUrl + '/professional/upload-photo' });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      setFieldValue('professional_photo_link', file.xhr.response);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      api.delete('/professional/upload-photo/' + (selectedPatient?.professional_id ?? '0'), { data: { url: file.xhr.response } });
      setFieldValue('professional_photo_link', '');
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
        inputContent="Insira uma foto do profissional"
      />
      {errors.professional_photo_link && touched.professional_photo_link && <div className="error">{errors.professional_photo_link}</div>}
    </div>
  );
}
