import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import { Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useMyAttachmentStore } from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useAddAttachmentsModalStore } from '../../hooks/AddAttachmentsModalStore';
import { useEffect, useState } from 'react';
import AsyncButton from '../../../../../components/AsyncButton';
import { urlRegex } from '../../../../../helpers/StringHelpers';

export interface FileFormValues {
  user_link: string;
  name: string;
}

const validationSchema = Yup.object().shape({
  user_link: Yup.string().matches(urlRegex, 'Digite um link válido').required('Insira um link'),
  name: Yup.string().required('Insira um nome'),
});

const initialValues = { name: '', user_link: '' };

export default function LinkPane() {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const selectedAttachment = useAddAttachmentsModalStore((state) => state.selectedAttachment);

  const onSubmit = async (values: FileFormValues) => {
    setIsSaving(true);
    const result = selectedAttachment ? await updateAttachment({ ...selectedAttachment, ...values }, queryClient) : await addAttachment(values, queryClient);
    setIsSaving(false);
    result && closeModal();
  };
  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const { handleSubmit, handleChange, setValues, values, touched, errors } = formik;
  const { addAttachment, updateAttachment } = useMyAttachmentStore();
  const { closeModal } = useAddAttachmentsModalStore();

  useEffect(() => {
    setValues({ name: selectedAttachment?.name || '', user_link: selectedAttachment?.user_link || '' });
  }, [selectedAttachment, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled">
        <CsLineIcons icon="note" />
        <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Digite o nome do material" />
        {errors.name && touched.user_link && <div className="error">{errors.name}</div>}
      </div>
      <div className="mb-3 filled">
        <CsLineIcons icon="link" />
        <Form.Control type="text" name="user_link" value={values.user_link} onChange={handleChange} placeholder="Digite o link" />
        {errors.user_link && touched.user_link && <div className="error">{errors.user_link}</div>}
      </div>
      <AsyncButton isSaving={isSaving} type="submit" variant="primary">
        {selectedAttachment ? 'Atualizar' : 'Cadastrar'} link
      </AsyncButton>
    </Form>
  );
}
