import React from "react";
import { Accordion, Button, Card, Col, Row, useAccordionButton } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";

function CustomAccordionToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {});
    return (
        <Card.Body className="py-4" onClick={decoratedOnClick} role="button">
            <Button variant="link" className="list-item-heading p-0">
                {children}
            </Button>
        </Card.Body>
    );
}

const Pricing = () => {
    return (
        <>
            <h4 className="text-primary mb-3">Escolha o plano ideal para sua clínica ou consultório</h4>
            <div className="mb-5">
                <Row className="row-cols-1 row-cols-lg-3 g-2">
                    <Col>
                        <Card className="h-100 hover-scale-up">
                            <Card.Body className="pb-0">
                                <div className="d-flex flex-column align-items-center mb-4">
                                    <div className="bg-gradient-light sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center mb-2">
                                        <Icon.Gem className="text-white" size={18} />
                                    </div>
                                    <div className="cta-4 text-primary mb-1">Mensal</div>
                                    <div className="d-flex">
                                        {" "}
                                        <small>R$</small> <div className="display-4">47</div>
                                    </div>

                                    <div className="text-small text-muted mb-1">todos os meses.</div>
                                </div>
                                <p className="text-alternate mb-4 text-center">
                                    Ideal para clínicas que desejam flexibilidade, o Plano Mensal é perfeito para testar as funcionalidades do nosso software sem compromisso a longo prazo. Por apenas R$ 47 por mês, você tem acesso completo
                                    às ferramentas de gerenciamento de pacientes, agendamento de consultas e suporte técnico dedicado.
                                </p>
                            </Card.Body>
                            <Card.Footer className="pt-0 border-0">
                                <div className="mb-4">
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Emissão de orçamentos</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Estágio dos orçamentos</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Prontuário com odontograma</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Agenda eletrônica</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Alertas de retorno</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Anamnese</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Controle financeiro</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Emissão de receitas</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Emissão de atestados</Col>
                                    </Row>

                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Pacientes ilimitados</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Profissionais ilimitados</Col>
                                    </Row>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <Button className="blink-effect">
                                        <Icon.CartCheck size={20} /> <span>Assinar</span>
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="h-100 hover-scale-up">
                            <Card.Body className="pb-0">
                                <div className="d-flex flex-column align-items-center mb-4">
                                    <div className="bg-gradient-light sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center mb-2">
                                        <Icon.Gem className="text-white" size={18} />
                                    </div>
                                    <div className="cta-4 text-primary mb-1">Anual (10% OFF)</div>
                                    <div className="text-muted sh-3 line-through">R$ 574.8</div>
                                    <div className="text-muted sh-3" />
                                    <div className="d-flex">
                                        {" "}
                                        <small>R$</small> <div className="display-4">517</div>
                                    </div>
                                    <div className="text-small text-muted mb-1">a cada doze meses</div>
                                </div>
                                <p className="text-alternate mb-4 text-center">
                                    Para clínicas que procuram maximizar o custo-benefício, o Plano Anual oferece um desconto de 10%. Este plano é ideal para estabelecimentos que desejam uma solução robusta e contínua para gestão clínica.
                                    Com este plano, sua clínica poderá aproveitar ao máximo nossa plataforma, com todos os benefícios a um preço mais acessível ao longo do ano.
                                </p>
                            </Card.Body>
                            <Card.Footer className="pt-0 border-0">
                                <div className="mb-4">
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Emissão de orçamentos</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Estágio dos orçamentos</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Prontuário com odontograma</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Agenda eletrônica</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Alertas de retorno</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Anamnese</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Controle financeiro</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Emissão de receitas</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Emissão de atestados</Col>
                                    </Row>

                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Pacientes ilimitados</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Profissionais ilimitados</Col>
                                    </Row>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <Button className="blink-effect">
                                        <Icon.CartCheck size={20} /> <span>Assinar</span>
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="h-100 hover-scale-up">
                            <Card.Body className="pb-0">
                                <div className="d-flex flex-column align-items-center mb-4">
                                    <div className="bg-gradient-light sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center mb-2">
                                        <Icon.Gem className="text-white" size={18} />
                                    </div>
                                    <div className="cta-4 text-primary mb-1">Semestral (5% OFF)</div>
                                    <div className="text-muted sh-3 line-through">R$ 287.40</div>
                                    <div className="text-muted sh-3" />
                                    <div className="d-flex">
                                        {" "}
                                        <small>R$</small> <div className="display-4">270</div>
                                    </div>
                                    <div className="text-small text-muted mb-1">a cada seis meses.</div>
                                </div>
                                <p className="text-alternate mb-4 text-center">
                                    O Plano Semestral é a escolha econômica para clínicas que estão prontas para um compromisso de médio prazo. Com um desconto de 5%, esse plano permite uma economia significativa, mantendo acesso total a
                                    todas as funcionalidades do software, ajudando a otimizar os processos e a melhorar a eficiência do atendimento.
                                </p>
                            </Card.Body>
                            <Card.Footer className="pt-0 border-0">
                                <div className="mb-4">
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Emissão de orçamentos</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Estágio dos orçamentos</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Prontuário com odontograma</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Agenda eletrônica</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Alertas de retorno</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Anamnese</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Controle financeiro</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Emissão de receitas</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Emissão de atestados</Col>
                                    </Row>

                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Pacientes ilimitados</Col>
                                    </Row>
                                    <Row className="g-0 mb-2">
                                        <Col xs="auto">
                                            <div className="sw-3 me-1">
                                                <Icon.PatchCheck size={18} className="text-primary" />
                                            </div>
                                        </Col>
                                        <Col className="text-alternate">Profissionais ilimitados</Col>
                                    </Row>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <Button className="blink-effect">
                                        <Icon.CartCheck size={20} /> <span>Assinar</span>
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </div>

            <h4 className="text-primary mb-3">Perguntas frequentes</h4>
            <Accordion className="mb-n2" defaultActiveKey="1">
                <Card className="d-flex mb-2 flex-grow-1">
                    <CustomAccordionToggle eventKey="1">Quais são as formas de pagamento aceitas pelo software?</CustomAccordionToggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body className="pt-0">
                            <p>
                                Aceitamos todas as principais formas de pagamento, incluindo cartões de crédito e débito através do Stripe, garantindo processos de pagamento seguros e eficientes. Você pode escolher o plano que melhor se
                                adapta às necessidades da sua clínica e proceder com a assinatura usando a forma de pagamento de sua preferência.
                            </p>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card className="d-flex mb-2 flex-grow-1">
                    <CustomAccordionToggle eventKey="2">Posso mudar de plano a qualquer momento?</CustomAccordionToggle>
                    <Accordion.Collapse eventKey="2">
                        <Card.Body className="pt-0">
                            <p>
                                Sim, você pode alterar seu plano de assinatura a qualquer momento. Para fazer isso, basta acessar seu perfil no software e selecionar a opção de mudança de plano. A alteração será efetivada no próximo ciclo
                                de cobrança.
                            </p>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card className="d-flex mb-2 flex-grow-1">
                    <CustomAccordionToggle eventKey="3">Existem descontos para assinaturas mais longas?</CustomAccordionToggle>
                    <Accordion.Collapse eventKey="3">
                        <Card.Body className="pt-0">
                            <p>
                                Oferecemos descontos atrativos para compromissos mais longos. Nosso plano semestral vem com um desconto de 5% e o plano anual com um desconto de 10%. Esses descontos são aplicados automaticamente ao escolher
                                o plano durante o processo de assinatura.
                            </p>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card className="d-flex mb-2 flex-grow-1">
                    <CustomAccordionToggle eventKey="4"> Como funciona o período de teste do software?</CustomAccordionToggle>
                    <Accordion.Collapse eventKey="4">
                        <Card.Body className="pt-0">
                            <p>
                                Oferecemos um período de teste para que você possa avaliar o software antes de se comprometer com uma assinatura paga. Durante o período de teste, você terá acesso completo às funcionalidades do software. Não
                                é necessário fornecer informações de pagamento até que você decida assinar um dos planos.
                            </p>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card className="d-flex mb-2 flex-grow-1">
                    <CustomAccordionToggle eventKey="5">O que acontece se eu decidir cancelar minha assinatura?</CustomAccordionToggle>
                    <Accordion.Collapse eventKey="5">
                        <Card.Body className="pt-0">
                            <p>
                                Você pode cancelar sua assinatura a qualquer momento através do seu perfil no software. O acesso aos serviços continuará até o final do ciclo de cobrança atual, e não haverá cobranças adicionais após o
                                cancelamento. Não aplicamos taxas de cancelamento, permitindo que você faça essa escolha sem preocupações adicionais.
                            </p>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </>
    );
};

export default Pricing;
