import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Col, Modal, Row } from 'react-bootstrap';
import { useModalDetailsRecipeStore } from '../hooks/ModalDetailsRecipeStore';
import { convertTimeToMinutes } from '/src/helpers/DateHelper';

const ModalDetailsRecipe = () => {
  const showModalDetailsRecipe = useModalDetailsRecipeStore((state) => state.showModalDetailsRecipe);
  const selectedRecipe = useModalDetailsRecipeStore((state) => state.selectedRecipe);

  const { hideModalDetailsRecipe } = useModalDetailsRecipeStore();

  return (
    <Modal className="modal-close-out" size="xl" backdrop="static" show={showModalDetailsRecipe} onHide={hideModalDetailsRecipe}>
      <Modal.Header closeButton>
        <Modal.Title>Detalhes da receita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-5">
          <Col xl="6">
            <img
              alt="detail"
              src={selectedRecipe?.imagem ? selectedRecipe.imagem : '/img/product/large/product-2.webp'}
              className="responsive border-0 rounded-md img-fluid mb-3 w-100 sh-24 sh-md-35 sh-xl-50"
            />
          </Col>
          <Col xl="6">
            <h4 className="mb-4">{selectedRecipe?.nome ?? ''}</h4>
            <div className="h5">
              <CsLineIcons icon="next" width={20} height={20} className="cs-icon icon text-primary me-1" />
              Ingredientes
            </div>
            {selectedRecipe?.alimentos.map((food) => (
              <p key={food.id}>
                - {food.nome} - {food.quantidade} {food.medida_caseira}
              </p>
            ))}

            <div className="h5">
              <CsLineIcons icon="next" width={20} height={20} className="cs-icon icon text-primary me-1" />
              Modo de preparo
            </div>
            <p>1. aaaaaaaaaaaa</p>
            {selectedRecipe?.preparos.map((preparation) => (
              <p key={preparation.id}>
                {preparation.passo_numero}. {preparation.passo_descricao}
              </p>
            ))}

            <div className="h5">
              <CsLineIcons icon="next" width={20} height={20} className="cs-icon icon text-primary me-1" />
              Peso total da receita: {selectedRecipe?.peso_receita}g
            </div>
            <div className="h5">
              <CsLineIcons icon="next" width={20} height={20} className="cs-icon icon text-primary me-1" />
              Rendimento da receita: {selectedRecipe?.quantidade_porcao} {selectedRecipe?.porcao_receita}
            </div>
            <div className="h5">
              <CsLineIcons icon="next" width={20} height={20} className="cs-icon icon text-primary me-1" />
              Tempo médio de preparo:{' '}
              {selectedRecipe && Number(selectedRecipe?.tempo_preparo.replaceAll(':', ''))
                ? `${convertTimeToMinutes(selectedRecipe?.tempo_preparo)} minutos`
                : '...'}
            </div>
            <div className="h5">
              <CsLineIcons icon="next" width={20} height={20} className="cs-icon icon text-primary me-1" />
              Receita compartilhada por:
            </div>
            <div className="mt-2">
              <Row className="g-0 sh-6">
                <Col xs="auto">
                  <img src={ selectedRecipe?.user?.admin === 1 ? '/img/product/dietsystem.webp' : selectedRecipe?.user?.image ? selectedRecipe?.user.image : "/img/profile/profile-11.webp"} className="card-img rounded-xl sh-4 sw-4 mt-2" alt="thumb" />
                </Col>
                <Col>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{selectedRecipe?.user?.admin === 1 ? 'Cadastrado pelo DietSystem' : selectedRecipe?.user?.nome_completo ?? '...'}</div>
                      <div className="text-muted">{selectedRecipe?.user?.especialidades ?? ''}</div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetailsRecipe;
