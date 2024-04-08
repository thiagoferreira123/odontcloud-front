import React from 'react';
import { Modal } from 'react-bootstrap';
import SearchInput from './SearchInput';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

const SearchModal = ({ show, setShow }: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Modal id="searchPagesModal" className="modal-under-nav modal-search modal-close-out" size="lg" show={show} onHide={() => setShow(false)}>
      <Modal.Header className="border-0 p-0" />
      <Modal.Body className="ps-5 pe-5 pb-0 border-0">
        <SearchInput show={show} setShow={setShow} />
      </Modal.Body>
      <Modal.Footer className="border-top justify-content-start ps-5 pe-5 pb-3 pt-3 border-0">
        <span className="text-alternate d-inline-block m-0 me-3">
          <CsLineIcons icon="arrow-bottom" size={15} className="text-alternate align-middle me-1" />
          <span className="align-middle text-medium">Navegar</span>
        </span>
        <span className="text-alternate d-inline-block m-0 me-3">
          <CsLineIcons icon="arrow-bottom-left" size={15} className="text-alternate align-middle me-1" />
          <span className="align-middle text-medium">Selecionar</span>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchModal;
