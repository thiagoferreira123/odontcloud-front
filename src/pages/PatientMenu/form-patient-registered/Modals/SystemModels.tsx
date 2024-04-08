import { useSystemFormsQuery } from '../hooks/queries';
import { Button, Col, Row, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Empty from '../../../../components/Empty';
import { appRoot } from '../../../../routes';
import { useConfigFormModalStore } from '../hooks/ConfigFormModalStore';

const SystemModels = () => {
  const { id } = useParams();

  const { data = [], isFetching, isError } = useSystemFormsQuery();

  const isEmpty = !isError && !isFetching && !data.length;

  const { handleSelectForm } = useConfigFormModalStore();

  if (isEmpty) {
    return <Empty message="Não há modelos criados pelo sistema"></Empty>;
  }
  return (
    <>
      {isFetching ? (
        <div style={{ height: '200px' }} className="d-flex mt-2 justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="overflow-auto override-native sh-35 pe-3">
          {data.map((model) => (
            <div key={model.id} className="border-bottom border-separator-light mb-2 pb-2">
              <Row className="g-0 sh-6">
                <Col md={12}>
                  <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                    <div className="d-flex flex-column">
                      <div>{model.nome}</div>
                    </div>
                    <div className="d-flex">
                      <Button variant="outline-secondary" size='sm' className="ms-1" onClick={() => handleSelectForm({...model, id: undefined})}>
                        Selecionar
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SystemModels;
