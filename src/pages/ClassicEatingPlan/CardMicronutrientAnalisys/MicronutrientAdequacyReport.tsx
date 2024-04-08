import StaticLoading from '/src/components/loading/StaticLoading';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import React from 'react';
import { Col, ProgressBar, Row } from 'react-bootstrap';
import useClassicPlan from '../hooks/useClassicPlan';
import { useDriStore } from '../hooks/driStore';
import { useQuery } from '@tanstack/react-query';
import { parseFloatNumber } from '/src/helpers/MathHelpers';

export default function MicronutrientAdequacyReport() {
  const style = {
    height: '.7rem',
  };

  const patientID = useClassicPlan((state) => state.patientID);
  const meals = useClassicPlan((state) => state.meals);
  const driContent = useDriStore((state) => state.driContent);
  const microNutrients = useDriStore((state) => state.microNutrients);

  const { getDriContent } = useDriStore();
  const { getFoodsData } = useClassicPlan();

  const getDri_ = async () => {
    if (!patientID) return Promise.resolve({});

    const foods = await getFoodsData(meals);

    const driContent = await getDriContent(patientID, foods);
    return driContent;
  };

  const resultDri = useQuery({ queryKey: ['driContent'], queryFn: getDri_ });

  if (resultDri.isLoading) {
    return (
      <div className="h-100 w-100">
        <StaticLoading />
      </div>
    );
  } else if (resultDri.isError) {
    return (
      <div className="h-100 w-100">
        <h2>Error...</h2>
      </div>
    );
  }

  return (
    <>
      {microNutrients.map((microNutrient) => (
        <Row className="g-0 align-items-center mb-2 sh-6" key={microNutrient.name}>
          <Col>
            <Row className="g-0">
              <Col xs="6">
                <div className="sh-3 d-flex align-items-center lh-1-25">
                  {microNutrient.title} ({microNutrient.percentage}% das necessidades atingidas)
                </div>
              </Col>
              <Col xs="3">
                <div className="sh-3 d-flex align-items-center lh-1-25">
                  <strong>{parseFloatNumber(microNutrient.actualValue ?? 0)}</strong>/{parseFloatNumber(microNutrient.value ?? 0)}
                  {microNutrient.measure}{' '}
                </div>
              </Col>
              <Col xs="3" md="3" className="d-flex align-items-center justify-content-md-center mb-1 mb-md-0">
                {!Number(microNutrient.value) ? null : Number(microNutrient.actualValue) >= Number(microNutrient.value) * 1.1 ? (
                  <CsLineIcons icon="trend-down" className="me-1 text-danger" size={13} />
                ) : Number(microNutrient.actualValue) <= Number(microNutrient.value) * 0.9 ? (
                  <CsLineIcons icon="trend-up" className="me-1 text-danger" size={13} />
                ) : (
                  <CsLineIcons icon="check" className="me-1 text-success" size={13} />
                )}
                <span
                  className={`text ${
                    !Number(microNutrient.value)
                      ? 'text-muted'
                      : Number(microNutrient.actualValue) >= Number(microNutrient.value) * 1.1 ||
                        Number(microNutrient.actualValue) <= Number(microNutrient.value) * 0.9
                      ? 'text-danger'
                      : 'text-success'
                  }`}
                >
                  {Math.abs(Number(microNutrient.difference))}mg
                </span>
              </Col>
            </Row>
            <ProgressBar now={microNutrient.percentage} className="progress-xs" style={style} />
          </Col>
        </Row>
      ))}

      <div className="align-right align-items-center text-medium mt-3">
        <CsLineIcons icon="book" className="me-1" size={18} />
        <span className="text-medium">
          Food and Nutrition Board / IOM ({driContent ? driContent.grupo : '...'} {driContent ? `${driContent.idade_min} - ${driContent.idade_max}` : '...'}{' '}
          anos)
        </span>
      </div>
    </>
  );
}
