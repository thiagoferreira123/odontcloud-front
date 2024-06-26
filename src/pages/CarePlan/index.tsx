import React, { useState } from 'react';
import { Badge, Button, Card, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalNewProcedure from './modals/ModalNewProcedure';
import { useNavigate, useParams } from 'react-router-dom';
import useCarePlanStore from './hooks/CarePlanStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import Empty from '../../components/Empty';
import { useModalNewProcedureStore } from './hooks/ModalNewProcedureStore';
import { Procedure } from './hooks/CarePlanStore/types';
import { TranslatedProcedureStatus } from './hooks/ProcedureStore/types';
import useProfessionalStore from '../MySettings/hooks/ProfessionalStore';
import { AppException } from '../../helpers/ErrorHelpers';
import { useAuth } from '../Auth/Login/hook';
import { notify } from '../../components/toast/NotificationIcon';
import { Professional } from '../MySettings/hooks/ProfessionalStore/types';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import { useDeleteConfirmationModalStore } from './hooks/DeleteConfirmationModalStore';
import useCarePlanBudgetStore from '../PatientMenu/budget/hooks/CarePlanBudgetStore';
import { CarePlanBudget } from '../PatientMenu/budget/hooks/CarePlanBudgetStore/types';
import { appRoot } from '../../routes';
import AsyncButton from '../../components/AsyncButton';
import { parseToBrValue } from '../../helpers/StringHelpers';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';
import PatientMenuRow from '../../components/PatientMenuRow';

const getProfessionalName = (professionalId: string, professionals: Professional[]) => {
  return professionals.find((professional: any) => professional.professional_id === professionalId)?.professional_full_name;
};

export default function CarePlan() {
  const { id } = useParams();

  const user = useAuth((state) => state.user);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  const { addCarePlanBudget } = useCarePlanBudgetStore();

  const { getCarePlan } = useCarePlanStore();
  const { getProfessionals } = useProfessionalStore();
  const { handleShowModalNewProcedure, handleSelectProcedureToEdit } = useModalNewProcedureStore();
  const { handleSelectToothToRemove } = useDeleteConfirmationModalStore();
  const { setPatientId } = usePatientMenuStore();

  const getProfessionals_ = async () => {
    try {
      if (!user) throw new AppException('Usuário não encontrado');

      const response = await getProfessionals(user.clinic_id);

      if (response === false) throw new Error('Erro ao buscar profissionais');

      return response;
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      throw error;
    }
  };

  const resultProfessionals = useQuery({ queryKey: ['professionals'], queryFn: getProfessionals_, enabled: !!user?.clinic_id });

  const getCarePlan_ = async () => {
    try {
      if (!id) throw new Error('Id is required');

      const response = await getCarePlan(id);

      if (response === false) throw new Error('Erro ao buscar plano de tratamento');

      response.care_plan_patient_id && setPatientId(response.care_plan_patient_id);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleCreateBudget = async () => {
    setIsCreatingBudget(true);

    try {
      if (!result.data?.care_plan_patient_id) throw new Error('budget_care_plan_patient_id (id) is not defined');

      const payload: Partial<CarePlanBudget> = {
        budget_date_creation: new Date().toISOString(),
        budget_name: result.data?.care_plan_identification ?? 'Sem identificação',
        budget_value: parseToBrValue(totalValue).replace('R$', '').trim(),
        budget_care_plan_id: id,
      };
      const response = await addCarePlanBudget({ ...payload, budget_care_plan_patient_id: result.data?.care_plan_patient_id }, queryClient);

      if (!response) throw new Error('Error adding budget');

      navigate(`${appRoot}/orcamento/${response.budget_id}`);

      setIsCreatingBudget(false);
    } catch (error) {
      setIsCreatingBudget(false);
      console.error(error);
    }
  };

  const result = useQuery({ queryKey: ['careplan', id], queryFn: getCarePlan_, enabled: !!id });

  const totalValue =
    result.data?.procedures.reduce((acc: number, procedure: Procedure) => {
      return acc + Number(procedure.procedure_value.replace('.', '').replace(',', '.')) * procedure.teeth.length;
    }, 0) ?? 0;

  const procedureNumber = result.data?.procedures.length ?? 0;
  const teethNumber = result.data?.procedures.reduce((acc: number, procedure: Procedure) => acc + procedure.teeth.length, 0) ?? 0;

  return (
    <>
      <PatientMenuRow />

      <h2 className="medium-title">Plano de tratamento</h2>
      <Card body className="mb-2">
        {result.isLoading || resultProfessionals.isLoading ? (
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
                        overlay={
                          <Tooltip id="button-tooltip-3">
                            O procedimento será realizado pelo profissional{' '}
                            {resultProfessionals.data && getProfessionalName(procedure.procedure_professional_id, resultProfessionals.data)}
                          </Tooltip>
                        }
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
                      <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-3">Remover dente</Tooltip>}>
                        <Button size="sm" className="me-1" variant="outline-primary" onClick={() => id && handleSelectToothToRemove(tooth, id)}>
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
            <span>
              <AsyncButton isSaving={isCreatingBudget} size="sm" className="ms-3 mb-3 mt-3" variant="primary" onClickHandler={handleCreateBudget}>
                Gerar orçamento
              </AsyncButton>
            </span>
          </OverlayTrigger>{' '}
          <p>Volte ao menu do paciente, e vá até a guia "Orçamento" para verificar os detalhes e disponibilizar condições de pagamentos.</p>
        </h5>
      </div>
      <div className="text-center mt1"></div>

      <ModalNewProcedure />
      <DeleteConfirmationModal />
    </>
  );
}
