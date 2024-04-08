import React, { useState } from 'react';
import { Button, Card, Col, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import FormAnsweredByPatient from './FormAnsweredByPatient';
import FormRegisteredByUser from './FormRegisteredByUser';
import CollectFormFilesModal from './Modals/CollectFormFilesModal';
import HtmlHead from '../../components/html-head/HtmlHead';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { useConfigFormModalStore } from './Hooks/modals/ConfigFormModalStore';
import ConfigFormModal from './Modals/ModalConfig';
import ModalAddPatient from '../Dashboard/patients/modals/ModalAddPatient';

type ShowTypes = 'created' | 'answered';

const Form = () => {
  const title = 'Formulários pré-consulta';
  const [show, setShow] = useState<ShowTypes>('created');

  const { showConfigFormModal } = useConfigFormModalStore();

  return (
    <>
      <HtmlHead title={title} />
      {/* Title Start */}
      <div className="page-title-container">
        <h1 className="mb-0 pb-0 display-4">{title}</h1>
      </div>
      {/* Title End */}

      <Row className="d-flex justify-content-center">
        <Col md={12} className="mb-5">
          <Card>
            <div className="mb-3 mt-4 d-flex justify-content-center">
              <ToggleButtonGroup type="radio" defaultValue="created" className="mb-2 d-block" name="buttonOptions1">
                <ToggleButton id="tbg-radio-1" checked={show === 'created'} onChange={() => setShow('created')} value="created" variant="outline-primary">
                  Formulários criados
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" onChange={() => setShow('answered')} value="answered" checked={show === 'answered'} variant="outline-primary">
                  Formulários respondidos
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <Card.Body className="mb-n3 border-last-none">
              <div className="scroll-out">
                <div className="override-native overflow-auto sh-50 pe-3">{show === 'created' ? <FormRegisteredByUser /> : <FormAnsweredByPatient />}</div>
              </div>
            </Card.Body>
          </Card>

          <div className="text-center mt-2">
            <Button variant="primary" size="lg" className="hover-scale-down" onClick={showConfigFormModal}>
              <CsLineIcons icon="plus" /> <span>Cadastrar um novo formulário</span>
            </Button>{' '}
          </div>
        </Col>
      </Row>

      <CollectFormFilesModal />
      <ConfigFormModal />
      <ModalAddPatient />
    </>
  );
};

export default Form;
