import React, { useState } from 'react';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import Dropzone, { IFileWithMeta, StatusValue, defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import DropzonePreview from '/src/components/dropzone/DropzonePreview';
import api, { apiUrl } from '../../services/useAxios';
import { useAuth } from '../Auth/Login/hook';
import AsyncButton from '../../components/AsyncButton';

const SignatureIimage = () => {
  const [isSaving, setIsSaving] = useState(false);

  const user = useAuth((state) => state.user);

  const { setUser } = useAuth();

  const getUploadParams = () => ({ url: apiUrl + '/profissional/upload-assinatura' });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      if (!user) return console.error('Usuário não encontrado');

      setUser({
        ...user,
        url_base_assinatura: file.xhr.response
          .split('/')
          .slice(0, file.xhr.response.split('/').length - 1)
          .join('/')
          .replace('https://', ''),
        imagem_assinatura: file.xhr.response.split('/').pop(),
      });
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      if (!user) return console.error('Usuário não encontrado');

      api.delete('/profissional/upload-assinatura', { data: { url: file.xhr.response } });
      setUser({ ...user, url_base_assinatura: '', imagem_assinatura: '' });
    }
  };

  const onSubmit = async () => {
    try {
      setIsSaving(true);

      await api.put('/profissional', { imagem_assinatura: user?.imagem_assinatura, url_base_assinatura: user?.url_base_assinatura });

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
