import React, { useCallback, useEffect, useState } from 'react';
import { Accordion, Button, Card, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { QualitativeEatingPlanMeal } from '../../PatientMenu/qualitative-eating-plan/hooks/eating-plan/types';
import { PatternFormat } from 'react-number-format';
import { useQualitativeEatingPlanStore } from '../hooks/QualitativeEatingPlanStore';
import api from '../../../services/useAxios';
import { notify } from '../../../components/toast/NotificationIcon';
import { useDeleteMealConfirmationModalStore } from '../hooks/modals/DeleteTemplateConfirmationModalStore';
import AsyncButton from '../../../components/AsyncButton';
import { useFavoriteMealModal } from '../hooks/modals/FavoriteMealModalStore';
import { usePhotoMealModalStore } from '../hooks/modals/PhotoMealModalStore';
import { useMealCommentModalStore } from '../hooks/modals/MealCommentModalStore';
import { GripVertical } from 'react-bootstrap-icons';
import Comment from './Comment';
import CustomAccordionToggle from '../../CaloricExpenditure/CustomAccordionToggle';

interface MealFormProps {
  meal: QualitativeEatingPlanMeal;
  index: number;
  sortableEnabled: boolean;
}
interface FormValues {
  time: string;
  name: string;
  content: string;
}

export default function MealForm(props: MealFormProps) {
  const validationSchema = Yup.object().shape({
    content: Yup.string().nullable().required('Digite um texto.'),
  });
  const initialValues: FormValues = { content: props.meal.content, time: props.meal.time, name: props.meal.name };

  const onSubmit = async () => {
    if (!pendentChanges) return;
    if (!props.meal.id) throw new Error('Refeição não definida');

    setPendentChanges(false);

    const payload = {
      time: props.meal.time,
      name: props.meal.name,
      content: values.content,
    };

    try {
      await api.patch('/plano-alimentar-qualitativo-refeicao/' + props.meal.id, payload);

      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const [pendentChanges, setPendentChanges] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [showButtonRemoveImage, setShowButtonRemoveImage] = useState(false);

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setValues, values, touched, errors } = formik;
  const { updateMeal, cloneMeal } = useQualitativeEatingPlanStore();
  const { handleDeleteQualitativeEatingPlanMeal } = useDeleteMealConfirmationModalStore();
  const { handleSelectMealAsTemplate } = useFavoriteMealModal();
  const { handleSelectMealForChangeImage } = usePhotoMealModalStore();
  const { handleSelectMealToUpdateComment } = useMealCommentModalStore();

  const handleChangeHorario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      time: e.target.value,
    };

    updateMeal({ ...payload, id: props.meal.id });

    setPendentChanges(true);
  };

  const handleUpdateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payload = {
      name: e.target.value,
    };

    updateMeal({ ...payload, id: props.meal.id });

    setPendentChanges(true);
  };

  const handleCloneMeal = async () => {
    try {
      setIsCloning(true);
      const response = await cloneMeal(props.meal.id);

      if (response === false) throw new Error('Could not clone meal');

      setIsCloning(false);
    } catch (error) {
      console.error(error);
      setIsCloning(false);
    }
  };

  const handleRemoveMealImage = async () => {
    const payload = {
      imageUrl: '',
    };

    updateMeal({ ...payload, id: props.meal.id });

    try {
      await api.patch('/plano-alimentar-qualitativo-refeicao/' + props.meal.id, payload);
      notify('Refeição atualizada com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  const updateMealOrder = useCallback(async () => {
    const payload = {
      id_refeicao: props.meal.id,
      posicao: props.index + 1,
    };

    try {
      if (props.meal.ordem) api.patch('/plano-alimentar-qualitativo-ordem/' + props.meal.ordem.id, payload);
      else {
        const response = await api.post('/plano-alimentar-qualitativo-ordem', payload);
        updateMeal({ ...props.meal, ordem: response.data });
      }
    } catch (error) {
      console.error(error);
    }
  }, [props.index, props.meal, updateMeal]);

  useEffect(() => {
    setValues({
      time: props.meal.time,
      name: props.meal.name,
      content: values.content,
    });
  }, [props.meal.content, props.meal.name, props.meal.time, setValues, values.content]);

  useEffect(() => {
    if (!props.sortableEnabled) return;

    updateMealOrder();
  }, [props.sortableEnabled, updateMealOrder]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <Accordion className="mb-2" defaultActiveKey="1">
        <Card className="d-flex mb-2 flex-grow-1">
          <CustomAccordionToggle eventKey="1">
            <div className="d-flex flex-row align-items-center">
              {/* Image */}
              <span
                style={{ transform: 'translateX(-75%)', marginRight: props.meal.imageUrl ? '-2.5rem' : '' }}
                onMouseOver={() => setShowButtonRemoveImage(true)}
                onFocus={() => setShowButtonRemoveImage(true)}
                onMouseOut={() => setShowButtonRemoveImage(false)}
                onBlur={() => setShowButtonRemoveImage(false)}
              >
                <img
                  src={props.meal.imageUrl ?? ''}
                  alt="product-2"
                  className={`card-img card-img-horizontal sw-7 sh-6 ${!props.meal.imageUrl ? 'd-none' : ''}`}
                />

                <div
                  onClick={handleRemoveMealImage}
                  className={`position-absolute bottom-0 end-0 btn btn-sm btn-icon btn-icon-only btn-secondary ms-1 ${
                    !showButtonRemoveImage || !props.meal.imageUrl ? 'd-none' : false
                  }`}
                >
                  <CsLineIcons icon="bin" />
                </div>
              </span>

              <GripVertical width={24} height={24} className="drag-meal-icon all-scroll" />

              {/* Time */}
              <div className="d-flex flex-column justify-content-center w-25 filled">
                <CsLineIcons icon="clock" />
                <PatternFormat
                  className="form-control"
                  format="##:##"
                  mask="_"
                  placeholder="HH:MM"
                  value={props.meal.time !== '00:00:00' ? props.meal.time : ''}
                  onChange={handleChangeHorario}
                  onBlur={() => handleSubmit()}
                />
              </div>

              {/* Name */}
              <div className="d-flex flex-column justify-content-center ms-1 flex-fill filled">
                <CsLineIcons icon="form" />
                <Form.Control placeholder="Nome da refeição" type="text" value={props.meal.name} onChange={handleUpdateName} onBlur={() => handleSubmit()} />
              </div>
            </div>
          </CustomAccordionToggle>
          <Accordion.Collapse eventKey="1">
            <Card.Body className="pt-0">
              <div className="mb-3 form-floating">
                <Form.Control
                  name="content"
                  as="textarea"
                  rows={5}
                  value={values.content}
                  onChange={(e) => {
                    setPendentChanges(true);
                    updateMeal({ content: e.target.value, id: props.meal.id });
                    handleChange(e);
                  }}
                  onBlur={() => handleSubmit()}
                  placeholder="Digite a refeição"
                  className="custom-scrollbar"
                />
                <Form.Label>Digite a refeição</Form.Label>
                {errors.content && touched.content && <div className="error">{errors.content}</div>}
              </div>

              <div className="d-flex justify-content-end">
                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Excluir refeição</Tooltip>}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-icon btn-icon-only mb-1 me-1"
                    onClick={() => handleDeleteQualitativeEatingPlanMeal(props.meal)}
                  >
                    <CsLineIcons icon="bin" />
                  </Button>
                </OverlayTrigger>{' '}
                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Duplicar refeição</Tooltip>}>
                  <span>
                    <AsyncButton
                      isSaving={isCloning}
                      loadingText=" "
                      variant="outline-primary"
                      size="sm"
                      className="btn-icon btn-icon-only mb-1 me-1"
                      onClickHandler={handleCloneMeal}
                    >
                      <CsLineIcons icon="duplicate" />
                    </AsyncButton>
                  </span>
                </OverlayTrigger>{' '}
                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Inserir comentário</Tooltip>}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-icon btn-icon-only mb-1 me-1"
                    onClick={() => handleSelectMealToUpdateComment(props.meal)}
                  >
                    <CsLineIcons icon="message" />
                  </Button>
                </OverlayTrigger>{' '}
                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Adicionar imagem</Tooltip>}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-icon btn-icon-only mb-1 me-1"
                    onClick={() => handleSelectMealForChangeImage(props.meal)}
                  >
                    <CsLineIcons icon="file-image" />
                  </Button>
                </OverlayTrigger>{' '}
                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-4">Salvar refeição como modelo</Tooltip>}>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="btn-icon btn-icon-only mb-1 me-1"
                    onClick={() => handleSelectMealAsTemplate(props.meal)}
                  >
                    <CsLineIcons icon="star" />
                  </Button>
                </OverlayTrigger>{' '}
              </div>

              <Comment meal={props.meal} />
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </Form>
  );
}
