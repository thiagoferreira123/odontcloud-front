import React, { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import { Button, Card, Col, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import Filters from './Filters';
import StaticLoading from '../../components/loading/StaticLoading';
import Empty from '../../components/Empty';
import AsyncButton from '../../components/AsyncButton';
import CreateTransactionModal from './modals/CreateTransactionModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFiltersStore } from './hooks/FiltersStore';
import useTransactionStore from './hooks/TransactionStore';
import { useCreateTransactionModalStore } from './hooks/EditModalStore';
import { AppException } from '../../helpers/ErrorHelpers';
import { Transaction } from './hooks/TransactionStore/types';
import { notify } from '../../components/toast/NotificationIcon';
import { downloadExcel } from '../../helpers/PdfHelpers';
import api from '../../services/useAxios';

export default function MonthlyPane() {
  const queryClient = useQueryClient();

  const selectedMonth = useFiltersStore((state) => state.selectedMonth);
  const selectedYear = useFiltersStore((state) => state.selectedYear);

  const [removingTransactionIds, setRemovingTransactionIds] = useState<number[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const { getTransactions, removeTransaction } = useTransactionStore();
  const { handleShowCreateTransactionModal, handleSelectTransactionToEdit } = useCreateTransactionModalStore();

  const getTransactions_ = async () => {
    try {
      if (!selectedMonth || !selectedYear) throw new AppException('Selecione um mês e um ano para visualizar as transações');

      const response = await getTransactions(selectedMonth.value, selectedYear.value);

      if (response === false) throw new Error('Error');

      return response;
    } catch (error) {
      console.error(error);
      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');
      throw error;
    }
  };

  const handleRemoveTransaction = async (transaction: Transaction) => {
    try {
      if (!selectedMonth || !selectedYear) throw new AppException('Selecione um mês e um ano para visualizar as transações');

      setRemovingTransactionIds((old) => [...old, transaction.id]);

      const response = await removeTransaction(transaction.id, selectedMonth.value, selectedYear.value, queryClient);

      if (response === false) throw new Error('Error');

      setRemovingTransactionIds((old) => old.filter((id) => id !== transaction.id));

      return response;
    } catch (error) {
      setRemovingTransactionIds((old) => old.filter((id) => id !== transaction.id));
      console.error(error);

      error instanceof AppException && notify('Erro ao remover transação', 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const handleDownloadTransactions = async () => {
    try {
      if (!selectedMonth || !selectedYear) throw new AppException('Selecione um mês e um ano para visualizar as transações');

      setIsDownloading(true);

      const { data } = await api.get(`/controle-financeiro/download/${selectedYear.value}/${selectedMonth.value}/`, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      downloadExcel(data, `controle-financeiro-${selectedYear.value}-${selectedMonth.value}`);

      setIsDownloading(false);
    } catch (error) {
      console.error(error);
      error instanceof AppException ? notify(error.message, 'Erro', 'close', 'danger') : notify('Erro ao baixar planilha', 'Erro', 'close', 'danger');
      setIsDownloading(false);
    }
  };

  const result = useQuery({
    queryKey: ['my-transactions', selectedMonth?.value, selectedYear?.value],
    queryFn: getTransactions_,
    enabled: !!selectedMonth && !!selectedYear,
  });

  const totalEntrance =
    result.data?.reduce((acc, transaction) => {
      return transaction.transaction_type === 'entrada' ? acc + Number(transaction.value) : acc;
    }, 0) ?? 0;
  const totalExpense =
    result.data?.reduce((acc, transaction) => {
      return transaction.transaction_type === 'saida' ? acc + Number(transaction.value) : acc;
    }, 0) ?? 0;
  const balance = totalEntrance - totalExpense;

  return (
    <Row>
      <Card>
        <Card.Body>
          <Row>
            <Filters />
            <Col className="text-end">
              <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-1">Download da planilha</Tooltip>}>
                <span>
                  <AsyncButton isSaving={isDownloading} loadingText=" " variant="outline-primary" size="sm" onClickHandler={handleDownloadTransactions}>
                    <Icon.Printer />
                  </AsyncButton>
                </span>
              </OverlayTrigger>
            </Col>
          </Row>
          <div className="scroll-out">
            <div className="override-native overflow-auto sh-50 pe-3">
              <section className="scroll-section" id="stripedRows">
                {!selectedMonth || !selectedYear ? (
                  <div className="sh-50 d-flex align-items-center justify-content-center">
                    <h5 className="mb-3">Selecione um mês e um ano para visualizar as transações</h5>
                  </div>
                ) : result.isLoading ? (
                  <div className="sh-50 d-flex align-items-center justify-content-center">
                    <StaticLoading />
                  </div>
                ) : result.isError ? (
                  <div className="sh-50 d-flex align-items-center justify-content-center">
                    <h5 className="mb-3">Erro ao buscar transações</h5>
                  </div>
                ) : !result.data?.length ? (
                  <div className="sh-50">
                    <Empty message="Nenhuma transação encontrada" classNames="mt-0" />
                  </div>
                ) : (
                  <Table striped className="colorful-table">
                    <thead>
                      <tr>
                        <th scope="col">Data</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Forma de Pagamento</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">Opções</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.data?.map((transaction) => (
                        <tr key={transaction.id}>
                          <th>{new Date(transaction.date).toLocaleDateString()}</th>
                          <td>{transaction.description}</td>
                          <td className={transaction.transaction_type === 'saida' ? 'text-danger' : ''}>
                            {Number(transaction.value).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td>{transaction.paymentMethod.payment_form}</td>
                          <td>{transaction.category.category}</td>
                          <td>
                            <AsyncButton
                              isSaving={removingTransactionIds.includes(transaction.id)}
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              loadingText=" "
                              onClickHandler={() => handleRemoveTransaction(transaction)}
                            >
                              <Icon.Trash />
                            </AsyncButton>
                            <Button variant="outline-primary" size="sm" onClick={() => handleSelectTransactionToEdit(transaction)}>
                              <Icon.Pen />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </section>
            </div>
          </div>
          <div className="mt-3 text-center">
            <Button variant="primary" className="mb-1 hover-scale-up" onClick={handleShowCreateTransactionModal}>
              Cadastrar uma transação
            </Button>{' '}
          </div>
        </Card.Body>
      </Card>

      <Row className="g-2">
        <Col xl="4">
          <Card className="hover-border-primary">
            <Card.Body className="py-4">
              <Row className="g-0 align-items-center">
                <Col xs="auto">
                  <div className="bg-gradient-light sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                    <Icon.GraphUpArrow className="text-white" />
                  </div>
                </Col>
                <Col>
                  <div className="heading mb-0 sh-8 d-flex align-items-center lh-1-25 ps-3">Entrada</div>
                </Col>
                <Col xs="auto" className="ps-3">
                  <div className="display-5 text-primary">{totalEntrance?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="4">
          <Card className="active">
            <Card.Body className="py-4">
              <Row className="g-0 align-items-center">
                <Col xs="auto">
                  <div className="bg-gradient-danger sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center ">
                    <Icon.GraphDownArrow className="text-white" />
                  </div>
                </Col>
                <Col>
                  <div className="heading mb-0 sh-8 d-flex align-items-center lh-1-25 ps-3">Saída</div>
                </Col>
                <Col xs="auto" className="ps-3">
                  <div className="display-5 text-danger">{totalExpense?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="4">
          <Card className="active">
            <Card.Body className="py-4">
              <Row className="g-0 align-items-center">
                <Col xs="auto">
                  <div className="sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center border border-primary">
                    <Icon.CashCoin className="text-primary" />
                  </div>
                </Col>
                <Col>
                  <div className="heading mb-0 sh-8 d-flex align-items-center lh-1-25 ps-3">Balanço do mês</div>
                </Col>
                <Col xs="auto" className="ps-3">
                  <div className="display-5 text-primary">{balance?.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</div>
                </Col>
              </Row>
            </Card.Body>
            <CreateTransactionModal />
          </Card>
        </Col>
      </Row>
    </Row>
  );
}
