import { Row, Col, Card, NavLink, Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import useLayout from '../../hooks/useLayout';
import useProfessionalSiteStore from '../ProfessionalWebsite/hooks';
import { useParams } from 'react-router-dom';
import { AppException } from '../../helpers/ErrorHelpers';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import { notify } from '../../components/toast/NotificationIcon';
import { useEffect } from 'react';
import { darkenHex, getSecondaryHex, hexToRgb } from '../../helpers/ColorHekper';
import { Link } from 'react-router-dom';

const queryClient = new QueryClient();

const ProfessionalWebsitePreview = () => {
  useLayout();

  const { websiteUrl } = useParams<{ websiteUrl: string }>();

  const { getSiteByUrl } = useProfessionalSiteStore();

  const getSiteByUrl_ = async () => {
    try {
      if (!websiteUrl) throw new AppException('URL não informada');

      const response = await getSiteByUrl(websiteUrl);

      if (!response) throw new Error('Site não encontrado');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['professionalSite', websiteUrl], queryFn: getSiteByUrl_ });

  useEffect(() => {
    result.data?.websiteColor && document.documentElement.style.setProperty('--primary', result.data.websiteColor);
    result.data?.websiteColor && document.documentElement.style.setProperty('--primary-rgb', hexToRgb(result.data.websiteColor));
    result.data?.websiteColor && document.documentElement.style.setProperty('--primary-darker', darkenHex(result.data.websiteColor, 30));
    result.data?.websiteColor && document.documentElement.style.setProperty('--secondary', getSecondaryHex(result.data.websiteColor));
    result.data?.websiteColor && document.documentElement.style.setProperty('--gradient-1', result.data.websiteColor);
    result.data?.websiteColor && document.documentElement.style.setProperty('--gradient-1-lighter', result.data.websiteColor);

    return () => {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-rgb');
      document.documentElement.style.removeProperty('--primary-darker');
      document.documentElement.style.removeProperty('--secondary');
      document.documentElement.style.removeProperty('--gradient-1');
      document.documentElement.style.removeProperty('--gradient-1-lighter');
    }
  }, [result.data]);

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );
  else if (result.isError) {
    console.error(result.error);
    notify('Erro ao buscar dados', 'Erro', 'close', 'danger');
  }

  return (
    <div>
      <Row
        className="text-center justify-content-center m-0 sh-70"
        style={{ background: `url(${result.data?.backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
      >
        <Col xl="4">
          <Card className="transform-down-56">
            <Card.Body>
              <div className="d-flex align-items-center flex-column">
                <div className="d-flex align-items-center flex-column">
                  <div className="sw-13 position-relative mb-3">
                    <img
                      src={result.data?.professionalPhotoLink ? result.data.professionalPhotoLink : '/img/profile/profile-1.webp'}
                      className="img-fluid rounded-xl sh-12 sw-12"
                      alt="thumb"
                    />
                  </div>
                  <div className="h4"> <strong>{result.data?.professional?.nome_completo}</strong></div> <div className="text-muted">{result.data?.impactPhrase ?? ''}</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-5 text-center justify-content-center m-0 mt-12">
        <Col xl="8">
          <Card className="mt-2">
            <Card.Body>
              <Row className="g-0 align-items-center mb-2">
                <Col xs="auto">
                  <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                    <Icon.HeartFill className="text-primary" />
                  </div>
                </Col>
                <Col className="ps-3">
                  <Row className="g-0">
                    <Col>
                      <div className="sh-5 d-flex align-items-center lh-1-25">
                        <Button variant="link" className="p-0 pt-1 heading text-start">
                          SOBRE MIM
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Col xs="auto">
                <div className="d-flex text-start">{result.data?.aboutMe ?? ''}</div>
              </Col>
            </Card.Body>
          </Card>

          {result.data?.specialities.length ? (
            <Card className="mb-3 mt-3 text-start">
              <Card.Body>
                {result.data?.specialities.map((speciality, index) => (
                  <Row className="g-0" key={speciality.id}>
                    <Col xs="auto" className="sw-1 d-flex flex-column justify-content-center align-items-center position-relative me-4">
                      {index ? (
                        <div className="w-100 d-flex sh-1 position-relative justify-content-center">
                          <div className="line-w-1 bg-separator h-100 position-absolute" />
                        </div>
                      ) : (
                        <div className="w-100 d-flex sh-1" />
                      )}
                      <div className="rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
                        <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
                      </div>
                      {index < result.data.specialities.length - 1 ? (
                        <div className="w-100 d-flex h-100 justify-content-center position-relative">
                          <div className="line-w-1 bg-separator h-100 position-absolute" />
                        </div>
                      ) : (
                        <div className="w-100 d-flex h-100 justify-content-center position-relative" />
                      )}
                    </Col>
                    <Col className="mb-4">
                      <div className="h-100">
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex flex-column">
                            <Button variant="link" className="p-0 pt-1 heading text-start">
                              {speciality.specialityName}
                            </Button>
                            <div className="text-muted mt-1">{speciality.specialityDescription}</div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))}
              </Card.Body>
            </Card>
          ) : null}

          {result.data?.services.length ? (
            <Row className="g-2 mb-5 text-center justify-content-center">
              {result.data?.services.map((service) => (
                <Col sm="6" lg="4" key={service.id}>
                  <Card className="hover-border-primary">
                    <Card.Body>
                      <Button variant="link" className="p-0 pt-1 heading text-start">
                        {service.serviceName}
                      </Button>
                      <p>{service.serviceDescription}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : null}

          {result.data?.professional?.locationsService?.length ? (
            <Card className="mt-2">
              <Card.Body>
                <Row className="g-0 align-items-center mb-2">
                  <Col xs="auto">
                    <div className="border border-primary sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center">
                      <Icon.Pin className="text-primary" />
                    </div>
                  </Col>
                  <Col className="ps-3">
                    <Row className="g-0">
                      <Col>
                        <div className="sh-5 d-flex align-items-center lh-1-25">
                          <Button variant="link" className="p-0 pt-1 heading text-start">
                            Local de atendimento
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {result.data.professional.locationsService.map((location) => (
                  <Col xs="auto" key={location.id}>
                    <div className="text-center mb-1  mt-4">
                      <strong>{location.nome}</strong>
                      <p>{location.endereco_completo}</p>
                      <Link to={`/local-atendimento/${btoa(location.id.toString())}`} className="mb-2 btn btn-primary">
                        Agendar consulta
                      </Link>
                    </div>
                  </Col>
                ))}
              </Card.Body>
            </Card>
          ) : null}

          <div className="mb-5 mt-4 text-start d-flex flex-wrap">
            <Col xs={12} md={6}>
              {result.data?.professional?.email ? (
                <NavLink href={`mailto:${result.data?.professional?.email}`} className="d-block body-link mb-1">
                  <Icon.Envelope className="me-2 text-primary" />
                  <span className="align-middle">{result.data?.professional?.email}</span>
                </NavLink>
              ) : null}
              {result.data?.instagram ? (
                <NavLink href={`https://www.instagram.com/${result.data?.instagram}/`} target="_blank" className="d-block body-link mb-1">
                  <Icon.Instagram className="me-2 text-primary" />
                  <span className="align-middle">@{result.data?.instagram}</span>
                </NavLink>
              ) : null}
              {result.data?.youtube ? (
                <NavLink href={`https://www.youtube.com/${result.data?.youtube}/`} target="_blank" className="d-block body-link mb-1">
                  <Icon.Youtube className="me-2 text-primary" />
                  <span className="align-middle">{result.data?.youtube}</span>
                </NavLink>
              ) : null}
            </Col>
            <Col xs={12} md={6}>
              {result.data?.linkedin ? (
                <NavLink href={`https://www.linkedin.com/in/${result.data?.linkedin}/`} target="_blank" className="d-block body-link mb-1">
                  <Icon.Linkedin className="me-2 text-primary" />
                  <span className="align-middle">{result.data?.linkedin}</span>
                </NavLink>
              ) : null}
              {result.data?.facebook ? (
                <NavLink href={`https://www.fb.com/${result.data?.facebook}/`} target="_blank" className="d-block body-link mb-1">
                  <Icon.Facebook className="me-2 text-primary" />
                  <span className="align-middle">{result.data?.facebook}</span>
                </NavLink>
              ) : null}
              {result.data?.whatsapp ? (
                <NavLink href={`https://api.whatsapp.com/send?phone=55${result.data?.whatsapp}`} target="_blank" className="d-block body-link mb-1">
                  <Icon.Whatsapp className="me-2 text-primary" />
                  <span className="align-middle">+ 55 {result.data?.whatsapp}</span>
                </NavLink>
              ) : null}
            </Col>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const Main = () => {
  useLayout();

  return (
    <QueryClientProvider client={queryClient}>
      <ProfessionalWebsitePreview />
    </QueryClientProvider>
  );
};

export default Main;
