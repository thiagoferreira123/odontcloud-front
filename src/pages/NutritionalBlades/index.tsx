import React from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import HtmlHead from '../../components/html-head/HtmlHead';
import * as Icon from 'react-bootstrap-icons';
import { useNutritionalBlades } from './hooks';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import { Link } from 'react-router-dom';

const NutritionalBlades = () => {
  const title = 'Lâminas Nutricionais';

  const { getNutritionalBlades } = useNutritionalBlades();

  const getNutritionalBlades_ = async () => {
    try {
      const response = await getNutritionalBlades();

      if (response === false) throw new Error('Error fetching nutritional blades');

      return response;
    } catch (error) {
      console.error('Error fetching nutritional blades:', error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['nutritionalBlades'], queryFn: getNutritionalBlades_ });

  return (
    <>
      <HtmlHead title={title} />
      {/* Title Start */}
      <div className="page-title-container">
        <h1 className="mb-0 pb-0 display-4">{title}</h1>
      </div>
      {/* Title End */}

      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4">
        {result.isLoading ? (
          <div className="vh-100 w-100 d-flex align-items-center pb-5">
            <StaticLoading />
          </div>
        ) : result.isError ? (
          <div className="vh-100 w-100 d-flex align-items-center pb-5">
            <p className="text-danger">Erro ao carregar lâminas nutricionais</p>
          </div>
        ) : (
          result.data?.map((blade) => (
            <Col key={blade.id} className="mb-5"> 
              <Card className="h-100">
                <Badge bg="warning" className="me-1 position-absolute e-3 t-n2 z-index-1">
                  Apenas para usuários PREMIUM 💎
                </Badge>
                <Card.Img src={`/img/laminas/${blade.id}.webp`} className="card-img-top sh-22" alt="card image" />
                <Card.Body className="text-center">
                  <h5 className="heading mb-0">{blade.titulo}</h5>
                </Card.Body>
                <Card.Footer className="border-0 pt-0 text-center">
                  <div className="mb-2">
                    {blade.link_aws ? (
                      <Link to={blade.link_aws} target="_blank" download className="btn btn-primary btn-lg ms-1">
                        <Icon.Download size={20} className="me-2" /> Download
                      </Link>
                    ) : (
                      <button disabled className="btn btn-primary btn-lg ms-1">
                        <Icon.Lock size={20} className="me-2" /> Assine para ter acesso
                      </button>
                    )}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </>
  );
};

export default NutritionalBlades;
