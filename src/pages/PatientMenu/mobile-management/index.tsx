import { Alert, Button, Card, Form, Row } from 'react-bootstrap';
import usePatientMenuStore from '../hooks/patientMenuStore';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import AsyncButton from '../../../components/AsyncButton';
import { ptBR } from 'date-fns/locale/pt-BR';
import { notify } from '../../../components/toast/NotificationIcon';
import { parseIsoToDate } from '../../../helpers/DateHelper';
registerLocale('pt-BR', ptBR);

export default function MobileManagement() {
  const patient = usePatientMenuStore((state) => state.patient);

  const [startDate, setStartDate] = useState<Date | null>(patient?.inactivateAppDate ? parseIsoToDate(patient.inactivateAppDate) : new Date());
  const [isSaving, setIsSaving] = useState(false);

  const { updatePatient, persistUpdatePatient } = usePatientMenuStore();

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      if(!patient?.id) throw new Error('Patient not found');

      const payload = {
        appPlansOnOrOff: patient.appPlansOnOrOff,
        appAnthropometryOnOrOff: patient.appAnthropometryOnOrOff,
        appGoalsOnOrOff: patient.appGoalsOnOrOff,
        appRecipesOnOrOff: patient.appRecipesOnOrOff,
        appSuplementationOnOrOff: patient.appSuplementationOnOrOff,
        appDialyOnOrOff: patient.appDialyOnOrOff,
        inactivateAppDate: startDate?.toISOString() ?? null,
      };

      const response = await persistUpdatePatient({...payload, id: patient.id});

      if(!response) throw new Error('Error updating patient');

      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      console.error(error);
      notify('Erro ao salvar as alterações', 'Erro', 'close', 'danger');
    }

  };

  const handleChangeCheckInputValue = (key: string, checked: any) => {
    updatePatient({ [key]: checked ? 1 : 0 });
  }

  return (
    <>
      <Card>
        <Card.Body className="mb-n3">
          <Row className="g-0 sh-6 text-center mb-3">
            <Alert>Configure os materiais que você deseja, que o paciente tenha acesso. Além da data de expiração.</Alert>
          </Row>
          <div className="mb-3">
            <Form.Check
              type="switch"
              id="checkedSwitch"
              label="Habilitar visualização dos planos alimentares."
              defaultChecked={patient?.appPlansOnOrOff ? true : false}
              onChange={(e) => handleChangeCheckInputValue('appPlansOnOrOff', e.target.checked)}
            />
            <Form.Check
              type="switch"
              id="checkedSwitch"
              label="Habilitar visualização dos registros alimentares."
              defaultChecked={patient?.appDialyOnOrOff ? true : false}
              onChange={(e) => handleChangeCheckInputValue('appDialyOnOrOff', e.target.checked)}
            />
            <Form.Check
              type="switch"
              id="checkedSwitch"
              label="Habilitar visualização das receitas culinárias."
              defaultChecked={patient?.appRecipesOnOrOff ? true : false}
              onChange={(e) => handleChangeCheckInputValue('appRecipesOnOrOff', e.target.checked)}
            />
            <Form.Check
              type="switch"
              id="checkedSwitch"
              label="Habilitar visualização das antropometrias."
              defaultChecked={patient?.appAnthropometryOnOrOff ? true : false}
              onChange={(e) => handleChangeCheckInputValue('appAnthropometryOnOrOff', e.target.checked)}
            />
            <Form.Check type="switch" id="checkedSwitch" label="Habilitar visualização das metas." defaultChecked={patient?.appGoalsOnOrOff ? true : false} />
          </div>
          <Row className="d-flex">
            <div>Bloquear automaticamente o aplicativo na data:</div>
            <div className="w-20">
              <DatePicker className="form-control" selected={startDate} onChange={(date) => setStartDate(date)} locale="pt-BR" dateFormat="dd/MM/yyyy" />
            </div>
            <div className="mt-3 text-center">
              <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} variant="primary" className="mb-1 hover-scale-up">
                Salvar alterações
              </AsyncButton>{' '}
            </div>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}
