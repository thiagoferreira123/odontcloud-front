import { Button, Col, Modal, Row } from 'react-bootstrap';
import { useCollectFilesModalStore } from '../Hooks/modals/CollectFilesModalStore';
import { FileItem } from '../../../types/FormBuilder';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useCollectFormFilesModalStore } from '../Hooks/modals/CollectFormFilesModalStore';

const FILE_URL = 'https://anexo-material-profissionais.s3.us-east-2.amazonaws.com';

const CollectFilesModal = () => {

  const selectedForm = useCollectFilesModalStore((state) => state.selectedForm);
  const showModal = useCollectFilesModalStore((state) => state.showModal);

  const { hideModal } = useCollectFilesModalStore();
  const { handleSelectForm } = useCollectFormFilesModalStore();

  const handleOpenFile = (file: FileItem) => {
    const url = file.aws_file_name.includes('http') ? file.aws_file_name : `${FILE_URL}/${file.aws_file_name}`;
    window.open(url, '_blank');
  };

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedForm?.nome}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-0 gap-2">
          {selectedForm?.arquivosAnexados.map((file) => (
            <Col md={12} key={file.id}>
              <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                <div className="d-flex flex-column">
                  <div>{file.file_name}</div>
                </div>
                <div className="d-flex">
                  <Button onClick={() => handleOpenFile(file)} variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1">
                    <CsLineIcons icon="eye" />
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Row className="mt-4 mb-2 text-center">
          <Button variant="outline-secondary" className="ms-1" onClick={ () => {hideModal(); selectedForm && handleSelectForm(selectedForm)}}>
            <CsLineIcons icon="duplicate" />
            <span> Coletar aquivos para o perfil do paciente</span>
          </Button>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default CollectFilesModal;
