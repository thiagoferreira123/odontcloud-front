import { Modal, Nav, Tab } from 'react-bootstrap';
import ResponsiveNav from '../../../../../components/ResponsiveNav';
import { useAddAttachmentsModalStore } from '../../hooks/AddAttachmentsModalStore';
import FilePane from './FilePane';
import TextPane from './TextPane';
import LinkPane from './LinkPane';
import { useEffect, useState } from 'react';

function AddAttachments() {
  const showModal = useAddAttachmentsModalStore((state) => state.showModal);
  const selectedAttachment = useAddAttachmentsModalStore((state) => state.selectedAttachment);

  const key = selectedAttachment?.s3_link ? 'file' : selectedAttachment?.user_text ? 'text' : selectedAttachment?.user_link ? 'link' : 'file';

  const { closeModal } = useAddAttachmentsModalStore();

  console.log('key', key);

  return (
    <>
      <Modal show={showModal} onHide={closeModal} className="modal-close-out" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cadastrar material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tab.Container defaultActiveKey={key}>
            <Nav variant="pills" as={Nav} className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="file">
                  Upload de arquivo
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="text">
                  Digitar texto
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="link">
                  Inserir um link
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="file">
                <FilePane />
              </Tab.Pane>

              <Tab.Pane eventKey="text">
                <TextPane />
              </Tab.Pane>

              <Tab.Pane eventKey="link">
                <LinkPane />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddAttachments;
