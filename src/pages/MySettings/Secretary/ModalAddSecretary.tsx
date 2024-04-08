import Select, { components, ControlProps, GroupBase, SingleValue } from 'react-select';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import * as Yup from 'yup';
import { useModalAddSecretaryStore } from './hooks/ModalAddSecretaryStore';
import { Option } from '../../../types/inputs';
import { Secretary, useSecretaryStore } from '../../../hooks/professional/SecretaryStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncButton from '../../../components/AsyncButton';
import StaticLoading from '../../../components/loading/StaticLoading';
import { useServiceLocationStore } from '../../../hooks/professional/ServiceLocationStore';

interface FormValues {
  name: string;
  email: string;
  senha: string;
  id_local: number;
}

const ModalAddSecretary = () => {
  const showModal = useModalAddSecretaryStore((state) => state.showModal);
  const selectedSecretary = useModalAddSecretaryStore((state) => state.selectedSecretary);

  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
    .email('Insira um e-mail válido')
    .required('O campo e-mail é obrigatório'),
    senha: Yup.string().required('Uma senha é obrigatória'),
    id_local: Yup.number().min(1, 'Selecionar um local de atendimento é obrigatório').required('Selecionar um local de atendimento é obrigatório'),
  });
  const initialValues: FormValues = { name: '', email: '', senha: '', id_local: 0 };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);

      const payload: Partial<Secretary> = {
        nome: values.name,
        email: values.email,
        senha: values.senha,
        id_local: values.id_local,
      };

      if (selectedSecretary) {
        const response = await updateSecretary({ ...selectedSecretary, ...payload }, queryClient);

        if (!response) throw new Error('Erro ao atualizar secetária(o) ');

        setIsSaving(false);
      } else {
        const response = await addSecretary(payload, queryClient);

        if (!response) throw new Error('Erro ao cadastrar secetária(o)');

        setIsSaving(false);
      }

      handleHideModal();
      resetForm();
    } catch (error) {
      setIsSaving(false);
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });

  const { handleSubmit, handleChange, setValues, resetForm, values, touched, errors, setFieldValue } = formik;
  const { handleHideModal } = useModalAddSecretaryStore();
  const { updateSecretary, addSecretary } = useSecretaryStore();
  const { getServiceLocations } = useServiceLocationStore();

  const [selectedLocal, setSelectValue] = useState<Option>();

  const onChangeLocationSelect = (selectedOption: SingleValue<Option>) => {
    if (!selectedOption) return;

    setFieldValue('id_local', Number(selectedOption.value));
    setSelectValue(selectedOption);
  };

  const getServiceLocations_ = async () => {
    try {
      const response = await getServiceLocations();

      if (response === false) throw new Error('Error on get service locations');

      return response;
    } catch (error) {
      console.error('Error on get service locations', error);
      throw error;
    }
  };

  const resultLocals = useQuery({ queryKey: ['locals'], queryFn: getServiceLocations_ });

  useEffect(() => {
    setValues({ name: selectedSecretary?.nome ?? '', email: selectedSecretary?.email ?? '', senha: '', id_local: selectedSecretary?.id_local ?? 0 });

    if (resultLocals.data) {
      const local = resultLocals.data.find((local) => local.id === selectedSecretary?.id_local);
      local && setSelectValue({ value: local.id.toString(), label: local.nome } as Option);
    }

  }, [resultLocals.data, selectedSecretary?.email, selectedSecretary?.id_local, selectedSecretary?.nome, setValues]);

  const Control = ({ children, ...props }: ControlProps<Option, boolean, GroupBase<Option>>) => {
    return (
      <components.Control {...props} className="form-floating">
        {children}
        <label>Local de atendimento</label>
      </components.Control>
    );
  };

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={handleHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastrar um acesso na agenda</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} name="add_secretary">
          {resultLocals.isLoading ? (
            <StaticLoading />
          ) : (
            <div className="mb-3">
              <Select
                classNamePrefix="react-select"
                name="consultationLocation"
                options={resultLocals.data?.map((local) => ({ value: local.id.toString(), label: local.nome } as Option))}
                value={selectedLocal}
                onChange={(o) => onChangeLocationSelect(o as SingleValue<Option>)}
                placeholder=""
                components={{ Control }}
              />
            </div>
          )}
          {errors.id_local && touched.id_local && <div className="error">{errors.id_local}</div>}

          <div className="mb-3 mt-2 top-label d-flex">
            <Form.Control type="text" name="name" value={values.name} onChange={handleChange} />
            <Form.Label>NOME</Form.Label>
          </div>
          {errors.name && touched.name && <div className="error">{errors.name}</div>}

          <div className="mb-3 mt-2 top-label d-flex">
            <Form.Control
              type="text"
              name="email"
              value={values.email}
              onChange={handleChange}
              autoComplete="off" // Adiciona esta linha
            />
            <Form.Label>EMAIL</Form.Label>
          </div>
          {errors.email && touched.email && <div className="error">{errors.email}</div>}

          <div className="mb-3 top-label d-flex">
            <Form.Control type="password" name="senha" value={values.senha} onChange={handleChange} autoComplete="senha" autoCorrect="new-senha" />
            <Form.Label>SENHA</Form.Label>
          </div>
          {errors.senha && touched.senha && <div className="error">{errors.senha}</div>}

          <div className="text-center">
            <AsyncButton isSaving={isSaving} type="submit">
              Cadastrar
            </AsyncButton>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddSecretary;
