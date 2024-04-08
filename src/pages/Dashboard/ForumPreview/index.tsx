import * as Icon from 'react-bootstrap-icons';
import React from 'react';
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useForumPreviewStore } from './hooks';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import { convertTimeToSimple, formatDateMonthToHumanReadable } from '../../../helpers/DateHelper';
import { appRoot } from '../../../routes';
import { Link } from 'react-router-dom';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

const ForumPreview = () => {
  const { getForumPreview } = useForumPreviewStore();

  const getForumPreview_ = async () => {
    try {
      const response = await getForumPreview();

      if (response === false) throw new Error('Error on getForumPreview');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['getForumPreview'], queryFn: getForumPreview_ });

  return (
    <Card>
      <Card.Body className="mb-n2">
        <Row className="g-0 mb-4">
          <Col xs="auto">
            <div className="d-inline-block d-flex">
              <div className="bg-gradient-light sw-6 sh-6 rounded-xl">
                <div className="text-white d-flex justify-content-center align-items-center h-100">
                  <Icon.Book size={20} />
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <div className="d-flex flex-column pt-0 pb-0 ps-3 pe-4 h-100 justify-content-center">
              <div className="d-flex flex-column">
                <div className="text-alternate mt-n1 lh-1-25">Últimos tópicos do fórum</div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="scroll-out">
          <div className="override-native overflow-auto sh-28 pb-4 pe-3">
            {result.isLoading ? (
              <div className="sh-20 d-flex align-items-center">
                <StaticLoading />
              </div>
            ) : result.isError ? (
              <div className="sh-20 d-flex align-items-center">Erro ao buscar tópicos</div>
            ) : !result.data?.length ? (
              <div className="sh-20 d-flex justify-content-center align-items-center">
                <div className="h-100 p-4 text-center align-items-center d-flex flex-column justify-content-center">
                  <div className="d-flex flex-column justify-content-center align-items-center sh-5 sw-5 rounded-xl bg-gradient-primary mb-2">
                    <Icon.Camera />
                  </div>
                  <p className="mb-0 lh-1">Não há tópicos para hoje</p>
                </div>
              </div>
            ) : (
              result.data.map((topic) => (
                <div className="border-bottom border-separator-light mb-2 pb-2" key={topic.id}>
                  <Row className="g-0 sh-4 row">
                    <Col xs="auto">
                      <img
                        src={topic.professional?.image ? topic.professional.image : '/img/profile/profile-1.webp'}
                        className="card-img rounded-xl sh-4 sw-4"
                        alt="thumb"
                      />
                    </Col>
                    <Col>
                      <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                          <div className="text-alternate ">{topic.titulo.charAt(0).toUpperCase() + topic.titulo.slice(1).toLowerCase()}
                          </div>
                        <div className="text-small">{topic.professional?.nome_completo ?? 'Desconhecido'}</div>
                        </div>
                        <div className="d-flex">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Visualizar tópico</Tooltip>}>
                            <Link className="ms-1 btn btn-sm btn-outline-primary btn-icon btn-icon-end" to={`${appRoot}/ferramentas/forum/${topic.id}`}>
                              <CsLineIcons icon="eye" />
                            </Link>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ForumPreview;
