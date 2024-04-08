import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Row, Table } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalAdmin from './ModalAdmin';

export default function AdminPanel() {
  // const [authenticated, setAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  // useEffect(() => {
  //   const password = prompt("Por favor, insira a senha para acessar esta página:");
  //   if (password === '8122') {
  //     setAuthenticated(true);
  //   } else {
  //     alert('Senha incorreta!');
  //     setAuthenticated(false);
  //   }
  // }, []);

  // if (!authenticated) {
  //   return null; 
  // }
  
  return (
    <>
      <Row className="justify-content-center">
        <Card body className="mb-5 p-0" style={{ maxWidth: '100%' }}>
          Filtros: Mês e ano, status, buscar por nome, email ou cpf <br></br>
          Botão para download dos selecionados (approved, expired) <br></br>
          React Window
          <Table striped responsive>
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Nome</th>
                <th scope="col">Aprovação</th>
                <th scope="col">Líquido</th>
                <th scope="col">Recorrência</th>
                <th scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th><Badge bg="danger" className="text-uppercase">Canceled</Badge></th>
                <td>Thiago Ferreira dos Santos<br></br><small>id: 83123186</small></td>
                <td>24/05/2023</td>
                <td>47.90</td>
                <td>Mensal</td>
                <td>
                  <Button
                    size="sm"
                    className='me-1'
                    onClick={() => setShowModal(true)}>
                    <Icon.Pencil />
                  </Button>
                </td>
              </tr>
              <tr>
                <th><Badge bg="warning" className="text-uppercase">Expired</Badge></th>
                <td>Thiago Ferreira <br></br><small>id: 83123186</small></td>
                <td>24/05/2023</td>
                <td>47.90</td>
                <td>Mensal</td>
                <td>
                  <Button
                    size="sm"
                    className='me-1'
                    onClick={() => setShowModal(true)}>
                    <Icon.Pencil />
                  </Button>
                </td>
              </tr>
              <tr>
                <th><Badge bg="success" className="text-uppercase">Approved</Badge></th>
                <td>Thiago Ferreira <br></br><small>id: 83123186</small></td>
                <td>24/05/2023</td>
                <td>47.90</td>
                <td>Mensal</td>
                <td>
                  <Button
                    size="sm"
                    className='me-1'
                    onClick={() => setShowModal(true)}>
                    <Icon.Pencil />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card>
        <ModalAdmin showModal={showModal} onHide={handleClose} />
      </Row>
       <Row className="justify-content-center">
        <Card body className="mb-5 p-0" style={{ maxWidth: '100%' }}>
          <Table striped responsive>
            <thead>
              <tr>
                <th scope="col">Status</th>
                <th scope="col">Nome</th>
                <th scope="col">Contato</th>
                <th scope="col">Registro</th>
                <th scope="col">Opções</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th><Badge bg="info" className="text-uppercase">Free</Badge></th>
                <td>Thiago Ferreira <br></br><small>id: 83123186</small></td>
                <td>5567998841541</td>
                <td>24/03/2024</td>
                <td>
                <Button
                    size="sm"
                    className='me-1'
                    onClick={() => setShowModal(true)}>
                    <Icon.Pencil />
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Row>
    </>
  );
}
