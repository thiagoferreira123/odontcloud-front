import React, { useState } from 'react';
import { Badge, Button, Card, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalNewProcedure from './modals/ModalNewProcedure';
import { useParams } from 'react-router-dom';
import useCarePlanStore from './hooks/CarePlanStore';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import Empty from '../../components/Empty';
import { useModalNewProcedureStore } from './hooks/ModalNewProcedureStore';
import { Procedure } from './hooks/CarePlanStore/types';
import { TranslatedProcedureStatus } from './hooks/ProcedureStore/types';

export default function CarePlan() {
  const { id } = useParams();

  const { getCarePlan } = useCarePlanStore();
  const { handleShowModalNewProcedure, handleSelectProcedureToEdit } = useModalNewProcedureStore();

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

  const totalValue =
    result.data?.procedures.reduce((acc: number, procedure: Procedure) => {
      return acc + (Number(procedure.procedure_value.replace('.', '').replace(',', '.')) * procedure.teeth.length);
    }, 0) ?? 0;

  const procedureNumber = result.data?.procedures.length ?? 0;
  const teethNumber = result.data?.procedures.reduce((acc: number, procedure: Procedure) => acc + procedure.teeth.length, 0) ?? 0;

  return (
    <>
      <h2 className="medium-title">Plano de tratamento</h2>
      <Card body className="mb-2">
        {result.isLoading ? (
          <div className="sh-30 d-flex align-items-center">
            <StaticLoading />
          </div>
        ) : result.isError ? (
          <div className="sh-30 d-flex align-items-center justify-content-center">Erro ao buscar plano de tratamento</div>
        ) : !result.data?.procedures.length ? (
          <div className="sh-30 d-flex align-items-center justify-content-center">
            <Empty message="Nenhum procedimento cadastrado" classNames="mt-0" />
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
              {result.data.procedures.map((procedure: Procedure) =>
                procedure.teeth.map((tooth) => (
                  <tr key={tooth.tooth_id}>
                    <th>
                      {procedure.procedure_name}
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="button-tooltip-3">O procedimento será realizado pelo profissional Thiago Ferreira</Tooltip>}
                      >
                        <Icon.InfoCircle className="ms-2" />
                      </OverlayTrigger>{' '}
                    </th>
                    <td>
                      {tooth.tooth_number}{' '}
                      {tooth.tooth_faces &&
                        JSON.parse(tooth.tooth_faces)
                          .map((f: string) => f[0])
                          .join(', ')}
                    </td>
                    <td>
                      {Number(procedure.procedure_value.replace('.', '').replace(',', '.')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td>
                      <Badge bg={procedure.procedure_status === 'realized' ? 'success' : procedure.procedure_status === 'pre-existing' ? 'warning' : 'danger'}>
                        {TranslatedProcedureStatus[procedure.procedure_status]}
                      </Badge>
                    </td>
                    <td>
                      <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Editar procedimento</Tooltip>}>
                        <Button size="sm" className="me-1" variant="outline-primary" onClick={() => handleSelectProcedureToEdit(procedure)}>
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
                ))
              )}
            </tbody>
          </Table>
        )}
      </Card>
      <div className="text-center">
        <Button size="lg" className="me-1 mb-4" onClick={handleShowModalNewProcedure}>
          Cadastrar procedimento
          <Icon.Plus />
        </Button>
      </div>
      <div className="text-center mt-4">
        <h5>
          <strong>{procedureNumber}</strong> procedimento(s), em <strong>{teethNumber}</strong> dente(s), totalizando um valor de: 
          <strong>{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Crie um prçamento para encaminhar para o paciente.</Tooltip>}>
            <Button size="sm" className="ms-3 mb-3 mt-3" variant="primary">
              Gerar orçamento
            </Button>
          </OverlayTrigger>{' '}
          <p>Volte ao menu do paciente, e vá até a guia "Orçamento" para verificar os detalhes e disponibilizar condições de pagamentos.</p>
        </h5>
      </div>
      <div className="text-center mt1"></div>
      <ModalNewProcedure />
    </>
  );
}
