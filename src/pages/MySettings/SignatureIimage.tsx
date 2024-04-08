import React, { useState } from 'react';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import Dropzone, { IFileWithMeta, StatusValue, defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from '../../components/dropzone/DropzonePreview';
import api, { apiUrl } from '../../services/useAxios';
import { useAuth } from '../Auth/Login/hook';
import AsyncButton from '../../components/AsyncButton';

const SignatureIimage = () => {
  const [isSaving, setIsSaving] = useState(false);

  const user = useAuth((state) => state.user);

  const { setUser } = useAuth();

  const getUploadParams = () => ({ url: apiUrl + '/clinic/upload-signature' });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      if (!user) return console.error('Usuário não encontrado');

      setUser({
        ...user,
        clinic_signature_link: file.xhr.response,
      });
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      if (!user) return console.error('Usuário não encontrado');

      api.delete('/clinic/upload-signature', { data: { url: file.xhr.response } });
      setUser({ ...user, clinic_signature_link: '' });
    }
  };

  const onSubmit = async () => {
    try {
      setIsSaving(true);

      await api.put('/clinic', { clinic_signature_link: user?.clinic_signature_link });

      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <>
     <div className='mb-3'>
        Não possui a imagem de uma assinatura?
        <a href="https://www.signwell.com/online-signature/draw/" target="_blank" rel="noopener noreferrer"> Clique aqui</a>
      </div>
      <div className="filled mb-2">
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
          inputContent="Insira a imagem da assinatura"
        />
      </div>

      <div className="text-center">
        <AsyncButton isSaving={isSaving} type="submit" size="lg" variant="primary" onClickHandler={onSubmit}>
          Salvar imagem
        </AsyncButton>
      </div>
    </>
  );
};

export default SignatureIimage;
