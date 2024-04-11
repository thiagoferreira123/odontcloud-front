import { Button, Modal } from 'react-bootstrap';
import { useModalTransactionConfirmationModalStore } from '../hooks/ModalTransactionConfirmationModalStore';
import { CarePlanBudgetHistoryItem } from '../hooks/CarePlanBudgetHistoryItem/types';
import { Transaction } from '../../FinancialControl/hooks/TransactionStore/types';
import { CarePlanBudget } from '../hooks/CarePlanBudgetStore/types';
import useTransactionStore from '../../FinancialControl/hooks/TransactionStore';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type Props = {
  carePlanBudget: CarePlanBudget;
};

export default function TransactionConfirmationModal({ carePlanBudget }: Props) {
  const queryClient = useQueryClient();
  const showModal = useModalTransactionConfirmationModalStore((state) => state.showModal);
  const selectedPayment = useModalTransactionConfirmationModalStore((state) => state.selectedPayment);
  const [isSaving, setIsSaving] = useState(false);

  const { hideModal } = useModalTransactionConfirmationModalStore();
  const { addTransaction } = useTransactionStore();

  const handleConfirm = async () => {
    try {
      if (!selectedPayment) throw new Error('Pagamento não encontrado');

      setIsSaving(true);

      if (selectedPayment.payment_status === 'pending') {
        const payload: Partial<Transaction> = {
          financial_control_description: `Recebimento da parcela ${selectedPayment.payment_description}`,
          financial_control_value: selectedPayment.payment_installments_value.toString().replace('.', ','),
          financial_control_entry_or_exit: 'entrance',
          financial_control_date: new Date().toISOString(),
          financial_control_category: `Recebimento de parcela de plano de tratamento - ${carePlanBudget.budget_name}`,
          financial_control_payment_method: carePlanBudget.budget_payment_method,
          financial_control_observation: null,
        };
        const response = await addTransaction(payload, queryClient);

        if (response === false) throw new Error('Erro ao adicionar transação');
      } else {
        const response = await addTransaction(
          {
            financial_control_description: `Estorno do recebimento da parcela ${selectedPayment.payment_description}`,
            financial_control_value: selectedPayment.payment_installments_value.toString().replace('.', ','),
            financial_control_entry_or_exit: 'output',
            financial_control_date: new Date().toISOString(),
            financial_control_category: 'Estorno de recebimento de parcela de plano de tratamento',
            financial_control_payment_method: carePlanBudget.budget_payment_method,
            financial_control_observation: null,
          },
          queryClient
        );

        if (response === false) throw new Error('Erro ao adicionar transação');
      }

      hideModal();
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(error);
    }
  };

  if (!showModal) return null;

  return (
    <Modal className="fade modal-close-out" show={showModal}>
      <Modal.Header className="d-flex flex-column gap-3 text-center border-0">
        <Modal.Title>Confirmação de transação</Modal.Title>
        <span>Deseja adicionar um registro de transação para este pagamento?</span>
        <div className="d-flex align-items-center gap-2">
          <Button disabled={isSaving} onClick={hideModal}>
            Não
          </Button>
          <Button disabled={isSaving} variant="outline-primary" onClick={handleConfirm}>
            {isSaving || isSaving ? <span className="spinner-border spinner-border-sm"></span> : 'Sim'}
          </Button>
        </div>
      </Modal.Header>
    </Modal>
  );
}
