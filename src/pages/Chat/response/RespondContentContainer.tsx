import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Patient } from '../../../types/Patient';
import { getAvatarByGender } from '../../PatientMenu/hooks/patientMenuStore';

interface RespondContentContainerProps {
  user: Patient, children: React.ReactNode
}

const RespondContentContainer = ({ user, children }: RespondContentContainerProps) => {
  const { name, photoLink, gender } = user;

  return (
    <div className="mb-2 card-content">
      <Row className="g-2">
        <Col xs="auto" className="d-flex align-items-end">
          <div className="sw-5 sh-5 mb-1 d-inline-block position-relative">
            <img src={photoLink ? photoLink : getAvatarByGender(gender)} className="img-fluid rounded-xl chat-profile" alt={name} />
          </div>
        </Col>
        <Col className="d-flex align-items-end content-container">{children}</Col>
      </Row>
    </div>
  );
};
export default RespondContentContainer;
