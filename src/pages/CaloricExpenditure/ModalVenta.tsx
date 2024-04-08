import React from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useCaloricExpenditureStore } from './hooks';

interface ModalVentaProps {
  showModal: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowModal: (show: boolean) => void;
}

const ModalVenta = ({ showModal, setShowModal }: ModalVentaProps) => {

  const desiredweightKg = useCaloricExpenditureStore((state) => state.desiredweightKg);

  const { setDesiredWeight } = useCaloricExpenditureStore();

  const handleChangeDesiredWeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDesiredWeight(event.target.value);
  }

  const handleSubmit = ()=> {
    setShowModal(false);
  }

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Método VENTA</Modal.Title>
      </Modal.Header>
      <Modal.Body className="mb-1">
        <Alert className='text-center'>
          O método VENTA calcula o ajuste calórico necessário no Gasto Energético Total (GET) para promover perda ou ganho de peso, baseando-se no Valor Energético do Tecido Adiposo, que corresponde a 7700kcal por quilograma de peso a ser alterado, dividido por 30 dias. Por exemplo, se o GET de um paciente é 2000 kcal e o ajuste sugerido pelo VENTA é de -500 kcal, a recomendação é de uma ingestão diária de 1500 kcal para alcançar o objetivo de peso estabelecido no período determinado.
        </Alert>
        <div className="form-floating me-2">
          <Form.Control type="number" value={desiredweightKg ? desiredweightKg : ''} onChange={handleChangeDesiredWeight}/>
          <Form.Label>OBJETIVO DE PERDA EM KILOS, POR MÊS. (Exemplo: 0.5 kg em 1 mês)</Form.Label>
        </div>
        <div className='text-center mt-3'>
          <Button variant="primary" className="hover-scale-down" type="submit" onClick={handleSubmit}>
           <span>Salvar</span>
          </Button>{' '}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalVenta;
