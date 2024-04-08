import React, { useEffect, useState } from 'react';
import { Col, Form, Modal, Row } from 'react-bootstrap';
import { useEditCustomEquivalentFoodModalStore } from '../../hooks/EditCustomEquivalentFoodModalStore';
import SelectEatingGroup from './SelectEatingGroup';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Food } from '../../../../../types/foods';
import { regexNumberFloat } from '../../../../../helpers/InputHelpers';
import { listGroups } from '../../../../EquivalentEatingPlan/hooks/equivalentPlanListStore/initialState';
import api from '../../../../../services/useAxios';
import CsLineIcons from '../../../../../cs-line-icons/CsLineIcons';
import { notify } from '../../../../../components/toast/NotificationIcon';
import AsyncButton from '../../../../../components/AsyncButton';
import { AppException } from '../../../../../helpers/ErrorHelpers';

type Props = {
  onSubmit: (food: Food) => void;
};

export interface EquivalentFoodFormValues {
  descricao_dos_alimentos: string;
  medida: string;
  unidade: string;
  gramas: string;
  carboidrato: string;
  proteina: string;
  lipideos: string;
  energia: string;
  grupo_alimento: string;
}

export default function EditCustomEquivalentFoodModal(props: Props) {
  const selectedFood = useEditCustomEquivalentFoodModalStore((state) => state.selectedFood);
  const showEditCustomEquivalentFoodModal = useEditCustomEquivalentFoodModalStore((state) => state.showEditCustomEquivalentFoodModal);

  const initialValues: EquivalentFoodFormValues = {
    descricao_dos_alimentos: '',
    medida: '',
    grupo_alimento: '',
    unidade: '',
    gramas: '',
    carboidrato: '',
    proteina: '',
    lipideos: '',
    energia: '',
  };

  const validationSchema = Yup.object().shape({
    descricao_dos_alimentos: Yup.string().required('Insira um nome válido'),
    medida: Yup.string().required('Insira uma medida válida'),
    grupo_alimento: Yup.string().required('Selecione um grupo alimentar'),
    unidade: Yup.number().min(1, 'Insira uma quantidade').required('Insira uma quantidade'),
    gramas: Yup.number().required('Insira uma quantidade'),
    carboidrato: Yup.number().required('Insira uma quantidade'),
    proteina: Yup.number().required('Insira uma quantidade'),
    lipideos: Yup.number().required('Insira uma quantidade'),
    energia: Yup.number().required('Insira uma quantidade'),
  });

  const [isSaving, setIsSaving] = useState(false);

  const { setShowEditCustomEquivalentFoodModal, updateSelectedFood } = useEditCustomEquivalentFoodModalStore();

  const handleChangeCarbohydrate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedFood?.alimento) return console.error('Alimento não encontrado');

    const { value } = event.target;

    const carboidrato = regexNumberFloat(value);

    if (isNaN(Number(carboidrato))) return;

    const energia = String(Number(carboidrato) * 4 + Number(selectedFood.alimento.proteina) * 4 + Number(selectedFood.alimento.lipideos) * 9);

    updateSelectedFood({ alimento: { ...selectedFood.alimento, carboidrato: carboidrato, energia } });
    setFieldValue('carboidrato', carboidrato);
    setFieldValue('energia', energia);
  };

  const handleChangeProtein = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedFood?.alimento) return console.error('Alimento não encontrado');

    const { value } = event.target;

    const protein = regexNumberFloat(value);

    if (isNaN(Number(protein))) return;

    const energia = String(Number(protein) * 4 + Number(selectedFood.alimento.carboidrato) * 4 + Number(selectedFood.alimento.lipideos) * 9);

    updateSelectedFood({ alimento: { ...selectedFood.alimento, proteina: protein, energia } });
    setFieldValue('proteina', protein);
    setFieldValue('energia', energia);
  };

  const handleChangeLipid = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedFood?.alimento) return console.error('Alimento não encontrado');

    const { value } = event.target;

    const lipid = regexNumberFloat(value);

    if (isNaN(Number(lipid))) return;

    const energia = String(Number(lipid) * 9 + Number(selectedFood.alimento.carboidrato) * 4 + Number(selectedFood.alimento.proteina) * 4);

    updateSelectedFood({ alimento: { ...selectedFood.alimento, lipideos: lipid, energia } });
    setFieldValue('lipideos', lipid);
    setFieldValue('energia', energia);
  };

  const onSubmit = async (values: EquivalentFoodFormValues) => {
    if (!selectedFood) return;

    try {
      setIsSaving(true);

      if (!selectedFood.grupo_alimento) throw new AppException('Selecione um grupo alimentar');

      selectedFood.alimento = {
        ...selectedFood.alimento,
        ...values,
      };

      const group = listGroups.find((group) => group.name === values.grupo_alimento);

      if (!group) throw new AppException('Grupo alimentar não encontrado');

      const cachedGroupList = JSON.parse(localStorage.getItem('equivalentPlanListStore-' + group.id) ?? '');

      if (selectedFood.id) {
        const payload = { ...selectedFood, ...values, selectedGroup: undefined, selectedGroupOption: undefined };

        const { data } = await api.put(`/alimento-personalizado-lista-substituto/${selectedFood.id}`, payload);

        const cachePayload = cachedGroupList.map((food: Food) => {
          if (food.id === selectedFood.alimento.id) {
            return data;
          }

          return food;
        });

        localStorage.setItem('equivalentPlanListStore-' + group.id, JSON.stringify(cachePayload));

        props.onSubmit(data);
      } else {
        const payload = { ...selectedFood, ...values, selectedGroup: undefined, selectedGroupOption: undefined, id: undefined };
        const { data } = await api.post(`/alimento-personalizado-lista-substituto`, payload);

        cachedGroupList.push(data.alimento);

        localStorage.setItem('equivalentPlanListStore-' + group.id, JSON.stringify(cachedGroupList));

        props.onSubmit(data);
      }

      setShowEditCustomEquivalentFoodModal(false);
      setIsSaving(false);
      resetForm();
      notify('Alimento personalizado salvo com sucesso', 'Sucesso', 'check', 'success', false);
    } catch (error) {
      error instanceof AppException
        ? notify(error.message, 'Erro', 'close', 'danger')
        : notify('Ocorreu um erro ao salvar o alimento personalizado', 'Erro', 'close', 'danger', false);
      console.error(error);
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, setFieldValue, resetForm, values, touched, errors } = formik;

  useEffect(() => {
    if(selectedFood?.alimento) {
      setFieldValue('descricao_dos_alimentos', selectedFood.descricao_dos_alimentos ?? selectedFood.alimento.descricao_dos_alimentos);
      setFieldValue('medida', selectedFood.medida ?? selectedFood.alimento.medida);
      setFieldValue('grupo_alimento', selectedFood.grupo_alimento ?? selectedFood.alimento.grupo_alimento);
      setFieldValue('unidade', selectedFood.unidade ?? selectedFood.alimento.unidade);
      setFieldValue('gramas', selectedFood.gramas ?? selectedFood.alimento.gramas);
      setFieldValue('carboidrato', selectedFood.carboidrato ?? selectedFood.alimento.carboidrato);
      setFieldValue('proteina', selectedFood.proteina ?? selectedFood.alimento.proteina);
      setFieldValue('lipideos', selectedFood.lipideos ?? selectedFood.alimento.lipideos);
      setFieldValue('energia', selectedFood.energia ?? selectedFood.alimento.energia);
    } else {
      resetForm();
    }
  }, [showEditCustomEquivalentFoodModal]);

  return (
    <Modal
      show={showEditCustomEquivalentFoodModal}
      onHide={() => setShowEditCustomEquivalentFoodModal(false)}
      backdrop="static"
      className="modal-close-out"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Alimento Personalizado</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          {/* Name */}
          <Col md="6" className="mb-3">
            <div className="d-flex flex-column justify-content-center filled tooltip-end-top">
              <CsLineIcons icon="pepper" />
              <Form.Control
                placeholder="Digite o nome da refeição"
                type="text"
                value={values.descricao_dos_alimentos}
                name="descricao_dos_alimentos"
                onChange={handleChange}
              />
              {errors.descricao_dos_alimentos && touched.descricao_dos_alimentos && <div className="error">{errors.descricao_dos_alimentos}</div>}
            </div>
          </Col>

          {/* Eating Group */}
          <Col md="6" className="mb-3">
            <div className="d-flex flex-column justify-content-center filled tooltip-end-top">
              <CsLineIcons icon="radish" />
              <SelectEatingGroup formik={formik} />
              {errors.grupo_alimento && touched.grupo_alimento && <div className="error">{errors.grupo_alimento}</div>}
            </div>
          </Col>

          {/* Measure 1 */}
          <Col md="6" className="mb-3 pt-4">
            <div className="d-flex flex-column justify-content-center filled tooltip-end-top">
              <CsLineIcons icon="cook-hat" />
              <Form.Control placeholder="Medida Caseira 1" type="text" value={values.medida} name="medida" onChange={handleChange} />
              {errors.medida && touched.medida && <div className="error">{errors.medida}</div>}
            </div>
          </Col>

          {/* Measure 1 Values */}
          <Col md="6" className="mb-3 position-relative">
            {/* Labels */}
            <Row className="mx-0 position-absolute row w-100 pe-4 top-0">
              <Col className="px-0 text-center">
                <small className="text-muted mb-2">Qtd</small>
              </Col>

              <Col className="pe-0 text-center">
                <small className="text-muted mb-2">Peso</small>
              </Col>

              <Col className="pe-0 text-center">
                <small className="text-muted mb-2">Cho</small>
              </Col>

              <Col className="pe-0 text-center">
                <small className="text-muted mb-2">Ptn</small>
              </Col>

              <Col className="pe-0 text-center">
                <small className="text-muted mb-2">Lib</small>
              </Col>

              <Col className="pe-0 text-center">
                <small className="text-muted mb-2">Kcal</small>
              </Col>
            </Row>

            {/* Values */}
            <Row className="mx-0 pt-4">
              <Col className="px-0">
                <div className="d-flex flex-column justify-content-center filled tooltip-end-top">
                  <Form.Control className="ps-2 text-center" placeholder="Qtd" value={values.unidade} type="text" name="unidade" onChange={handleChange} />
                  {errors.unidade && touched.unidade && <div className="error transform-up-2">{errors.unidade}</div>}
                </div>
              </Col>

              <Col className="pe-0">
                <div className="d-flex flex-column justify-content-center filled tooltip-end-top">
                  <Form.Control className="ps-2 text-center" placeholder="Peso" value={values.gramas} type="text" name="gramas" onChange={handleChange} />
                  {errors.gramas && touched.gramas && <div className="error transform-up-2">{errors.gramas}</div>}
                </div>
              </Col>

              <Col className="pe-0">
                <div className="d-flex flex-column justify-content-center filled tooltip-end-top">
                  <Form.Control
                    className="ps-2 text-center"
                    placeholder="Cho"
                    value={values.carboidrato}
                    type="text"
                    name="carboidrato"
                    onChange={handleChangeCarbohydrate}
                  />
                  {errors.carboidrato && touched.carboidrato && <div className="error transform-up-2">{errors.carboidrato}</div>}
                </div>
              </Col>

              <Col className="pe-0">
                <div className="d-flex flex-column justify-content-center filled tooltip-end-top">
                  <Form.Control className="ps-2 text-center" placeholder="Ptn" value={values.proteina} type="text" name="proteina" onChange={handleChangeProtein} />
                  {errors.proteina && touched.proteina && <div className="error transform-up-2">{errors.proteina}</div>}
                </div>
              </Col>

              <Col className="pe-0">
                <div className="d-flex flex-column justify-content-center filled tooltip-end-top">
                  <Form.Control className="ps-2 text-center" placeholder="Lip" value={values.lipideos} type="text" name="lipideos" onChange={handleChangeLipid} />
                  {errors.lipideos && touched.lipideos && <div className="error transform-up-2">{errors.lipideos}</div>}
                </div>
              </Col>

              <Col className="pe-0">
                <div className="d-flex flex-column justify-content-center filled tooltip-end-top">
                  <Form.Control className="ps-2 text-center" placeholder="Kcal" value={values.energia} type="text" name="energia" onChange={handleChange} />
                  {errors.energia && touched.energia && <div className="error transform-up-2">{errors.energia}</div>}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mt-4 text-center">
          <p>
            Prévia do alimento na lista de substituição:
            <span className="ms-2 bg-base px-2 py-1 rounded">
              {values.descricao_dos_alimentos} - {values.unidade} {values.medida} ({values.gramas}g)
            </span>
          </p>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="mb-1 btn btn-primary">
          Salvar alterações
        </AsyncButton>
      </Modal.Footer>
    </Modal>
  );
}
