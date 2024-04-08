import React, { useCallback, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FormLabel, Col } from 'react-bootstrap';
import useMacrosStore from '../../hooks/useMacrosStore';

const SliderPercentages = () => {
  const vrCarboidratos = useMacrosStore((state) => state.vrCarboidratos);
  const vrLipideos = useMacrosStore((state) => state.vrLipideos);
  const vrProteinas = useMacrosStore((state) => state.vrProteinas);
  const { setPredition } = useMacrosStore();

  const [value, setValue] = useState([Number(vrCarboidratos), 100 - Number(vrLipideos)]);

  const handleChangevalue = (newValue: [number, number]) => {
    setValue(newValue);

    const carbohydrates = newValue[0];
    const lipids = 100 - newValue[1];
    const proteins = 100 - carbohydrates - lipids;

    setPredition({
      vrCarboidratos: carbohydrates.toFixed(1),
      vrLipideos: lipids.toFixed(1),
      vrProteinas: proteins.toFixed(1),
    });
  };

  const handleChangePercentages = useCallback(() => {
    const carbsValue = Number(vrCarboidratos);
    const lipidsValue = 100 - Number(vrLipideos);
    const proteinsValue = carbsValue + Number(vrProteinas);

    if (value[0] !== carbsValue || value[1] !== lipidsValue) {
      setValue([carbsValue, lipidsValue]);

      const newVrProteinas = 100 - carbsValue - Number(vrLipideos);

      setPredition({
        vrProteinas: newVrProteinas > 100 ? 100 : newVrProteinas < 0 ? 0 : newVrProteinas,
      });
    } else if(vrProteinas && value[1] !== proteinsValue) {

      const newVrLipideos = 100 - Number(proteinsValue);

      setPredition({
        vrLipideos: newVrLipideos > 100 ? 100 : newVrLipideos < 0 ? 0 : newVrLipideos,
      });
    }
  }, [vrCarboidratos, vrLipideos, vrProteinas, value, setPredition]);

  useEffect(() => {
    handleChangePercentages();
  }, [handleChangePercentages, vrCarboidratos, vrLipideos, vrProteinas]);

  return (
    <>
      <Col>
        <FormLabel>Carboidratos / Proteínas / Lipídeos:</FormLabel>
        <Slider
          range
          allowCross={false}
          value={value}
          onChange={(value: number | number[]) => handleChangevalue(value as [number, number])}
          aria-valuemin={0}
          aria-valuemax={100}
          marks={{ 0: 0, 25: 25, 50: 50, 75: 75, 100: 100 }}
        />
      </Col>
    </>
  );
};

export default SliderPercentages;
