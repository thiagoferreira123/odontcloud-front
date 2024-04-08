import { Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import useCustomLayout from '../../../hooks/useCustomLayout';
import { LAYOUT } from '../../../constants';
import HtmlHead from '../../../components/html-head/HtmlHead';
import BreadcrumbList from '../../../components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import useForumTopicStore from '../hooks/ForumTopicStore';
import { AppException } from '../../../helpers/ErrorHelpers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import CreateTopicModal from '../modals/CreateTopicModal';
import { useCreateTopicModalStore } from '../hooks/modals/CreateTopicModalStore';
import { useAuth } from '../../Auth/Login/hook';
import { useState } from 'react';
import AsyncButton from '../../../components/AsyncButton';
import Answers from './Answers';

const PortfolioDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = useAuth((state) => state.user);

  const title = 'Fórum nutricional';
  const description = 'Portfolio Detail';

  const [isRemoving, setIsRemoving] = useState(false);

  const breadcrumbs = [
    { to: 'ferramentas/forum', text: 'Voltar para lista de tópicos' },
  ];

  useCustomLayout({ layout: LAYOUT.Boxed });

  const { getForumTopic, removeForum, addAnswer, updateAnswer } = useForumTopicStore();
  const { handleSelectTopic } = useCreateTopicModalStore();

  const getForumTopic_ = async () => {
    try {
      if (!id) throw new AppException('ID do tópico não informado');

      const response = await getForumTopic(+id);

      if (response === false) throw new Error('Erro ao buscar tópico');

      return response;
    } catch (error) {
      console.error(error);
      error instanceof AppException && alert('Erro ao exibir tópico');
      throw error;
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);

      if (!result.data?.id) throw new AppException('ID do tópico não informado');

      const response = await removeForum(result.data, queryClient);

      if (response === false) throw new Error('Erro ao remover tópico');

      navigate(-1);
    } catch (error) {
      console.error(error);
      error instanceof AppException && alert('Erro ao remover tópico');
      setIsRemoving(false);
    }
  };

  const result = useQuery({ queryKey: ['forum-topic', Number(id)], queryFn: getForumTopic_ });

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );
  else if (result.isError) return <div className="vh-100 w-100 d-flex align-items-center pb-5">Erro ao buscar tópicos do fórum</div>;

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="page-title-container">
        <Row>
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">{title}</h1>
            <BreadcrumbList items={breadcrumbs} />
          </Col>
        </Row>
      </div>

      <Row className="g-5">
        <Col xl="12">
          <Card className="mb-5">
            <Card.Body className="pb-0">
              <Row className="g-0 sh-6 mb-3">
                <Col xs="auto">
                  <img
                    src={result.data?.professional?.image ? result.data.professional.image : '/img/profile/profile-11.webp'}
                    className="card-img rounded-xl sh-6 sw-6"
                    alt="thumb"
                  />
                </Col>
                <Col>
                  <div className="d-flex flex-row ps-4 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{result.data?.professional?.nome_completo}</div>
                      <div className="text-small text-muted">{result.data?.professional?.especialidades}</div>
                    </div>
                  </div>
                </Col>
              </Row>
              <h4 className="mb-3">{result.data?.titulo}</h4>
              <div className="mb-4" dangerouslySetInnerHTML={{ __html: result.data?.mensagem ?? '' }}></div>
            </Card.Body>
            <Card.Footer className="border-0 pt-0">
              <Row className="align-items-center">
                <Col xs="6">
                  <Row className="g-0">
                    <Col xs="auto" className="pe-3">
                      <CsLineIcons icon="message" width={15} height={15} className="cs-icon icon text-primary me-1" />
                      <span className="align-middle">{result.data?.respostas.length ?? 0}</span>
                    </Col>
                  </Row>
                </Col>
                <Col xs="6">
                  {result.data?.profissional_id === user?.id ? (
                    <div className="d-flex align-items-center justify-content-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="btn-icon btn-icon-only ms-1"
                        onClick={() => result.data && handleSelectTopic(result.data)}
                      >
                        <CsLineIcons icon="edit" />
                      </Button>
                      <AsyncButton
                        isSaving={isRemoving}
                        variant="outline-primary"
                        size="sm"
                        loadingText=" "
                        className="btn-icon btn-icon-only ms-1"
                        onClickHandler={handleRemove}
                      >
                        <CsLineIcons icon="bin" />
                      </AsyncButton>
                    </div>
                  ) : null}
                </Col>
              </Row>
            </Card.Footer>
          </Card>
          {/* Details End */}

          <h2 className="small-title">Comentários da comunidade</h2>
          {result.data?.respostas && <Answers answers={result.data?.respostas} />}
        </Col>
      </Row>

      <CreateTopicModal />
    </>
  );
};

export default PortfolioDetail;
