import { Row } from 'react-bootstrap';
import AnswerItem from './AnswerItem';
import { useNotSignedAnswerStoreStore } from '../Hooks/NotSignedAnswerStore';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import Empty from '../../../components/Empty';
import ModalFormPreview from '../Modals/FormPreviewModal';
import CollectFilesModal from '../Modals/CollectFilesModal';
import ConfirmDeleteAnswer from '../Modals/ConfirmDeleteAnswerModal';

const FormAnsweredByPatient = () => {
  const { getNotSignedAnswerStores } = useNotSignedAnswerStoreStore();
  const getNotSignedAnswerStores_ = async () => {
    try {
      const response = await getNotSignedAnswerStores();

      if (response === false) throw new Error('Falha ao buscar formulários');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({
    queryKey: ['answered-forms'],
    queryFn: getNotSignedAnswerStores_,
  });

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );

  return (
    <Row className="g-0 sh-6">
      {!result.data?.length ? <Empty message="Não há formulários criados!" /> : result.data.map((answer) => <AnswerItem key={answer.id} answer={answer} />)}

      <ModalFormPreview />
      <CollectFilesModal />
      <ConfirmDeleteAnswer />
    </Row>
  );
};

export default FormAnsweredByPatient;
