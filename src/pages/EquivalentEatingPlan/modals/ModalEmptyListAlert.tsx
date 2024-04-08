import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useModalsStore } from '../hooks/modalsStore';
import { listGroups } from '../hooks/equivalentPlanListStore/initialState';
import { useEquivalentEatingPlanListStore } from '../hooks/equivalentPlanListStore';

const ModalEmptyListAlert = (props: { show: boolean; onClose: () => void }) => {
  const { setShowModalReplacementLists } = useModalsStore();
  const { setSelectedGroup } = useEquivalentEatingPlanListStore();

  const handleClose = () => {
    props.onClose();
    setSelectedGroup(listGroups[0]);
    setShowModalReplacementLists(true);
  };

  return (
    <Modal show={props.show} onHide={props.onClose} size="lg">
      <Modal.Body className="text-center">
        <div className="d-flex justify-content-center my-5">
          <CsLineIcons icon="warning-hexagon" className="text-primary" size={62} />
        </div>
        <p>Primeiro elabore uma lista de substituição ou selecione um modelo pronto.</p>
        <p>Para fazer a distribuição das porções é necessário selecionar os alimentos na lista de distribuição</p>
        <div className="d-flex justify-content-center mt-3">
          <Button type="button" variant="primary" className="mb-1 btn btn-primary" onClick={handleClose}>
            Ok
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEmptyListAlert;
