/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

import { format, subYears } from 'date-fns';
import React, { useState } from 'react';
import { Button, Card, Col, Row, Form, Alert } from 'react-bootstrap';
import Select from 'react-select';

import DatepickerFloatingLabel from '/src/views/interface/forms/controls/datepicker/DatepickerFloatingLabel';

interface FilterDaysProps {
  getFiltring: (days: string, idProfissional?: string, dataInicio?: string, dataFinal?: string) => void;
  idProfissional: number | undefined;
  pacientes: any[];
  filterSelect: (paciente: string) => void;
}

interface FormData {
  dataInicio: string;
  dataFinal: string;
}

export function FilterDays({ getFiltring, idProfissional, pacientes, filterSelect }: FilterDaysProps) {
  const [value, setValue] = useState();
  const [formData, setFormData] = useState<FormData>({
    dataInicio: '',
    dataFinal: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  const handleDateChange = (date: Date | null, fieldName: keyof FormData) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: date }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.dataInicio || !formData.dataFinal) {
      setFormError('Por favor, selecione as datas.');
      return;
    }

    if (formData.dataFinal < formData.dataInicio) {
      setFormError('A data final deve ser maior ou igual à data de início.');
      return;
    }

    const inicio = new Date(formData.dataInicio);
    const final = new Date(formData.dataFinal);

    const dataInicio = format(inicio, 'yyyy-MM-dd');
    const dataFinal = format(final, 'yyyy-MM-dd');

    setFormError(null);

    try {
      getFiltring('', idProfissional?.toString(), dataInicio, dataFinal);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Row>
        <Col xs="12" className="mb-5">
          <Card>
            <Card.Body>
              <div className="cta-3">Filtre por data</div>
              <div>
                <Button onClick={() => getFiltring('7')} variant="outline-primary" className="w-100 mb-1 mt-2">
                  Últimos 7 dias
                </Button>
              </div>
              <div>
                <Button onClick={() => getFiltring('15')} variant="outline-primary" className="w-100 mb-1">
                  Últimos 15 dias
                </Button>
              </div>
              <div>
                <Button onClick={() => getFiltring('30')} variant="outline-primary" className="w-100 mb-2">
                  Últimos 30 dias
                </Button>
              </div>

              <Form onSubmit={handleSubmit}>
                {formError && <Alert variant="danger">{formError}</Alert>}
                <Row className="d-flex mt-3 text-center">
                  <Col xs="6">
                    <Form.Group controlId="formName">
                      <DatepickerFloatingLabel
                        onChange={(date: Date) => handleDateChange(date, 'dataInicio')}
                        selected={formData.dataInicio}
                        label="Data inicio"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs="6">
                    <DatepickerFloatingLabel onChange={(date: Date) => handleDateChange(date, 'dataFinal')} selected={formData.dataFinal} label="Data fim" />
                  </Col>
                </Row>
                <div className="text-center">
                  <Button type="submit" variant="outline-primary" className="w-80 mb-1 mt-3">
                    Filtrar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mt-4">
            <Card.Body>
              <div className="cta-3 mb-3">Filtre por paciente</div>
              <Select
                classNamePrefix="react-select"
                options={pacientes}
                value={value}
                onChange={(e) => {
                  setValue(e), filterSelect(e.value);
                }}
                placeholder="Filtrar por pacientes"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
