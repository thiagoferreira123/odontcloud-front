import { Button, Col, Form, Modal, OverlayTrigger, ProgressBar, Row, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useChecklistConductModalStore } from '../../hooks/ChecklistConductModalStore';
import { ChecklistConductItem } from '../../hooks/ChecklistConductsStore/types';
import { useState } from 'react';
import TemplateSelect from './TemplateSelect';
import AsyncButton from '../../../../../components/AsyncButton';
import useChecklistConductsStore from '../../hooks/ChecklistConductsStore';
import { useQueryClient } from '@tanstack/react-query';
import { AppException } from '../../../../../helpers/ErrorHelpers';
import { notify } from '../../../../../components/toast/NotificationIcon';
import useChecklistConductTemplatesStore from '../../hooks/ChecklistConductTemplatesStore';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import Empty from '../../../../../components/Empty';

export interface ChecklistConductModalFormValues {
  name: string;
}

const ChecklistConductModal = () => {
  const queryClient = useQueryClient();
  const showModal = useChecklistConductModalStore((state) => state.showModal);
  const selectedChecklistConduct = useChecklistConductModalStore((state) => state.selectedChecklistConduct);

  const [selectedItem, setSelectedItem] = useState<ChecklistConductItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAsTemplate, setIsSavingAsTemplate] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Insira um nome válido.'),
  });

  const initialValues: ChecklistConductModalFormValues = { name: '' };

  const onSubmit = (values: ChecklistConductModalFormValues) => {
    if (!selectedItem) return console.error('Item not found');

    if (selectedChecklistConduct?.items.find((item) => item.position === selectedItem?.position)) {
      const payload: ChecklistConductItem = {
        ...selectedItem,
        ...values,
      };
      updateConductItem(payload);
      setSelectedItem(null);
      resetForm();
    } else {
      const payload: ChecklistConductItem = {
        ...selectedItem,
        ...values,
      };
      addConductItem(payload);
      setSelectedItem(null);
      resetForm();
    }
  };

  const updateItemsPosition = (sortedItems: ChecklistConductItem[]) => {
    const updatedItems = sortedItems.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setItems(updatedItems);
    setSelectedItem(null);
    setValues({ name: '' });
  };

  const handleEditItem = (item: ChecklistConductItem) => {
    setValues({ name: item.name });
    setSelectedItem(item);
  };

  const handleAddItem = () => {
    if (!selectedChecklistConduct) return console.error('ChecklistConduct not found');

    const payload: ChecklistConductItem = {
      name: '',
      markedAsDone: 'NAO',
      position: selectedChecklistConduct.items.length + 1,
    };

    setSelectedItem(payload);
  };

  const handleRemoveItem = (item: ChecklistConductItem) => {
    removeConductItem(item);
    setSelectedItem(null);
    setValues({ name: '' });
  };

  const handleToggleItemMarked = (item: ChecklistConductItem, checked: boolean) => {
    if (!selectedChecklistConduct) return console.error('ChecklistConduct not found');

    const payload: ChecklistConductItem = {
      ...item,
      markedAsDone: checked ? 'SIM' : 'NAO',
    };

    updateConductItem(payload);
    setSelectedItem(null);
    setValues({ name: '' });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (!selectedChecklistConduct) throw new AppException('ChecklistConduct not found');

      selectedChecklistConduct.items = selectedChecklistConduct.items.map((item, index) => ({ ...item, position: index + 1 }));

      await updateChecklistConduct(selectedChecklistConduct, queryClient);

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

  const handleSaveAsTemplate = async () => {
    try {
      setIsSavingAsTemplate(true);

      if (!selectedChecklistConduct) throw new AppException('ChecklistConduct not found');

      selectedChecklistConduct.items = selectedChecklistConduct.items.map((item, index) => ({
        ...item,
        position: index + 1,
        id: undefined,
        conduct_list_id: undefined,
      }));

      await addChecklistConductTemplate({ ...selectedChecklistConduct, patient_id: undefined, id: undefined }, queryClient);

      setIsSavingAsTemplate(false);
    } catch (error) {
      console.error(error);
      setIsSavingAsTemplate(false);
      error instanceof AppException && notify('Erro ao atualizar checklist', 'Erro', 'close', 'danger');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, setValues, values, touched, errors } = formik;
  const { hideModal, addConductItem, updateConductItem, removeConductItem, setItems } = useChecklistConductModalStore();
  const { updateChecklistConduct } = useChecklistConductsStore();
  const { addChecklistConductTemplate } = useChecklistConductTemplatesStore();

  const markedItems = selectedChecklistConduct?.items.filter((item) => item.markedAsDone === 'SIM').length;
  const percentage = markedItems ? (markedItems / selectedChecklistConduct?.items.length) * 100 : 0;

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
            <Button variant="primary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={handleAddItem}>
              <Icon.Plus />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-add-separate-food">Salvar condutas como modelo para usar com outros pacientes.</Tooltip>}
          >
            <span>
              <AsyncButton
                isSaving={isSavingAsTemplate}
                loadingText=" "
                variant="primary"
                size="sm"
                className="btn-icon btn-icon-only ms-1"
                onClickHandler={handleSaveAsTemplate}
                disabled={selectedChecklistConduct?.items.length === 0}
              >
                <Icon.Star />
              </AsyncButton>
            </span>
          </OverlayTrigger>
        </div>

        <div className="scroll-out me-2 ms-2">
          <div className="override-native overflow-auto sh-35 pe-3">
            {!selectedChecklistConduct?.items.length ? (
              <div className="d-flex justify-content-center">
                <Empty message="nenhuma conduta adicionada" />
              </div>
            ) : (
              <ReactSortable
                list={selectedChecklistConduct?.items as ItemInterface[]}
                setList={(newValue) => updateItemsPosition(newValue as ChecklistConductItem[])}
                handle=".drag-item-icon"
                animation={300}
              >
                {selectedChecklistConduct?.items.map((item, index) => (
                  <div className="border-bottom border-separator-light mb-2 pb-2 drag-item-icon" key={item.id ?? index}>
                    <Row className="g-0 sh-6">
                      <Col>
                        <div className="d-flex flex-row pt-0 pb-0 pe-0 h-100 align-items-center justify-content-between ms-2">
                          <div className="mb-2 flex-fill">
                            <label className="form-check custom-icon mb-0 checked-line-through checked-opacity-75">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                defaultChecked={item.markedAsDone === 'SIM'}
                                onChange={(e) => handleToggleItemMarked(item, e.target.checked)}
                              />
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
            )}
          </div>
        </div>
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

        <div>
          <label className="mt-2"> Percentual de condutas realizadas (%):</label>
          <ProgressBar className="sh-2 mt-2 mb-4" now={percentage} label={`${Math.round(percentage)}%`} />
        </div>

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
