import FormListItem from './FormListItem';
import { useFormStore } from '../../FormPatientRegistered/hooks/FormStore';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import SendFormToWhatsAppModal from '../Modals/SendFormToWhatsAppModal';
import SendFormToEmailModal from '../Modals/SendFormToEmailModal';
import ConfirmDeleteFormModal from '../Modals/ConfirmDeleteFormModal';

const FormRegisteredByUser = () => {
  const { getForms } = useFormStore();
  const getForms_ = async () => {
    try {
      const response = await getForms();

      if (response === false) throw new Error('Falha ao buscar formulários');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({
    queryKey: ['forms'],
    queryFn: getForms_,
  });

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  return (
    <div className="mb-2 pb-2">
      {!result.data?.length ? <Empty message="Não há formulários criados!" /> : result.data.map((form) => <FormListItem key={form.id} form={form} />)}

      <SendFormToEmailModal />
      <SendFormToWhatsAppModal />
      <ConfirmDeleteFormModal />
    </div>
  );
};

export default FormRegisteredByUser;
