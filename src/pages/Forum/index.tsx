import { Button, Card, Row } from 'react-bootstrap';
import CreateTopicModal from './modals/CreateTopicModal';
import useForumTopicStore from './hooks/ForumTopicStore';
import { AppException } from '../../helpers/ErrorHelpers';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import Empty from '../../components/Empty';
import { useSearchParams } from 'react-router-dom';
import { useCreateTopicModalStore } from './hooks/modals/CreateTopicModalStore';
import ForumTopicFilter from './ForumTopicFilter';
import { useForumTopicFilterStore } from './hooks/ForumTopicFilterStore';
import { escapeRegexCharacters } from '../../helpers/SearchFoodHelper';
import TopicRow from './TopicRow';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';

export default function Forum() {
  let [searchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const query = useForumTopicFilterStore((state) => state.query);
  const categories = useForumTopicFilterStore((state) => state.categories);

  const { getForumTopics } = useForumTopicStore();
  const { handleShowModal } = useCreateTopicModalStore();

  const getForumTopics_ = async () => {
    try {
      const response = await getForumTopics(page, limit);

      if (response === false) throw new AppException('Erro ao buscar tópicos do fórum');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['forum-topics', page, limit], queryFn: getForumTopics_ });
  const filteredTopics =
    result.data?.data.filter((topic) => {
      return (
        escapeRegexCharacters(topic.titulo).includes(escapeRegexCharacters(query)) &&
        (!categories.length || topic.categories.some((category) => categories.includes(category.id)))
      );
    }) ?? [];

  return (
    <>
      <Row className="mb-5">
        <Card>
          <Card.Body>
            <div className="border-bottom mb-2 pb-2 text-center">
              <div>
                <p>
                  O Fórum de Discussões é uma funcionalidade projetada para permitir que  Cirurgiões-Dentistas compartilhem e debatam estudos de casos, pesquisas e
                  experiências profissionais em um ambiente colaborativo. Este espaço é dedicado a enriquecer o conhecimento coletivo, promovendo a troca de
                  informações e estratégias inovadoras no campo da nutrição. Os usuários podem criar novos tópicos de discussão, responder a perguntas
                  existentes e participar de debates para explorar diversas perspectivas sobre assuntos relevantes ao exercício da nutrição.
                </p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <h5>Gostaria de iniciar um tópico?</h5>{' '}
              <Button size="lg" onClick={handleShowModal}>
                Clique aqui
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Row>

      <ForumTopicFilter />

      {result.isLoading ? (
        <div className="sh-50 w-100 d-flex align-items-center pb-5">
          <StaticLoading />
        </div>
      ) : !filteredTopics.length ? (
        <div className="sh-40">
          <Empty message="Nenhum tópico encontrado" />
        </div>
      ) : (
        <WindowScroller>
          {({ height, isScrolling, scrollTop, onChildScroll }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  autoHeight // A altura é gerenciada pelo WindowScroller
                  width={width}
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  rowCount={filteredTopics.length} // Número total de itens na lista
                  rowHeight={150} // Altura de cada linha/item
                  rowRenderer={({ key, index, style }) => <TopicRow key={key} index={index} style={style} data={filteredTopics} />}
                  scrollTop={scrollTop} // Posição atual do scroll
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}

      <CreateTopicModal />
    </>
  );
}
