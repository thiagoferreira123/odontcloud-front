import { Accordion } from 'react-bootstrap';
import { symptons } from '../constants/symptons';
import Symptom, { Sympton } from './Symptom';

type SymptomGroup = {
  category: string;
  symptons: Sympton[];
};

const symptonGroups = symptons.reduce((acc: SymptomGroup[], sympton) => {
  const groupIndex = acc.findIndex((group) => group.category === sympton.category);

  if (groupIndex === -1) {
    acc.push({ category: sympton.category, symptons: [sympton] });
  } else {
    acc[groupIndex].symptons.push(sympton);
  }

  return acc;
}, []);

export default function Symptons() {
  return (
    <Accordion flush>
      {symptonGroups.map((symptonGroup) => (
        <Accordion.Item eventKey={symptonGroup.category} key={symptonGroup.category}>
          <Accordion.Header as="div">
            <h3 className="text-alternate">{symptonGroup.category}</h3>
          </Accordion.Header>
          <Accordion.Body>
            {symptonGroup.symptons.map((symptom) => (
              <Symptom key={symptom.id} symptom={symptom} />
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
