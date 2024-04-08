import React, { useState } from 'react';
import { Badge, Button, Card, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalNewProcedure from './modals/ModalNewProcedure';
import { useParams } from 'react-router-dom';
import useCarePlanStore from './hooks/CarePlanStore';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import Empty from '../../components/Empty';

export default function CarePlan() {
  const { id } = useParams();

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  const { getCarePlan } = useCarePlanStore();

  const getCarePlan_ = async () => {
    try {
      if (!id) throw new Error('Id is required');

      const response = await getCarePlan(id);

      if (response === false) throw new Error('Erro ao buscar plano de tratamento');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['careplan', id], queryFn: getCarePlan_, enabled: !!id });

  return (
    <>
      <h2 className="medium-title">Plano de tratamento</h2>
      <Card body className="mb-2">
        {result.isLoading ? (
          <div className='sh-30 d-flex align-items-center'>
            <StaticLoading />
          </div>
        ) : result.isError ? (
          <div className='sh-30 d-flex align-items-center justify-content-center'>
            Erro ao buscar plano de tratamento
          </div>
        ) : !result.data?.procedures.length ? (
          <div className='sh-30 d-flex align-items-center justify-content-center'>
            <Empty message='Nenhum procedimento cadastrado' classNames='mt-0' />
          </div>
        ) : (
          <Table striped>
            <thead>
              <tr>
                <th scope="col">Procedimentos</th>
                <th scope="col">Dente e faces</th>
                <th scope="col">Valor</th>
                <th scope="col">Estado</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  Acompanhamento de tratamento/procedimento cirúrgico em odontologia
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="button-tooltip-3">O procedimento será realizado pelo profissional Thiago Ferreira</Tooltip>}
                  >
                    <Icon.InfoCircle className="ms-2" />
                  </OverlayTrigger>{' '}
                </th>
                <td>28 C, D, M, O, P, V</td>
                <td>R$ 250,00</td>
                <td>
                  <Badge bg="danger">Pendente</Badge>
                </td>
                <td>
                  <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Editar procedimento</Tooltip>}>
                    <Button size="sm" className="me-1" variant="outline-primary">
                      <Icon.Pencil />
                    </Button>
                  </OverlayTrigger>{' '}
                  <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Remover procedimento</Tooltip>}>
                    <Button size="sm" className="me-1" variant="outline-primary">
                      <Icon.TrashFill />
                    </Button>
                  </OverlayTrigger>{' '}
                </td>
              </tr>
            </tbody>
          </Table>
        )}
      </Card>
      <div className="text-center">
        <Button size="lg" className="me-1 mb-4" onClick={() => setShowModal(true)}>
          Cadastrar procedimento
          <Icon.Plus />
        </Button>
      </div>
      <div className="text-center mt-4">
        <h5>
          Ao todo, serão feitos <strong>4</strong> procedimentos, em <strong>3</strong> somando um valor total de: <strong>R$ 3.000,00</strong>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Crie um prçamento para encaminhar para o paciente.</Tooltip>}>
            <Button size="sm" className="ms-3 mb-3 mt-3" variant="primary">
              Gerar orçamento
            </Button>
          </OverlayTrigger>{' '}
          <p>Será gerado uma modal, para dar um nome para o orçamento, e vai ser gerado um orçamento no menu de orçamento</p>
        </h5>
      </div>
      <div className="text-center mt1"></div>
      <ModalNewProcedure showModal={showModal} onHide={handleClose} />
    </>
  );
}
