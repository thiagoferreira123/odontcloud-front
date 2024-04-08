import React, { useState } from "react";
import { Badge, Button, Card, Dropdown, DropdownButton, Form, OverlayTrigger, ButtonGroup, Table, Tooltip, Col, Row } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import ModalPaymentConditions from "./modals/ModalPaymentConditions";
import SelectMultiple from "./modals/SelectMultiple";

export default function Budget() {
    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);

    return (
        <>
            <h3 className="medium-title">Orçamento</h3>
            <Icon.InfoCircleFill /> Não é feito nenhum tipo de cobrança ao gerar um orçamento; <br></br>
            <Icon.InfoCircleFill /> O orçamento será registrado em nosso sistema para sua consulta, orientação e controle a qualquer momento.
            <Card body className="mb-2 mt-3">
                <div>
                    <Col xs="4" className="mb-3">
                        <Form.Label className="d-block">
                            <strong>Profissional</strong>
                        </Form.Label>
                        <SelectMultiple />
                    </Col>
                </div>
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">Procedimentos</th>
                            <th scope="col">Dente e faces</th>
                            <th scope="col">Valor R$</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>
                                Acompanhamento de tratamento/procedimento cirúrgico em odontologia
                            </th>
                            <td>28 C, D, M, O, P, V</td>
                            <td><Form.Control type="text" name="observation" className="w-40" /></td>
                            <td>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Remover procedimento</Tooltip>}>
                                    <Button size="sm" className="me-1" variant="outline-primary">
                                        <Icon.TrashFill />
                                    </Button>
                                </OverlayTrigger>{" "}
                            </td>
                        </tr>
                        <tr>
                            <th>
                                Acompanhamento de tratamento/procedimento cirúrgico em odontologia
                            </th>
                            <td>28 C, D, M, O, P, V</td>
                            <td><Form.Control type="text" name="observation" className="w-40" /></td>
                            <td>
                                <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Remover procedimento</Tooltip>}>
                                    <Button size="sm" className="me-1" variant="outline-primary">
                                        <Icon.TrashFill />
                                    </Button>
                                </OverlayTrigger>{" "}
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <div className="text-end">
                    <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Adicionar procedimento</Tooltip>}>
                        <Button size="sm" className="me-1" variant="outline-primary">
                            <Icon.Plus />
                        </Button>
                    </OverlayTrigger>{" "}
                </div>
                <div className="text-center mt-5">
                    <h5> O valor total do orçamento é de <strong>R$ 3.000,00</strong></h5>
                    <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Crie condições de pagamento para o paciente</Tooltip>}>
                        <Button size="sm" className="me-1" variant="primary" onClick={() => setShowModal(true)}>
                            Criar condições <Icon.Cash />
                        </Button>
                    </OverlayTrigger>{" "}
                    <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Remover procedimento</Tooltip>}>
                        <Button size="sm" className="me-1" variant="outline-primary">
                            <Icon.TrashFill />
                        </Button>
                    </OverlayTrigger>{" "}
                    <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Download do Orçamento</Tooltip>}>
                        <Button size="sm" className="me-1" variant="outline-primary">
                            <Icon.Printer />
                        </Button>
                    </OverlayTrigger>{" "}
                </div>
            </Card>

            <h3 className="medium-title mt-4">Histórico de pagamentos</h3> 
            
            <div>
                <Row className="g-2">
                    <Col lg="6" xxl="3">
                        <Card>
                            <Card.Body>
                                <Row className="g-0 align-items-center">
                                    <Col xs="auto">
                                        <div className="bg-gradient-danger sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                                            <Icon.Clock className="text-white" size={20}/>
                                        </div>
                                    </Col>
                                    <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                                        <div className="heading mb-0 d-flex align-items-center lh-1-25">Total atrasado</div>
                                        <Row className="g-0">
                                            <Col xs="auto">
                                                <div className="cta-3 text-primary">R$ 350,0</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="6" xxl="3">
                        <Card>
                            <Card.Body>
                                <Row className="g-0 align-items-center">
                                    <Col xs="auto">
                                        <div className="bg-gradient-warning sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                                        <Icon.Calendar className="text-white" size={20}/>
                                        </div>
                                    </Col>
                                    <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                                        <div className="heading mb-0 d-flex align-items-center lh-1-25">Total a vencer hoje</div>
                                        <Row className="g-0">
                                            <Col xs="auto">
                                                <div className="cta-3 text-primary">R$ 12,50</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="6" xxl="3">
                        <Card>
                            <Card.Body>
                                <Row className="g-0 align-items-center">
                                    <Col xs="auto">
                                        <div className="bg-gradient-light    sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                                            <Icon.ClockHistory className="text-white" size={20}/>
                                        </div>
                                    </Col>
                                    <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                                        <div className="heading mb-0 d-flex align-items-center lh-1-25">Total em aberto</div>
                                        <Row className="g-0">
                                            <Col xs="auto">
                                                <div className="cta-3 text-primary">R$ 66,0</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg="6" xxl="3">
                        <Card>
                            <Card.Body>
                                <Row className="g-0 align-items-center">
                                    <Col xs="auto">
                                        <div className="bg-gradient-light sw-6 sh-6 rounded-md d-flex justify-content-center align-items-center">
                                        <Icon.Check className="text-white" size={20}/>
                                        </div>
                                    </Col>
                                    <Col className="sh-6 ps-3 d-flex flex-column justify-content-center">
                                        <div className="heading mb-0 d-flex align-items-center lh-1-25">Total pago</div>
                                        <Row className="g-0">
                                            <Col xs="auto">
                                                <div className="cta-3 text-primary">R$ 284,0</div>
                                            </Col>
                                            <Col className="d-flex align-items-center justify-content-end">
                                                <Badge bg="primary">11.4%</Badge>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Card body className="mb-2 mt-3">
                <Table striped>
                    <thead>
                        <tr>
                            <th scope="col">Nº da parcela</th>
                            <th scope="col">Vencimento</th>
                            <th scope="col">Valor (R$)</th>
                            <th scope="col">Data do recebimento</th>
                            <th scope="col">Status</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1/10</td>
                            <td>04/04/2024</td>
                            <td>30,00 </td>
                            <td>04/04/2024</td>
                            <td>
                                <Badge bg="warning">Em aberto</Badge>
                            </td>
                            <td>
                                <DropdownButton as={ButtonGroup} variant="outline-primary" className="mb-1">
                                    <Dropdown.Item href="#/action-1">Confirmar pagamento</Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">Remover pagamento</Dropdown.Item>
                                </DropdownButton>{' '}
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
            <ModalPaymentConditions showModal={showModal} onHide={handleClose} />
        </>
    );
} 
