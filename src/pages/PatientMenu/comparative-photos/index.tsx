import { Card, Nav, Tab } from 'react-bootstrap';
import FrontPane from './panes/FrontPane';
import { useParams } from 'react-router-dom';
import useComparativePhotosStore from './hooks';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import SidePane from './panes/SidePane';
import BackPane from './panes/BackPane';

export default function ComparativePhotos() {

  const { id } = useParams<{ id: string }>();

  const { getComparativePhotosDetail } = useComparativePhotosStore();

  const getComparativePhotosDetail_ = async () => {
    try {

      if (!id) throw new Error('Patient id not found');

      const response = await getComparativePhotosDetail(+id);

      if(response === false) throw new Error('Error getting photos');

      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        console.error(error);
        return [];
      }

      throw error;
    }
  }

  const result = useQuery({ queryKey: ['antropometria-foto', Number(id)], queryFn: getComparativePhotosDetail_ });

  if(result.isLoading) {
    return (
      <Card>
        <Card.Body className="mb-n3 text-center sh-40">
          <StaticLoading />
        </Card.Body>
      </Card>
    );
  } else if(result.isError) {
    return (
      <Card>
        <Card.Body className="mb-n3 text-center sh-40">
          <div>Erro ao buscar alerta!</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-3">
        <Tab.Container defaultActiveKey="First">
          <Card.Header className="border-0 pb-0">
            <Nav className="nav-tabs-line" variant="tabs" activeKey="First">
              <Nav.Item>
                <Nav.Link eventKey="First" className="font-weight-bold">
                  Fotos de frente
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Second" className="font-weight-bold">
                  Fotos de lado
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Third" className="font-weight-bold">
                  Fotos de costa
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <FrontPane photos={result.data?.filter(photo => photo.section === 'UM') ?? []} />

              <SidePane photos={result.data?.filter(photo => photo.section === 'DOIS') ?? []} />

              <BackPane photos={result.data?.filter(photo => photo.section === 'TRES') ?? []} />
            </Tab.Content>
            <p className="text-center text-medium">
              {' '}
              Alertamos que o upload de imagens de pacientes é de inteira responsabilidade do usuário. O DietSystem não se responsabiliza por quaisquer
              consequências negativas que possam surgir em decorrência desse procedimento.
            </p>
          </Card.Body>
        </Tab.Container>
      </Card>
    </>
  );
}
