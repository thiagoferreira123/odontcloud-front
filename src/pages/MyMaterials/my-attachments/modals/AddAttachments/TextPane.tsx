import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import { Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useMyAttachmentStore } from '../../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';
import { useAddAttachmentsModalStore } from '../../hooks/AddAttachmentsModalStore';
import { useEffect, useState } from 'react';
import AsyncButton from '../../../../../components/AsyncButton';
import { MaterialTag } from '../../hooks/MaterialTagStore';
import CategorySelect from './CategorySelect';

export interface TextFormValues {
  user_text: string;
  name: string;
  tag: MaterialTag;
}

const validationSchema = Yup.object().shape({
  user_text: Yup.string().required('Insira um texto'),
  name: Yup.string().required('Insira um nome'),
});

const initialValues = { name: '', user_text: '', tag: { tag: '' } };

export default function TextPane() {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const selectedAttachment = useAddAttachmentsModalStore((state) => state.selectedAttachment);

  const onSubmit = async (values: TextFormValues) => {
    setIsSaving(true);

    const payload = {
      ...values,
      tags: values.tag.tag ? [values.tag] : selectedAttachment?.tags ?? [],
    }

    const result = selectedAttachment ? await updateAttachment({ ...selectedAttachment, ...payload }, queryClient) : await addAttachment(payload, queryClient);
    setIsSaving(false);
    result && closeModal();
  };
  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const { handleSubmit, handleChange, setFieldValue, setValues, values, touched, errors } = formik;
  const { addAttachment, updateAttachment } = useMyAttachmentStore();
  const { closeModal } = useAddAttachmentsModalStore();

  useEffect(() => {
    setValues({ name: selectedAttachment?.name || '', user_text: selectedAttachment?.user_text || '', tag: selectedAttachment?.tags[0] || { tag: '' } });
  }, [selectedAttachment, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <div className="mb-3 filled">
        <CsLineIcons icon="note" />
        <Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Digite o nome do material" />
        {errors.name && touched.name && <div className="error">{errors.name}</div>}
      </div>

      <div className="mb-3 filled z-3">
        <Editor
          apiKey="bef3ulc00yrfvjjiawm3xjxj41r1k2kl33t9zlo8ek3s1rpg"
          init={{
            plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
            table: {
              title: 'Table',
              items: 'inserttable | cell row column | advtablesort | tableprops deletetable',
            },
            language: 'pt_BR',
          }}
          value={values.user_text}
          onEditorChange={(content) => setFieldValue('user_text', content)}
        />
        {errors.user_text && touched.user_text && <div className="error">{errors.user_text}</div>}
      </div>

      <div className="mb-3 filled">
        <CsLineIcons icon="note" />
        <CategorySelect formik={formik} />
        {errors.name && touched.name && <div className="error">{errors.name}</div>}
      </div>

      <AsyncButton isSaving={isSaving} type="submit" variant="primary">
        {selectedAttachment ? 'Atualizar' : 'Cadastrar'} texto
      </AsyncButton>
    </Form>
  );
}
