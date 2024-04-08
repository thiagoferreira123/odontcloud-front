import { Accordion, Card } from 'react-bootstrap';
import SkinFolds from './SkinFolds';
import WeigthAndHeigth from './WeigthAndHeigth';
import BoneDiameters from './BoneDiameters';
import Circunferences from './Circunferences';

export default function Parameters() {
  return (
    <>
      <section className="scroll-section" id="accordionCards">
        <Accordion className="mb-n2" defaultActiveKey="0">
          <Card className="d-flex mb-2 flex-grow-1">
            <WeigthAndHeigth />
          </Card>

          <Card className="d-flex mb-2 flex-grow-1">
            <Circunferences />
          </Card>

          <Card className="d-flex mb-2 flex-grow-1">
            <SkinFolds />
          </Card>

          <Card className="d-flex mb-2 flex-grow-1">
            <BoneDiameters />
          </Card>
        </Accordion>
      </section>
    </>
  );
}
