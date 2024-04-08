import React, { useEffect, useRef, useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { Button, Col, Form, Modal, OverlayTrigger, ProgressBar, Tooltip } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useChecklistConductModalStore } from '../hooks/ChecklistConductModalStore';
import { ChecklistConductTemplateItem } from '../../../PatientMenu/checklist-conduct/hooks/ChecklistConductTemplatesStore/types';
import useChecklistConductTemplatesStore from '../../../PatientMenu/checklist-conduct/hooks/ChecklistConductTemplatesStore';
import TemplateSelect from './TemplateSelect';
import AsyncButton from '../../../../components/AsyncButton';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import { Row } from 'react-bootstrap';
import { AppException } from '../../../../helpers/ErrorHelpers';
import { notify } from '../../../../components/toast/NotificationIcon';

export interface ChecklistConductModalFormValues {
  name: string;
}

const ChecklistConductModal: React.FC = () => {
  const queryClient = useQueryClient();
  const showModal = useChecklistConductModalStore((state) => state.showModal);
  const selectedChecklistConduct = useChecklistConductModalStore((state) => state.selectedChecklistConduct);

  const [selectedItem, setSelectedItem] = useState<ChecklistConductTemplateItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAsTemplate, setIsSavingAsTemplate] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Insira um nome válido.'),
  });

  const initialValues: ChecklistConductModalFormValues = { name: '' };

  const { updateChecklistConductTemplate, addChecklistConductTemplate } = useChecklistConductTemplatesStore();
  const { hideModal, addConductItem, updateConductItem, removeConductItem, setItems } = useChecklistConductModalStore();

  const onSubmit = (values: ChecklistConductModalFormValues) => {
    if (!selectedItem) return console.error('Item not found');

    if (selectedChecklistConduct?.items.find((item) => item.position === selectedItem?.position)) {
      const payload: ChecklistConductTemplateItem = {
        ...selectedItem,
        ...values,
      };
      updateConductItem(payload);
      setSelectedItem(null);
      resetForm();
    } else {
      const payload: ChecklistConductTemplateItem = {
        ...selectedItem,
        ...values,
      };
      addConductItem(payload);
      setSelectedItem(null);
      resetForm();
    }
  };

  const handleAddItem = () => {
    if (!selectedChecklistConduct) return console.error('ChecklistConduct not found');

    const payload: ChecklistConductTemplateItem = {
      name: '',
      markedAsDone: 'NAO',
      position: selectedChecklistConduct.items.length + 1,
    };

    setSelectedItem(payload);
  };

  const handleEditItem = (item: ChecklistConductTemplateItem) => {
    setValues({ name: item.name });
    setSelectedItem(item);
  };

  const handleRemoveItem = (item: ChecklistConductTemplateItem) => {
    removeConductItem(item);
    setSelectedItem(null);
    setValues({ name: '' });
  };

  const updateItemsPosition = (sortedItems: ChecklistConductTemplateItem[]) => {
    const updatedItems = sortedItems.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setItems(updatedItems);
    setSelectedItem(null);
    setValues({ name: '' });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!selectedChecklistConduct) throw new AppException('ChecklistConduct not found');

      selectedChecklistConduct.items = selectedChecklistConduct.items.map((item, index) => ({ ...item, position: index + 1 }));

      await updateChecklistConductTemplate(selectedChecklistConduct, queryClient);

      resetForm();
      hideModal();
      setSelectedItem(null);
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
      error instanceof AppException && notify('Erro ao atualizar checklist', 'Erro', 'close', 'danger');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, resetForm, setValues, values, touched, errors } = formik;

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        {' '}
        <Modal.Title>Checklist de Condutas Nutricionais</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex">
          <Col className="mb-3 top-label me-2">
            <TemplateSelect setSelectedItem={setSelectedItem} resetForm={resetForm} />
            <Form.Label>SELECIONE UM MODELO</Form.Label>
          </Col>
        </div>

        <div className="d-flex justify-content-end mb-4">
          <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add-separate-food">Adicionar uma nova conduta</Tooltip>}>
            <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={handleAddItem}>
              <Icon.Plus />
            </Button>
          </OverlayTrigger>
        </div>

        <ReactSortable
          list={selectedChecklistConduct?.items as ItemInterface[]}
          setList={newValue => updateItemsPosition(newValue as ChecklistConductTemplateItem[])}
          handle=".drag-item-icon"
          animation={300}
        >
          {selectedChecklistConduct?.items.map((item, index) => (
            <div className="border-bottom border-separator-light mb-2 pb-2 drag-item-icon" key={item.id ?? index}>
              <Row className="g-0 sh-6">
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between">
                    <div className="mb-2 flex-fill">
                      <label className="form-check custom-icon mb-0 checked-line-through checked-opacity-75">
                        <span className="form-check-label">
                          <span className="content">
                            <span className="heading mb-1 d-block lh-1-25">{item.name}</span>
                          </span>
                        </span>
                      </label>
                    </div>

                    <div className="d-flex">
                      <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleEditItem(item)}>
                        <Icon.Pencil />
                      </Button>
                      <Button variant="outline-primary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleRemoveItem(item)}>
                        <Icon.Trash />
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </ReactSortable>

        <Form onSubmit={handleSubmit} className="tooltip-end-top">
          {selectedItem ? (
            <div className="d-flex align-items-center">
              <Col className="mb-3 top-label mt-2">
                <div className="mb-3 top-label">
                  {/* Só aparace se clicar no botão de adicionar */}
                  <Form.Control type="text" name="name" value={values.name} onChange={handleChange} />
                  <Form.Label>DIGITE A CONDUTA</Form.Label>
                  {errors.name && touched.name && <div className="error">{errors.name}</div>}
                </div>
              </Col>
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-add-separate-food">Salvar conduta</Tooltip>}>
                <Button variant="outline-primary" type="submit" size="sm" className="btn-icon btn-icon-only ms-1">
                  <Icon.Floppy />
                </Button>
              </OverlayTrigger>
            </div>
          ) : null}
        </Form>

        <div className="text-center mt-3">
          <AsyncButton isSaving={isSaving} onClickHandler={handleSave} type="submit" variant="primary" className="me-2">
            Salvar
          </AsyncButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChecklistConductModal;
