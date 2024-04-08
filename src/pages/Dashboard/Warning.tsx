import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate para redirecionar

const Warning = ({ onHide }) => {
  const navigate = useNavigate(); // Inicialize useNavigate
  const [show, setShow] = useState(false);

  useEffect(() => {
    const modalShown = localStorage.getItem('modalShown');
    if (!modalShown) {
      setShow(true);
      localStorage.setItem('modalShown', 'true');
    }
  }, []);

  const handleFollowProgress = () => {
    navigate('/app/ferramentas/road-map'); // Redirecione para a rota específica
  };

  // Modifique a ação do link para evitar o recarregamento da página e utilizar o navigate do react-router-dom
  const handleLinkClick = (e) => {
    e.preventDefault();
    handleFollowProgress();
  };

  return (
    <Modal size="lg" show={show} onHide={() => { setShow(false); onHide(); }} centered>
      <Modal.Header closeButton>
        <Modal.Title>Aviso super importante 😆</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Desenvolvido em 2021 por uma equipe de nutricionistas brasileiros e programadores, alcançou 10 mil usuários e evoluiu para a versão 2.0, incorporando tecnologias avançadas para maior rapidez e segurança na prática clínica. A versão 2.0 ainda está em desenvolvimento, porém é possível monitorar nosso avanço <a href="#" onClick={handleLinkClick} className="link-primary">aqui</a>.</p>
        <p>Note que ainda estamos finalizando algumas funcionalidades, as quais serão anunciadas à medida que estiverem disponíveis.</p>
        <h5>🚀 <strong>Funcionalidades disponíveis:</strong></h5>
         <p>
        - Formulário pré-consulta <br></br>
        - Plano alimentar clássico <br></br>
        - Plano alimentar por grupos <br></br>
        - Plano alimentar qualitativo <br></br>
        - Receitas culinárias <br></br>
        - Avaliação antropométrica do adulto <br></br>
        - Compartilhar materiais <br></br>
        - Orientações gerais <br></br>
        - Anamnese <br></br>
         </p>
        <p>Faça parte dessa inovação! Teste as funcionalidades disponíveis e envie suas primeiras impressões para o nosso WhatsApp de suporte. 💚🙏🏻</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { setShow(false); onHide(); }}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleFollowProgress}>
          Acompanhar evolução
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Warning;
