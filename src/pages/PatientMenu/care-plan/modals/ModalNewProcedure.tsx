import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import SelectMultiple from "./SelectMultiple";

interface ModalNewProcedure {
    showModal: boolean;
    onHide: () => void;
}

const ModalNewProcedure = ({ showModal, onHide }: ModalNewProcedure) => {
    const [value, setValue] = useState("");
    const handleChangeMaskMoney = (event) => {
        const inputValue = (parseInt(event.target.value.replace(/\D/g, ""), 10) / 100)
            .toFixed(2)
            .replace(".", ",")
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setValue(inputValue);
    };

    return (
        <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Novo procedimento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs="12" className="mb-3">
                        <Form.Label className="d-block">
                            <strong>Profissional</strong>
                        </Form.Label>
                        <SelectMultiple />
                    </Col>
                </Row>
                <Row>
                    <Form.Label className="d-flex">
                        <strong>Procedimentos </strong>
                        <Form.Check type="checkbox" label="Exibir apenas procedimentos da clínica" id="stackedCheckbox1" className="ms-3" />
                    </Form.Label>
                    <Col xs="12" className="mb-3">
                        <SelectMultiple />
                    </Col>
                </Row>
                <Row>
                    <Form.Label className="d-block">
                        <strong>Valor R$</strong>
                    </Form.Label>
                    <Col xs="12" className="mb-3 d-flex">
                        <Form.Control type="text" name="procedure_valeu" value={value} onChange={handleChangeMaskMoney} />
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" className="mb-3">
                        <Form.Label className="d-flex">
                            <strong>Dentes </strong>
                            <Form.Check type="radio" label="Permanente" id="stackedRadio1" name="stackedRadio" className="ms-3" defaultChecked />
                            <Form.Check type="radio" label="Decíduo" id="stackedRadio2" name="stackedRadio" className="ms-3" />
                        </Form.Label>
                        <SelectMultiple />
                    </Col>
                </Row>
                <Row>
                    <Form.Label className="d-block">
                        <strong>Faces do dente:</strong>
                    </Form.Label>
                    <Col xs="12" className="mb-3 d-flex">
                        <Form.Check type="checkbox" label="Oclusal/Incisal" id="stackedCheckbox1" className="me-4" defaultChecked/>
                        <Form.Check type="checkbox" label="Lingual/Palatina" id="stackedCheckbox2" className="me-4" />
                        <Form.Check type="checkbox" label="Vestibular" id="stackedCheckbox3" className="me-4" />
                        <Form.Check type="checkbox" label="Mesial" id="stackedCheckbox4" className="me-4" />
                        <Form.Check type="checkbox" label="Distal" id="stackedCheckbox5" className="me-4" />
                    </Col>
                </Row>
                <Row>
                    <Form.Label className="d-block">
                        <strong>Estado</strong>
                    </Form.Label>
                    <Col xs="12" className="mb-3 d-flex">
                        <Form.Check type="radio" label="Pendente" id="stacked1" name="stackedRadio" defaultChecked />
                        <Form.Check type="radio" label="Realizado" id="stacked2" name="stackedRadio" className="ms-3" />
                        <Form.Check type="radio" label="Pré-existente" id="stacked3" name="stackedRadio" className="ms-3"  />
                    </Col>  
                </Row>
                <Row>
                    <Form.Label className="d-block">
                        <strong>Observações</strong>
                    </Form.Label>
                    <Col xs="12" className="mb-3 d-flex">
                        <Form.Control as="textarea" rows={1} name="observation" />
                    </Col>
                </Row>
                <div className="text-center">
                    <Button>Salvar procedimento</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalNewProcedure;
