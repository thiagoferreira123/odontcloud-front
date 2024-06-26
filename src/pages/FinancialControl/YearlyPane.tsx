import * as Icon from 'react-bootstrap-icons';
import { Card, Col, Row, Table } from 'react-bootstrap';
import YearFilter from './YearFilter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { months, useFiltersStore } from './hooks/FiltersStore';
import useTransactionStore from './hooks/TransactionStore';
import { AppException } from '../../helpers/ErrorHelpers';
import { Transaction, TransactionTypeOptions } from './hooks/TransactionStore/types';
import { parseBrValueToNumber, parseToBrValue } from '../../helpers/StringHelpers';

interface MonthValues {
  month: string;
  value: number;
}

interface TransactionCategoryGroup {
  category: string;
  months: MonthValues[];
}

export default function YearlyPane() {
  const selectedYear = useFiltersStore((state) => state.selectedYear);

  const defaultMonthValues: MonthValues[] = months.map((month) => ({ month: month.label, value: 0 }));

  const { getTransactionsByPeriod } = useTransactionStore();

  const getTransactionsByPeriod_ = async () => {
    try {
      if (!selectedYear) throw new AppException('Selecione um ano para visualizar as transações');

      const response = await getTransactionsByPeriod('', selectedYear.value);

      if (response === false) throw new Error('Error');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({
    queryKey: ['my-transactions', selectedYear?.value],
    queryFn: getTransactionsByPeriod_,
    enabled: !!selectedYear,
  });

  const entranceCategories = result.data?.reduce((acc: TransactionCategoryGroup[], transaction: Transaction) => {
    const category = acc.find((group) => group.category === transaction.financial_control_category);

    if (transaction.financial_control_entry_or_exit !== TransactionTypeOptions.ENTRANCE) return acc;

    if (category) {
      const transactionMonth = new Date(transaction.financial_control_date).getMonth();

      const month = category.months.find((month) => month.month === months[transactionMonth].label);

      if (month) {
        month.value += parseBrValueToNumber(transaction.financial_control_value);
      } else {
        category.months.push({
          month: months[transactionMonth].label,
          value: parseBrValueToNumber(transaction.financial_control_value),
        });
      }
    } else {
      acc.push({
        category: transaction.financial_control_category,
        months: defaultMonthValues.map((month) => {
          if (month.month === months[new Date(transaction.financial_control_date).getMonth()].label) {
            return {
              month: month.month,
              value: parseBrValueToNumber(transaction.financial_control_value),
            };
          }

          return month;
        }),
      });
    }

    return acc;
  }, []);

  const expenseCategories = result.data?.reduce((acc: TransactionCategoryGroup[], transaction: Transaction) => {
    const category = acc.find((group) => group.category === transaction.financial_control_category);

    if (transaction.financial_control_entry_or_exit !== TransactionTypeOptions.OUTPUT) return acc;

    if (category) {
      const transactionMonth = new Date(transaction.financial_control_date).getMonth();

      const month = category.months.find((month) => month.month === months[transactionMonth].label);

      if (month) {
        month.value += parseBrValueToNumber(transaction.financial_control_value);
      } else {
        category.months.push({
          month: months[transactionMonth].label,
          value: parseBrValueToNumber(transaction.financial_control_value),
        });
      }
    } else {
      acc.push({
        category: transaction.financial_control_category,
        months: defaultMonthValues.map((month) => {
          if (month.month === months[new Date(transaction.financial_control_date).getMonth()].label) {
            return {
              month: month.month,
              value: parseBrValueToNumber(transaction.financial_control_value),
            };
          }

          return {...month};
        }),
      });
    }

    return acc;
  }, []);

  const totalEntrance =
    result.data?.reduce((acc, transaction) => {
      return transaction.financial_control_entry_or_exit === TransactionTypeOptions.ENTRANCE ? acc + parseBrValueToNumber(transaction.financial_control_value) : acc;
    }, 0) ?? 0;
  const totalExpense =
    result.data?.reduce((acc, transaction) => {
      return transaction.financial_control_entry_or_exit === TransactionTypeOptions.OUTPUT ? acc + parseBrValueToNumber(transaction.financial_control_value) : acc;
    }, 0) ?? 0;
  const balance = totalEntrance - totalExpense;

  return (
    <Row>
      <Card>
        <Card.Body>
          <Row>
            <YearFilter />
          </Row>
          <div className="scroll-out">
            <div className="override-native overflow-auto sh-30 pe-3 mt-3">
              <div className="bg-gradient-light sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center">
                <Icon.GraphUpArrow className="text-white" />
              </div>
              <section className="scroll-section" id="stripedRows">
                <Table striped>
                  <thead>
                    <tr>
                      <th scope="col">Categorias</th>
                      <th scope="col">Janeiro</th>
                      <th scope="col">Fevereiro</th>
                      <th scope="col">Março</th>
                      <th scope="col">Abril</th>
                      <th scope="col">Maior</th>
                      <th scope="col">Junho</th>
                      <th scope="col">Julho</th>
                      <th scope="col">Agosto</th>
                      <th scope="col">Setembro</th>
                      <th scope="col">Outubro</th>
                      <th scope="col">Novembro</th>
                      <th scope="col">Dezembro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entranceCategories?.map((category) => (
                      <tr key={category.category}>
                        <th>{category.category}</th>
                        {category.months.map((month) => (
                          <td key={month.month}>
                            + {month.value ? parseToBrValue(month.value).replace('R$ ', '') : 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </section>
            </div>
          </div>
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Body>
          <div className="scroll-out">
            <div className="override-native overflow-auto sh-30 pe-3">
              <div className="bg-gradient-danger sw-6 sh-6 rounded-xl d-flex justify-content-center align-items-center ">
                <Icon.GraphDownArrow className="text-white" />
              </div>
              <section className="scroll-section" id="stripedRows">
                <Table striped>
                  <thead>
                    <tr>
                      <th scope="col">Categorias</th>
                      <th scope="col">Janeiro</th>
                      <th scope="col">Fevereiro</th>
                      <th scope="col">Março</th>
                      <th scope="col">Abril</th>
                      <th scope="col">Maior</th>
                      <th scope="col">Junho</th>
                      <th scope="col">Julho</th>
                      <th scope="col">Agosto</th>
                      <th scope="col">Setembro</th>
                      <th scope="col">Outubro</th>
                      <th scope="col">Novembro</th>
                      <th scope="col">Dezembro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseCategories?.map((category) => (
                      <tr key={category.category}>
                        <th>{category.category}</th>
                        {category.months.map((month) => (
                          <td key={month.month}>
                            + {month.value ? parseToBrValue(month.value).replace('R$ ', '') : 0}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </section>
            </div>
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
                  <div className="display-5 text-primary">{parseToBrValue(totalEntrance)}</div>
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
                  <div className="display-5 text-danger">{parseToBrValue(totalExpense)}</div>
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
                  <div className="heading mb-0 sh-8 d-flex align-items-center lh-1-25 ps-3">Balanço do ano</div>
                </Col>
                <Col xs="auto" className="ps-3">
                  <div className="display-5 text-primary">{parseToBrValue(balance)}</div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Row>
  );
}
