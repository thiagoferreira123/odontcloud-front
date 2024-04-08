import { useEffect, useState } from 'react';
import CsLineIcons from '../../../../../../cs-line-icons/CsLineIcons';
import { Form } from 'react-bootstrap';
import AttachmentDropzone from './AttachmentDropzone';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useMyAttachmentStore } from '../../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import AsyncButton from '../../../../../../components/AsyncButton';
import { useAddAttachmentsModalStore } from '../../../hooks/AddAttachmentsModalStore';
import CategorySelect from '../CategorySelect';
import { MaterialTag } from '../../../hooks/MaterialTagStore';

export interface FileFormValues {
  s3_link: string;
  name: string;
  tag: MaterialTag;
}

const validationSchema = Yup.object().shape({
  s3_link: Yup.string().required('Insira um arquivo'),
  name: Yup.string().required('Insira um nome'),
});

const initialValues = { name: '', s3_link: '', tag: { tag: '' } };

export default function FilePane() {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const selectedAttachment = useAddAttachmentsModalStore((state) => state.selectedAttachment);

  const onSubmit = async (values: FileFormValues) => {
    setIsSaving(true);

    const payload = {
      ...values,
      tags: [values.tag],
    }

    const result = selectedAttachment ? await updateAttachment({ ...selectedAttachment, ...payload }, queryClient) : await addAttachment(payload, queryClient);
    setIsSaving(false);
    result && closeModal();
  };
  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const { handleSubmit, handleChange, setValues, values, touched, errors } = formik;
  const { addAttachment, updateAttachment } = useMyAttachmentStore();
  const { closeModal } = useAddAttachmentsModalStore();

  useEffect(() => {
    setValues({ name: selectedAttachment?.name || '', s3_link: selectedAttachment?.s3_link || '', tag: selectedAttachment?.tags[0] || { tag: '' } });
  }, [selectedAttachment, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled">
        <CsLineIcons icon="note" />
        <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Digite o nome do material" />
        {errors.name && touched.name && <div className="error">{errors.name}</div>}
      </div>
      <div className="mb-3 filled">
        <CsLineIcons icon="note" />
        <CategorySelect formik={formik} />
        {errors.name && touched.name && <div className="error">{errors.name}</div>}
      </div>

      <div className="filled">
        <CsLineIcons icon="upload" />
        <AttachmentDropzone formik={formik} />
      </div>

      <AsyncButton isSaving={isSaving} type="submit" variant="primary">
        {selectedAttachment ? 'Atualizar' : 'Cadastrar'} Arquivo
      </AsyncButton>
    </Form>
  );
}
