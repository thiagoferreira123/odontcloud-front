import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import ModalPremium from './ModalPremium';

export const CtaIntrodutionVideo = () => {
  const [showModalPremium, setShowModalPremium] = useState(false);
  return (
    <Card className="w-100 sh-30 hover-img-scale-up">
      <img src="/img/banner/nutri.webp" className="card-img h-100 scale" alt="card image" />
      <div className="card-img-overlay d-flex flex-column justify-content-between bg-transparent">
        <div>
          <div className="cta-3 mb-3 text-white w-75 w-md-50">Junte-se ao OdontCloud! <br></br>E decole na sua carreira!</div>
          <Button variant="primary" className="btn-icon btn-icon-start stretched-link" onClick={() => setShowModalPremium(true)}>
            <Icon.Trophy size={20} className='me-2'/> <span>Ativar modo Premium</span>{' '}
          </Button>
        </div>
      </div>
      <ModalPremium showModal={showModalPremium} setShowModal={setShowModalPremium} />
    </Card>
  );
};


