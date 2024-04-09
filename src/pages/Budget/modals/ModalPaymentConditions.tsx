import React from "react";
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap";
import SelectMultiple from "./SelectMultiple";

interface ModalPaymentConditions {
    showModal: boolean;
    onHide: () => void;
}

const ModalPaymentConditions = ({ showModal, onHide }: ModalPaymentConditions) => {
    return (
        <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Condições de pagamento</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Row>
                    <Col xs="12" className="mb-3">
                        <Form.Label className="d-block">
                            <strong>Forma de pagamento</strong>
                        </Form.Label>
                        <SelectMultiple />
                    </Col>
                </Row>
                <Row>
                    <Form.Label className="d-flex">
                        <strong>Desconto </strong>
                        <Form.Check type="radio" label="Porcentagem (%)" id="stackedRadio1" name="stackedRadio" className="ms-3" defaultChecked />
                        <Form.Check type="radio" label="Real (R$)" id="stackedRadio2" name="stackedRadio" className="ms-3" />
                    </Form.Label>
                </Row>
                <Row>
                    <Form.Label className="d-block">
                        <strong>Valor do desconto</strong>
                    </Form.Label>
                    <Col xs="2" className="mb-3 d-flex">
                        <Form.Control type="text" name="procedure_valeu" />
                    </Col>
                </Row>
                <Alert variant="light">
                    Valor total do orçamento: 3.000,80 R$ <br></br>
                    Valor com desconto: 2.9080,00 R$
                </Alert>
                <Row>
                    <Col xs="6" className="mb-3">
                        <Form.Label>
                            <strong>Quantidade de parcelas</strong>
                        </Form.Label>
                        <Form.Control type="text" name="quantidadeParcelas" />
                    </Col>

                    <Col xs="6" className="mb-3">
                        <Form.Label>
                            <strong>Data do vencimento da primeira parcela</strong>
                        </Form.Label>
                        <Form.Control type="date" name="dataVencimento" />
                    </Col>
                </Row>

                <Row>
                    <Col xs="6" className="mb-3">
                        <Form.Label>
                            <strong>Entrada</strong>
                        </Form.Label>
                        <Form.Control type="text" name="entrada" />
                    </Col>

                    <Col xs="6" className="mb-3">
                        <Form.Label>
                            <strong>Data da entrada</strong>
                        </Form.Label>
                        <Form.Control type="date" name="dataEntrada" />
                    </Col>
                </Row>
                <div className="text-center">
                    <Button>Salvar</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalPaymentConditions;
