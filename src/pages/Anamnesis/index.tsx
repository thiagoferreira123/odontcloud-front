import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import React, { useState } from 'react';
import { Button, Col, Modal, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import ModalImportForm from './modals/ImportFormModal';
import ModalBistrolScale from './modals/BistrolScaleModal';
import ModalStoolColoring from './modals/StoolColoringModal';
import ModalUrineColoring from './modals/ModalUrineColoring';
import { useEditModalStore } from './hooks/EditModalStore';
import { Editor } from '@tinymce/tinymce-react';
import useAnamnesisStore from '../PatientMenu/anamnesis-patient/hooks/AnamnesisStore';
import AsyncButton from '../../components/AsyncButton';
import { useQueryClient } from '@tanstack/react-query';
import TemplateSelect from './TemplateSelect';
import { useFavoriteAnamnesisModalStore } from './hooks/modals/FavoriteAnamnesisModal';
import FavoriteAnamnesisModal from './modals/FavoriteAnamnesisModal';
import { useImportFormModalStore } from './hooks/modals/ImportFormModalStore';
import { useBistrolScaleModalStore } from './hooks/modals/BistrolScaleModal';
import { useStoolColoringModalStore } from './hooks/modals/StoolColoringModalStore';
import { useUrineColoringModalStore } from './hooks/modals/UrineColoringModalStore';

const ModalAnamnesis = () => {
  const queryClient = useQueryClient();

  const [isSaving, setIsSaving] = useState(false);

  const showModal = useEditModalStore((state) => state.showModal);
  const selectedAnamnesis = useEditModalStore((state) => state.selectedAnamnesis);

  const { hideModal, handleChangeAnamnesis } = useEditModalStore();
  const { updateAnamnesis } = useAnamnesisStore();
  const { showFavoriteAnamnesisModal } = useFavoriteAnamnesisModalStore();
  const { showImportFormModal }= useImportFormModalStore();
  const { showBistrolScaleModal }= useBistrolScaleModalStore();
  const { showStoolColoringModal }= useStoolColoringModalStore();
  const { showUrineColoringModal }= useUrineColoringModalStore();

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
        <Col className="d-flex justify-content-between align-items-center">
          <div>
            <Button variant="primary" className="btn-icon btn-icon-start mb-2 me-1" onClick={showImportFormModal}>
              <CsLineIcons icon="search" /> <span>Importar questionário pré-consulta</span>
            </Button>
            <Button variant="primary" className="btn-icon btn-icon-start mb-2 me-1" onClick={showBistrolScaleModal}>
              Escala de bistrol
            </Button>
            <Button variant="primary" className="btn-icon btn-icon-start mb-2 me-1" onClick={showStoolColoringModal}>
              Coloração das fezes
            </Button>
            <Button variant="primary" className="btn-icon btn-icon-start mb-2 me-1" onClick={showUrineColoringModal}>
              Escala de hidratação
            </Button>
          </div>
          <div>
            <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Salvar anamnese como modelo</Tooltip>}>
              <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only mb-1 me-1" onClick={showFavoriteAnamnesisModal}>
                <CsLineIcons icon="star" />
              </Button>
            </OverlayTrigger>
          </div>
        </Col>

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
            value={selectedAnamnesis?.textFromAnamnesis || ''}
            onEditorChange={(textFromAnamnesis) => handleChangeAnamnesis({ ...selectedAnamnesis, textFromAnamnesis })}
          />
        </div>
        <div className="text-center mt-2">
          <AsyncButton onClickHandler={onSubmit} isSaving={isSaving} variant="primary" size="lg" className="hover-scale-down mt-3" type="submit">
            <CsLineIcons icon="save" /> <span>Salvar anamnese</span>
          </AsyncButton>{' '}
        </div>

        <FavoriteAnamnesisModal />
        <ModalImportForm />
        <ModalBistrolScale />
        <ModalStoolColoring />
        <ModalUrineColoring />
      </Modal.Body>
    </Modal>
  );
};

export default ModalAnamnesis;
