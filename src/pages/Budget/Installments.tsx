import { useState } from 'react';
import { Badge, ButtonGroup, Card, Dropdown, DropdownButton, Table } from 'react-bootstrap';
import { CarePlanBudgetHistoryItem, HistoryItemTranslatedStatus } from './hooks/CarePlanBudgetHistoryItem/types';
import { convertIsoToBrDate } from '../../helpers/DateHelper';
import useCarePlanBudgetHistoryItemStore from './hooks/CarePlanBudgetHistoryItem';
import { useQueryClient } from '@tanstack/react-query';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify } from '../../components/toast/NotificationIcon';
import { CarePlanBudget } from './hooks/CarePlanBudgetStore/types';
import TransactionConfirmationModal from './modals/TransactionConfirmationModal';
import { useModalTransactionConfirmationModalStore } from './hooks/ModalTransactionConfirmationModalStore';

type InstallmentsProps = {
  carePlanBudget: CarePlanBudget;
};

export default function Installments({ carePlanBudget }: InstallmentsProps) {
  const queryClient = useQueryClient();

  const { removeCarePlanBudgetHistoryItem, updateCarePlanBudgetHistoryItem } = useCarePlanBudgetHistoryItemStore();
  const { openModalDayOffModal } = useModalTransactionConfirmationModalStore();

  const handleRemovePayment = async (payment: CarePlanBudgetHistoryItem) => {
    try {
      if (!payment.payment_id) throw new Error('Id do pagamento é obrigatório');
      await removeCarePlanBudgetHistoryItem(payment, queryClient);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTogglePaymentStatus = async (payment: CarePlanBudgetHistoryItem) => {
    try {
      if (!payment.payment_id) throw new AppException('Id do pagamento é obrigatório');

      const response = await updateCarePlanBudgetHistoryItem(
        {
          ...payment,
          payment_status: payment.payment_status === 'pending' ? 'received' : 'pending',
          payment_installments_value_date_received: payment.payment_status === 'pending' ? new Date().toISOString() : '',
        },
        queryClient
      );

      if (response === false) throw new Error('Erro ao atualizar pagamento');

      openModalDayOffModal(payment);
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
    }
  };

  return (
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
          {carePlanBudget.paymentHistorics
            .sort((a, b) => new Date(a.payment_due_date).getTime() - new Date(b.payment_due_date).getTime())
            .map((payment) => (
              <tr key={payment.payment_id}>
                <td>{payment.payment_description}</td>
                <td>{convertIsoToBrDate(payment.payment_due_date)}</td>
                <td>{payment.payment_installments_value} </td>
                <td>{payment.payment_installments_value_date_received ? new Date(payment.payment_installments_value_date_received).toLocaleString() : ''}</td>
                <td>
                  <Badge bg={payment.payment_status === 'pending' ? 'warning' : 'success'}>{HistoryItemTranslatedStatus[payment.payment_status]}</Badge>
                </td>
                <td>
                  <DropdownButton title="" as={ButtonGroup} variant="outline-primary" className="mb-1">
                    <Dropdown.Item href="#/action-1" onClick={() => handleTogglePaymentStatus(payment)} disabled={payment.payment_status === 'received'}>
                      Confirmar pagamento
                    </Dropdown.Item>
                    <Dropdown.Item href="#/action-2" onClick={() => handleRemovePayment(payment)}>
                      Remover pagamento
                    </Dropdown.Item>
                  </DropdownButton>{' '}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <TransactionConfirmationModal carePlanBudget={carePlanBudget} />
    </Card>
  );
}
