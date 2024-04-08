
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import Clamp from '/src/components/clamp';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import api from '/src/services/useAxios';
import PopupImage from '/src/components/ExpandedImage';
import ZoomImage from './ZoomImage';

interface CardFoodProps {
  food: Record<string, any>;
}

interface FormData {
  comentario: string;
}

export function CardFood({ food }: CardFoodProps) {
  const [disabled, setDisabled] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    comentario: food.comentario_nutricionista ?? '',
  });
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dataRegistro = new Date(food.data_hora_registro);
  const dataFormated = dataRegistro.toLocaleDateString('pt-BR');

  const avatar = food.paciente_sexo !== 1 ? '/img/profile/avatar_paciente_fem.png' : '/img/profile/avatar_paciente_masc.png';
  const defaultImage = '/img/equivalent-groups/g-11.webp';
  // equivalent-groups/g-11.webp
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (disabled) {
        setDisabled(false);
        await api.put(`/registro-alimentar/${food.id}`, {
          comentario_nutricionista: null,
        });
      } else {
        await api.put(`/registro-alimentar/${food.id}`, {
          comentario_nutricionista: formData.comentario,
        });
        setDisabled(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (food.comentario_nutricionista) {
      setDisabled(true);
    }
  }, []);

  return (
    <>
      <Card className="mb-5">
        <ZoomImage source={food.registro_imagem} avatar={defaultImage} />
        <Card.Body>
          <h4 className="mb-3">
            <NavLink to="/pages/blog/detail">{food.nome_refeicao}</NavLink>
          </h4>
          <Clamp clamp="2" className="text-alternate mb-0">
            {food.comentario}
          </Clamp>
        </Card.Body>
        <Card.Footer className="border-0 pt-0">
          <Row className="align-items-center">
            <Col xs="6">
              <div className="d-flex align-items-center">
                <div className="sw-5 d-inline-block position-relative me-3">
                  <img
                    src={imageError ? avatar : food.paciente_foto ?? avatar}
                    className="img-fluid rounded-xl"
                    alt="Foto do Perfil"
                    onError={() => setImageError(true)}
                    loading="lazy"
                  />
                </div>
                <div className="d-inline-block">
                  <NavLink to="#">{food.paciente_nome}</NavLink>
                </div>
              </div>
            </Col>
            <Col xs="6">
              <Row className="g-0 justify-content-end">
                <Col xs="auto" className="ps-3">
                  <CsLineIcons icon="clock" size={15} className="text-primary me-1" />
                  <span className="align-middle">{food.hora_registro}</span>
                </Col>
                <Col xs="auto" className="ps-3">
                  <CsLineIcons icon="calendar" size={15} className="text-primary me-1" />
                  <span className="align-middle">{dataFormated.toString()}</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <Form name="form" onSubmit={handleSubmit}>
            <Row className="align-items-start">
              <Col md={12}>
                <Form.Control
                  disabled={disabled}
                  value={formData.comentario}
                  as="textarea"
                  rows={2}
                  name="comentario"
                  className="mt-3"
                  placeholder="Digite um comentário..."
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                />
              </Col>
            </Row>
            <Row className="text-center">
              <Col md={12}>
                <Button type="submit" variant="outline-primary" size="sm" className="mt-2">
                  {disabled ? 'Editar comentário' : 'Enviar comentário'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Footer>
      </Card>

      <PopupImage setOpen={setOpen} open={open} altText="asdsd" imageUrl={food.registro_imagem} />
    </>
  );
}
