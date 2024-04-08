import React, { useMemo, useState } from 'react';
import { Accordion, Button, Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { Event, eventData } from './constants';
import Pill from './Pill';
import useSignsSymptomsStore from './hooks/SignsSymptomsStore';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import AsyncButton from '../../components/AsyncButton';
import { notify } from '../../components/toast/NotificationIcon';
import PatientMenuRow from '../../components/PatientMenuRow';
import usePatientMenuStore from '../PatientMenu/hooks/patientMenuStore';

const SignsSymptoms: React.FC = () => {
  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();
  const [clickedButtons, setClickedButtons] = useState<{ [key: string]: boolean }>({});
  const [deficiencyEvidence, setDeficiencyEvidence] = useState<{ [deficiency: string]: number }>({});
  const [excessEvidence, setExcessEvidence] = useState<{ [excess: string]: number }>({});
  const [isSaving, setIsSaving] = useState(false);

  // Agrupar eventos por body_part usando useMemo para otimização
  const eventsGroupedByBodyPart = useMemo(
    () =>
      eventData.reduce<Record<string, Event[]>>((acc, event) => {
        const { body_part } = event;
        if (!acc[body_part]) {
          acc[body_part] = [];
        }
        acc[body_part].push(event as Event); // Cast the object to type Event
        return acc;
      }, {}),
    [eventData]
  );

  const { getSignsSymptom, updateSignsSymptom } = useSignsSymptomsStore();
  const { setPatientId } = usePatientMenuStore();

  const getSignsSymptom_ = async () => {
    try {
      if (!id) throw new Error('Id not found');

      const response = await getSignsSymptom(id);

      if (response === false) throw new Error('Error');

      response.patient_id && setPatientId(response.patient_id);

      rebuildStatesFromSelectedEvents(JSON.parse(response.symptoms));

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const rebuildStatesFromSelectedEvents = (selectedEventNames: string[]) => {
    const initialDeficiencyEvidence: { [deficiency: string]: number } = {};
    const initialExcessEvidence: { [excess: string]: number } = {};

    selectedEventNames?.forEach((eventName) => {
      const event = eventData.find((event) => event.name === eventName);

      if (event) {
        event.deficiencies?.split('@').forEach((deficiency) => {
          initialDeficiencyEvidence[deficiency as string] = (initialDeficiencyEvidence[deficiency as string] || 0) + 1;
        });

        event.excesses.split('@').forEach((excess) => {
          initialExcessEvidence[excess as string] = (initialExcessEvidence[excess as string] || 0) + 1;
        });
      }
    });

    // Atualize os estados com os dados reconstruídos
    setDeficiencyEvidence(initialDeficiencyEvidence);
    setExcessEvidence(initialExcessEvidence);
    // Garanta que os botões correspondentes sejam marcados como selecionados
    const newClickedButtons = selectedEventNames?.reduce((acc, name) => ({ ...acc, [name]: true }), {}) ?? [];
    setClickedButtons(newClickedButtons);
  };

  const handleButtonClick = (name: string, deficiencies: string, excesses: string) => {
    const wasClicked = clickedButtons[name];

    // Atualiza o estado para alternar a seleção do botão
    setClickedButtons((prev) => ({ ...prev, [name]: !prev[name] }));

    // Divide as strings de deficiências e excessos em arrays
    const deficienciesArray = deficiencies?.split('@').filter((def) => def) ?? [];
    const excessesArray = excesses?.split('@').filter((exc) => exc) ?? [];

    // Atualiza o estado de deficiências e excessos
    // Se o botão foi desmarcado, decrementa a contagem ou remove a deficiência/excesso do estado
    // Se o botão foi marcado, incrementa a contagem
    const updateEvidence = (itemList: any[], evidenceStateUpdater: { [x: string]: number }, isDecrementing: boolean) => {
      const updatedEvidence = { ...evidenceStateUpdater };

      itemList.forEach((item) => {
        if (isDecrementing) {
          // Decrementa a contagem ou remove se chegar a zero
          if (updatedEvidence[item] > 1) {
            updatedEvidence[item] -= 1;
          } else {
            delete updatedEvidence[item];
          }
        } else {
          // Incrementa a contagem
          updatedEvidence[item] = (updatedEvidence[item] || 0) + 1;
        }
      });

      return updatedEvidence;
    };

    setDeficiencyEvidence((prev) => updateEvidence(deficienciesArray, prev, wasClicked));
    setExcessEvidence((prev) => updateEvidence(excessesArray, prev, wasClicked));
  };

  const onSubmit = async () => {
    setIsSaving(true);

    try {
      if (!id) throw new Error('Id not found');

      const selectedEventNames = Object.entries(clickedButtons)
        .filter(([name, isSelected]) => isSelected)
        .map(([name]) => `${name}`);

      updateSignsSymptom({ id, symptoms: JSON.stringify(selectedEventNames) }, queryClient);

      setIsSaving(false);
    } catch (error) {
      console.error(error);
    }
  };

  const result = useQuery({ queryKey: ['signs-symptoms', id], queryFn: getSignsSymptom_ });

  if (result.isLoading) {
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );
  } else if (result.isError) {
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <div className="text-center w-100">
          <h2 className="mb-3">Erro ao buscar sinais e sintomas</h2>
        </div>
      </div>
    );
  }

  return (
    <Row className="d-flex">
    <PatientMenuRow />

      <Col xl={8}>
        <Card className="mb-3">
          <Accordion defaultActiveKey="0">
            {Object.entries(eventsGroupedByBodyPart).map(([bodyPart, events], index) => (
              <Accordion.Item eventKey={String(index)} key={index}>
                <Accordion.Header>{bodyPart}</Accordion.Header>
                <Accordion.Body>
                  {events.map((event: Event) => (
                    <OverlayTrigger key={event.name} placement="top" overlay={<Tooltip id={`tooltip-${event.name}`}>{event.description}</Tooltip>}>
                      <Button
                        variant={clickedButtons[event.name] ? 'primary' : 'outline-primary'} // Ajusta a variante com base no estado de clique
                        onClick={() => handleButtonClick(event.name, event.deficiencies, event.excesses)}
                        className="mb-2 me-1"
                      >
                        {event.name}
                      </Button>
                    </OverlayTrigger>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card>
      </Col>

      <Col xl={4}>
        <Card className="mb-3">
          <Card.Body>
            <h5 className="text-center">Possíveis deficiências</h5>
            <p className="text-medium text-center">Quanto mais forte for, a tonalidade do verde, maior será a probabilidade de deficiência</p>
            <div className="d-flex flex-wrap justify-content-center">
              {Object.entries(deficiencyEvidence).map(([deficiency, level], index) => (
                <Pill key={index} level={level}>
                  {deficiency}
                </Pill>
              ))}
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-3">
          <Card.Body>
            <h5 className="text-center">Possíveis excessos</h5>
            <p className="text-medium text-center">Quanto mais forte for, a tonalidade do verde, maior será a probabilidade de excesso</p>
            <div className="d-flex flex-wrap justify-content-center">
              {Object.entries(excessEvidence).map(([excess, level], index) => (
                <Pill key={index} level={level}>
                  {excess}
                </Pill>
              ))}
            </div>
          </Card.Body>
        </Card>

        <div className="text-center">
          <AsyncButton isSaving={isSaving} onClickHandler={onSubmit}>
            Salvar dados
          </AsyncButton>
        </div>
      </Col>
    </Row>
  );
};

export default SignsSymptoms;
