import classNames from 'classnames';
import { formatDateToPrint } from '../../../helpers/Utils';
import { useCalendarStore } from '../hooks';
import { Modal, Table } from 'react-bootstrap';
import { AppException } from '../../../helpers/ErrorHelpers';
import { notify } from '../../../components/toast/NotificationIcon';
import { useQuery } from '@tanstack/react-query';
import useScheduleHistoryStore from '../hooks/ScheduleHistoryStore';
import { useModalHistoricStore } from '../hooks/modals/ModalHistoricStore';
import { ScheduleHistoryOwnerType } from '../hooks/ScheduleHistoryStore/types';

const ModalHistoric = () => {
  const { selectedLocal } = useCalendarStore((state) => state);
  const showModal = useModalHistoricStore((state) => state.showModal);

  const { getScheduleHistorys } = useScheduleHistoryStore();
  const { hideModal } = useModalHistoricStore();

  const getScheduleHistorys_ = async () => {
    try {
      if (!selectedLocal?.id) throw new AppException('Local não selecionado');

      const result = await getScheduleHistorys(selectedLocal?.id);

      if (result === false) throw new Error('Could not get histories');

      return result;
    } catch (error) {
      console.error(error);

      error instanceof AppException && notify(error.message, 'Erro', 'close', 'danger');

      throw error;
    }
  };

  const result = useQuery({ queryKey: ['schedule-history'], queryFn: getScheduleHistorys_, enabled: !!selectedLocal?.id });

  if (!showModal) return null;

  return (
    <Modal className="modal-close-out" size="lg" show={showModal} onHide={hideModal} backdrop="static" keyboard={false}>
      <div
        className={classNames('mb-5', {
          'overlay-spinner': result.isLoading,
        })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Histórico de ações dentro da agenda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="scroll-out">
            <div className="override-native overflow-auto sh-35 pe-3">
              <Table striped>
                <thead>
                  <tr>
                    <th scope="col">Quem fez o registro?</th>
                    <th scope="col">Data do registro</th>
                    <th scope="col">Oque foi feito?</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data?.map((history) => (
                    <tr key={history.calendar_history_id}>
                      <th>
                        {history.calendar_history_owner_type === ScheduleHistoryOwnerType.COLABORADOR
                          ? history.calendar_history_colaborator?.nome ?? '...'
                          : history.calendar_history_professional?.nome_completo ?? '...'
                          }
                      </th>
                      <td> {formatDateToPrint(history.calendar_history_date)}</td>
                      <td> {history.calendar_history_description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default ModalHistoric;
