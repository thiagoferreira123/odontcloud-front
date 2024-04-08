import React, { useCallback, useEffect, useImperativeHandle } from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useNavigate } from 'react-router-dom';
import api from '/src/services/useAxios';

import NotificationIcon from '/src/components/toast/NotificationIcon';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import usePatientMenuStore from '/src/pages/PatientMenu/hooks/patientMenuStore';
import { RecipeHistory } from '/src/types/ReceitaCulinaria';
import { useModalStore } from '../../hooks/ModalStore';
import { useRecipeStore } from '../../hooks/RecipeStore';

const FormConfiguration = (
  // eslint-disable-next-line no-unused-vars
  props: { setIsLoading: (isLoading: boolean) => void; handleCloseModal: () => void },
  ref: React.Ref<unknown> | undefined
) => {
  useImperativeHandle(ref, () => ({
    handleSubmit,
    reset,
  }));

  const history = useNavigate();

  const patientId = usePatientMenuStore((state) => state.patientId);
  const selectedRecipe = useModalStore((state) => state.selectedRecipe);

  const { updateRecipe, addRecipe } = useRecipeStore();

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Digite um nome valido.'),
  });

  const initialValues = { nome: '' };

  const onSubmit = async (values: { nome: string }) => {
    props.setIsLoading(true);

    if(!selectedRecipe) return console.error('selectedRecipe is null');

    try {
      const payload: Partial<RecipeHistory> = {
        ...values,
        id: selectedRecipe.id,
        id_paciente: patientId,
        receitas: [],
      };

      if (selectedRecipe.id) {
        const response = await api.patch('/receita-culinaria-historico/' + selectedRecipe.id, payload);
        updateRecipe({...selectedRecipe, ...response.data});
        notify('Receita culinaria atualizada com sucesso', 'Sucesso', 'prize');
      } else {
        const response = await api.post('/receita-culinaria-historico/', {...payload, id: undefined, data_cadastro: new Date()});
        addRecipe(response.data);
        history('/app/receita-culinaria/' + response.data.id);
        notify('Receita culinaria inserida com sucesso', 'Sucesso', 'prize');
      }

      props.setIsLoading(false);
      props.handleCloseModal();
    } catch (error) {
      props.setIsLoading(false);
      console.error(error);
      notify('Erro ao salvar receita culinária', 'Erro', 'error-hexagon');
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, resetForm, setValues, values, touched, errors } = formik;

  const reset = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const notify = (message: string, title: string, icon: string, status?: string) =>
    toast(<NotificationIcon message={message} title={title} icon={icon} status={status} />);

  useEffect(() => {
    if (!selectedRecipe) return;

    setValues({ nome: selectedRecipe.nome });
  }, [selectedRecipe, setValues]);

  return (
    <Form onSubmit={handleSubmit} className="tooltip-end-top">
      <label>As receitas culinárias estão agora disponíveis para o paciente por meio do aplicativo móvel, do painel do paciente e também podem ser fornecidas em formato PDF.</label>
      <div className="mb-3 filled mt-2">
        <CsLineIcons icon="cupcake" />
        <Form.Control type="text" name="nome" value={values.nome} onChange={handleChange} placeholder="Nome do receita culinária" />
        {errors.nome && touched.nome && <div className="error">{errors.nome}</div>}
      </div>
    </Form>
  );
};

export default React.forwardRef(FormConfiguration);
