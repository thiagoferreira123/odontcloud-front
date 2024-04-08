import React from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';

export default function RoadMap() {
  return (
    <>
      <Row>
        <Card >
          <Card.Body>
            <div className="border-bottommb-2 pb-2 text-center">
              <div>
                <h5>O OdontCloud, desenvolvido em 2020 por uma equipe de  Cirurgiões-Dentistas brasileiros e programadores, alcançou 5 mil usuários, e evoluiu para a Versão 1.0, incorporando tecnologias avançadas para maior rapidez e segurança na prática clínica. A Versão 1.0 ainda está em desenvolvimento, porém é possível monitorar nosso avanço aqui.</h5>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Row>

      <Row className="g-0 mt-5">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6" />
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        11
                        <br />
                        MAR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                          Painel do paciente <Badge className="bg-suscess">Concluído</Badge>  😎🚀
                        </Button>
                      </div>  
                      <div className="text-alternate">11.03.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        18
                        <br />
                        MAR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                          Anexo de materiais e compartilhamento do mesmo com o paciente. <Badge className="bg-suscess">Concluído </Badge> 😎🚀
                        </Button>
                      </div>
                      <div className="text-alternate">18.03.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      
      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        18
                        <br />
                        ABR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                          Lâminas nutricionais <Badge className="bg-suscess">Concluído </Badge> 😎🚀
                        </Button>
                      </div>
                      <div className="text-alternate">18.03.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        22
                        <br />
                        MAR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                          Rastreamento metabólico <Badge className="bg-suscess"> Concluído </Badge> 😎🚀
                        </Button>
                      </div>
                      <div className="text-alternate">25.03.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        22
                        <br />
                        MAR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                          Emitir recibo<Badge className="bg-suscess"> Concluído </Badge> 😎🚀
                        </Button>
                      </div>
                      <div className="text-alternate">22.03.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        22
                        <br />
                        MAR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                          Emitir atestado<Badge className="bg-suscess"> Concluído </Badge> 😎🚀
                        </Button>
                      </div>
                      <div className="text-alternate">22.03.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        01
                        <br />
                        ABR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                        Sinais e sintomas <Badge className="bg-suscess"> Concluído </Badge> 😎🚀
                        </Button>
                      </div>
                      <div className="text-alternate">01.04.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        08
                        <br />
                        ABR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                        Alerta de hidratação <Badge className="bg-suscess"> Concluído </Badge> 😎🚀
                        </Button>
                      </div>
                      <div className="text-alternate">08.04.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        12
                        <br />
                        ABR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                        Upload de fotos comparativas (antropometria) <Badge className="bg-suscess"> Concluído </Badge> 😎🚀
                        </Button>
                      </div>
                      <div className="text-alternate">12.04.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        17
                        <br />
                        ABR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                        Lista de condutas nutricionias <Badge className="bg-suscess"> Concluído </Badge> 😎🚀
                        </Button>
                      </div>
                      <div className="text-alternate">17.04.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        29
                        <br />
                        ABR
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                        Site pessoal <Badge className="bg-warning"> Em construçao</Badge>
                        </Button>
                      </div>
                      <div className="text-alternate">29.04.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        05
                        <br />
                        MAI
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                        Controle financeiro <Badge className="bg-warning"> Em construçao</Badge>
                        </Button>
                      </div>
                      <div className="text-alternate">05.05.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        10
                        <br />
                        MAI
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                        Blog pessoal <Badge className="bg-warning"> Em construçao</Badge>
                        </Button>
                      </div>
                      <div className="text-alternate">10.05.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      
      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        15
                        <br />
                        MAI
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                          Cursos <Badge className="bg-warning"> Em construçao</Badge>
                        </Button>
                      </div>
                      <div className="text-alternate">15.05.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        20
                        <br />
                        MAI
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                            Fórum <Badge className="bg-warning"> Em construçao</Badge>
                        </Button>
                      </div>
                      <div className="text-alternate">20.05.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-0">
        <Col xs="auto" className="sw-2 d-flex flex-column justify-content-center align-items-center position-relative me-4">
          <div className="w-100 d-flex sh-6 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
          <div className="bg-foreground sw-2 sh-2 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center position-relative">
            <div className="bg-gradient-light sw-1 sh-1 rounded-xl position-relative" />
          </div>
          <div className="w-100 d-flex h-100" />
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body>
              <Row className="g-0">
                <Col xs="auto">
                  <div className="d-inline-block d-flex">
                    <div className="bg-gradient-light sw-5 sh-5 rounded-md">
                      <div className="text-white d-flex justify-content-center align-items-center h-100 text-small text-center lh-1">
                        25
                        <br />
                        MAI
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Card.Body className="d-flex flex-column pe-0 pt-0 pb-0 h-100 justify-content-start">
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-column justify-content-center">
                        <Button variant="link" className="p-0 heading stretched-link text-start">
                        Envio de PDF's por WhatsApp <Badge className="bg-warning"> Em construçao</Badge>
                        </Button>
                      </div>
                      <div className="text-alternate">25.05.2024</div>
                    </div>
                  </Card.Body>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <div className="mt-2 text-center">
        <h5>Encontrou alguma falha ou gostaria de sugerir melhorias?</h5> <Button size="sm">Clique aqui</Button>
      </div> */}

    </>
  );
}
