import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { ColorResult, SliderPicker } from 'react-color';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import { useModalAddLocalStore } from '../hooks/ModalAddLocalStore';
import Dropzone, { IFileWithMeta, StatusValue, defaultClassNames } from 'react-dropzone-uploader';
import api, { apiUrl } from '../../../../services/useAxios';
import DropzonePreview from '../../../../components/dropzone/DropzonePreview';
import AsyncButton from '../../../../components/AsyncButton';
import { notify } from '../../../../components/toast/NotificationIcon';
import { useServiceLocationStore } from '../../../../hooks/professional/ServiceLocationStore';
import { Local } from '../../../../types/Events';
import { useQueryClient } from '@tanstack/react-query';

interface FormikValues {
  name: string;
  address: string;
  phone: string;
  logoUrl: string;
  color: string;
}

const ModalAddLocal = () => {
  const showModal = useModalAddLocalStore((state) => state.showModal);
  const selectedLocaltion = useModalAddLocalStore((state) => state.selectedLocaltion);
  const queryClient = useQueryClient();

  const [color, setColor] = useState('#4ad395'); // Define a cor inicial
  const [isSaving, setIsSaving] = useState(false);

  const { handleHideModal } = useModalAddLocalStore();
  const { addServiceLocation, updateServiceLocation } = useServiceLocationStore();

  const validationSchema = Yup.object().shape({
    logoUrl: Yup.string().url().typeError('Insira uma iamgem válida').required('A imagem do local de atendimento é obrigatória'),
    name: Yup.string().required('O nome do local de atendimento é obrigatório'),
    address: Yup.string().required('O endereço do local de atendimento é obrigatório'),
    phone: Yup.string().typeError('Insira um valor válido').required('O telefone do local de atendimento é obrigatório'),
    color: Yup.string().required('A cor do local de atendimento é obrigatória'),
  });
  const initialValues: FormikValues = { name: '', address: '', phone: '', logoUrl: '', color: '' };

  const onSubmit = async (values: FormikValues) => {
    try {
      setIsSaving(true);

      const payload: Partial<Local> = {
        nome: values.name,
        telefone: values.phone,
        cor: values.color,
        ativo: 1,
        logo: values.logoUrl.split('/').pop(),
        url_base_logo: values.logoUrl
          .split('/')
          .slice(0, values.logoUrl.split('/').length - 1)
          .join('/')
          .replace('https://', ''),
        endereco_completo: values.address,
        dias_semana: '1,2,3,4,5,6,7',
      };

      if(selectedLocaltion) {
        const response = await updateServiceLocation({...selectedLocaltion, ...payload}, queryClient);

        if (!response) throw new Error('Erro ao atualizar local de atendimento');

        setIsSaving(false);
        notify('Local de atendimento atualizado com sucesso', 'Sucesso', 'check', 'success');
      } else {
        const response = await addServiceLocation(payload, queryClient);

        if (!response) throw new Error('Erro ao cadastrar local de atendimento');

        setIsSaving(false);
        notify('Local de atendimento cadastrado com sucesso', 'Sucesso', 'check', 'success');
      }

      handleHideModal();

    } catch (error) {
      setIsSaving(false);
      notify('Erro ao cadastrar local de atendimento', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const { handleSubmit, handleChange, setFieldValue, setValues, values, touched, errors } = formik;

  const handleChangeSliderPicker = (color: ColorResult) => {
    setColor(color.hex); // Atualiza o estado com a nova cor selecionada
    setFieldValue('color', color.hex);
  };

  const getUploadParams = () => ({ url: apiUrl + '/receita-culinaria-diet-system/file' });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      setFieldValue('logoUrl', file.xhr.response);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      api.delete('/receita-culinaria-diet-system/file', { data: { url: file.xhr.response } });
      setFieldValue('logoUrl', '');
    }
  };

  useEffect(() => {
    setValues({
      name: selectedLocaltion?.nome || '',
      address: selectedLocaltion?.endereco_completo || '',
      phone: selectedLocaltion?.telefone || '',
      logoUrl: selectedLocaltion?.url_base_logo && selectedLocaltion?.logo ? `https://${selectedLocaltion.url_base_logo}/${selectedLocaltion.logo}` : '',
      color: selectedLocaltion?.cor || '',
    });

    setColor(selectedLocaltion?.cor || '#4ad395');
  }, [
    selectedLocaltion?.cor,
    selectedLocaltion?.endereco_completo,
    selectedLocaltion?.logo,
    selectedLocaltion?.nome,
    selectedLocaltion?.telefone,
    selectedLocaltion?.url_base_logo,
    setValues,
  ]);

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={handleHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastrar local de atendimento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="filled mb-3">
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
              maxFiles={1}
            />
            {errors.logoUrl && touched.logoUrl && <div className="error">{errors.logoUrl}</div>}
          </div>

          <div className="mb-3">
            <Form.Label>Selecione uma cor para o local (personalização dos PDF's)</Form.Label>
            <SliderPicker color={color} onChange={handleChangeSliderPicker} />
          </div>
          {errors.color && touched.color && <div className="error">{errors.color}</div>}

          <div className="mb-3 mt-2 top-label d-flex">
            <Form.Control type="text" name="name" value={values.name} onChange={handleChange} />
            <Form.Label>NOME DO LOCAL</Form.Label>
          </div>
          {errors.name && touched.name && <div className="error">{errors.name}</div>}

          <div className="mb-3 top-label d-flex">
            <Form.Control type="text" name="address" value={values.address} onChange={handleChange} />
            <Form.Label>ENDEREÇO</Form.Label>
          </div>
          {errors.address && touched.address && <div className="error">{errors.address}</div>}

          <div className="mb-3 top-label d-flex">
            <Form.Control type="text" name="phone" value={values.phone} onChange={handleChange} />
            <Form.Label>TELEFONE</Form.Label>
          </div>
          {errors.phone && touched.phone && <div className="error">{errors.phone}</div>}

          <div className="text-center">
            <AsyncButton isSaving={isSaving} type="submit">
              Cadastrar local
            </AsyncButton>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddLocal;
