import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { useState } from 'react';
import { Button, Col, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useEditModalStore } from './hooks/EditModalStore';
import { Editor } from '@tinymce/tinymce-react';
import useAnamnesisStore from '../PatientMenu/anamnesis-patient/hooks/AnamnesisStore';
import AsyncButton from '../../components/AsyncButton';
import { useQueryClient } from '@tanstack/react-query';
import TemplateSelect from './TemplateSelect';

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
