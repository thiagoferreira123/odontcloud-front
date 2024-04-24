import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { useState } from 'react';
import { Modal, Row } from 'react-bootstrap';
import { useEditModalStore } from './hooks/EditModalStore';
import useAnamnesisStore from '../PatientMenu/anamnesis-patient/hooks/AnamnesisStore';
import AsyncButton from '../../components/AsyncButton';
import { useQueryClient } from '@tanstack/react-query';
import TemplateSelect from './TemplateSelect';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/link';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/models/dom/model';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/content/default/content.min.css';
import { Editor } from '@tinymce/tinymce-react';

const ModalAnamnesis = () => {
  const queryClient = useQueryClient();

  const [isSaving, setIsSaving] = useState(false);

  const showModal = useEditModalStore((state) => state.showModal);
  const selectedAnamnesis = useEditModalStore((state) => state.selectedAnamnesis);

  const { hideModal, handleChangeAnamnesis } = useEditModalStore();
  const { updateAnamnesis } = useAnamnesisStore();

  const onSubmit = async () => {
    try {
      setIsSaving(true);

      if (!selectedAnamnesis) throw new Error('Anamnesis not found');

      await updateAnamnesis(selectedAnamnesis, queryClient);

      setIsSaving(false);
      hideModal();
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <Modal className="modal-close-out" size="xl" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Anamnese do paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3 d-flex">
          <div>
            <TemplateSelect />
          </div>
        </Row>

        <div>
          <Editor
            licenseKey='gpl'
            init={{
              plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
              toolbar:
                'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media | table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              table: {
                title: 'Table',
                items: 'inserttable | cell row column | advtablesort | tableprops deletetable',
              },
              language_url : '/langs/pt_BR.js',
              font_family_formats:
                'Mulish=mulish; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
              content_style:
                "@import url('https://fonts.googleapis.com/css2?family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap'); * { font-family: Mulish; }",
              promotion: false,
              init_instance_callback: function (editor) {
                editor.on('init', function () {
                  editor.execCommand('fontName', false, 'Mulish');
                  editor.execCommand('fontSize', false, '12');
                });
              },
            }}
            value={selectedAnamnesis?.anamnesis_text || ''}
            onEditorChange={(anamnesis_text) => handleChangeAnamnesis({ ...selectedAnamnesis, anamnesis_text })}
          />
        </div>
        <div className="text-center mt-2">
          <AsyncButton onClickHandler={onSubmit} isSaving={isSaving} variant="primary" size="lg" className="hover-scale-down mt-3" type="submit">
            <CsLineIcons icon="save" /> <span>Salvar anamnese</span>
          </AsyncButton>{' '}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAnamnesis;
