import * as Icon from 'react-bootstrap-icons';
import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import ModalIPreview from './ModalIPreview';
import { useFoodDiaryStore } from './hooks';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../../components/loading/StaticLoading';
import { convertTimeToSimple, formatDateMonthToHumanReadable } from '../../../helpers/DateHelper';
import { useModalIPreviewStore } from './hooks/ModalIPreviewStore';

const ListFoodDiary = () => {

  const { getFoodDiary } = useFoodDiaryStore();
  const { handleSelectRegister } = useModalIPreviewStore();

  const getFoodDiary_ = async () => {
    try {
      const response = await getFoodDiary();

      if (response === false) throw new Error('Error on getFoodDiary');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['getFoodDiary'], queryFn: getFoodDiary_ });

  return (
    <Card>
      <Card.Body className="mb-n2">
        <Row className="g-0 mb-3">
          <Col xs="auto">
            <div className="d-inline-block d-flex">
              <div className="bg-gradient-light sw-6 sh-6 rounded-xl">
                <div className="text-white d-flex justify-content-center align-items-center h-100">
                  <Icon.Camera size={20}/>
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <div className="d-flex flex-column pt-0 pb-0 ps-3 pe-4 h-100 justify-content-center">
              <div className="d-flex flex-column">
                <div className="text-alternate mt-n1 lh-1-25">Últimos registros do diário alimentar</div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="scroll-out">
          <div className="override-native overflow-auto sh-30 pe-3">
            {result.isLoading ? (
              <div className="sh-20 d-flex align-items-center">
                <StaticLoading />
              </div>
            ) : result.isError ? (
              <div className="sh-20 d-flex align-items-center">Erro ao buscar registros</div>
              ) : !result.data?.length ? (
                <div className="sh-20 d-flex justify-content-center align-items-center">
                  <div className="h-100 p-4 text-center align-items-center d-flex flex-column justify-content-center">
                    <div className="d-flex flex-column justify-content-center align-items-center sh-5 sw-5 rounded-xl bg-gradient-primary mb-2">
                      <Icon.Camera/>
                    </div>
                    <p className="mb-0 lh-1">Não há registros para hoje</p>
                  </div>
                </div>
              ) : (
                result.data.map((register) => (
                <Row className="g-0 sh-6 mb-2 position-relative" key={register.id}>
                  <Col xs="auto" className="h-100">
                    <img
                      src={register.registro_imagem ? register.registro_imagem : '/img/product/small/product-4.webp'}
                      className="card-img rounded-md h-100 sw-6"
                      alt="thumb"
                    />
                  </Col>
                  <Col className="h-100">
                    <div className="d-flex flex-column pt-0 pb-0 ps-3 pe-0 h-100 justify-content-center">
                      <div className="d-flex flex-column">
                        <Button variant="link" className="p-0 text-alternate text-start" onClick={() => handleSelectRegister(register)}>
                          {register.paciente_nome}
                        </Button>
                        <div className="text-medium text-muted text-truncate">
                          {register.nome_refeicao} do dia {register.data_registro} ás{' '}
                          {convertTimeToSimple(register.hora_registro)}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              ))
            )}
          </div>
        </div>
      </Card.Body>

      <ModalIPreview />
    </Card>
  );
};

export default ListFoodDiary;
