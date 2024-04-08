import React from 'react'
import { Button, Card, useAccordionButton } from 'react-bootstrap';

interface CustomAccordionToggleProps {
  children: React.ReactNode;
  eventKey: string;
}

export default function CustomAccordionToggle({ children, eventKey }: CustomAccordionToggleProps) {
  const decoratedOnClick = useAccordionButton(eventKey, () => { });

  return (
    <Card.Body className="py-4" onClick={decoratedOnClick} role="button">
      <Button variant="link" className="list-item-heading p-0 fw-bold my-custom-link">
        {children}
      </Button>
    </Card.Body>
  );
}