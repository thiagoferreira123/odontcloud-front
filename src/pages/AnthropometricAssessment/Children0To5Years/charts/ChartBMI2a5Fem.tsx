import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '/src/types/Interface';
import { useParametersStore } from '../Parameters/hooks';
import { ChartTypeRegistry } from 'chart.js';
import { isValidNumber } from '/src/helpers/MathHelpers';
import { calculateBMI } from '../Results/helpers/GeneralEquations';

const ChartBMI2a5Fem = () => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const patientAge = useParametersStore((state) => state.patientAge);
  const height = useParametersStore((state) => state.height);
  const weight = useParametersStore((state) => state.weight);

  const chartContainer = useRef(null);

  const months = useMemo(
    () => [
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35',
      '36',
      '37',
      '38',
      '39',
      '40',
      '41',
      '42',
      '43',
      '44',
      '45',
      '46',
      '47',
      '48',
      '49',
      '50',
      '51',
      '52',
      '53',
      '54',
      '55',
      '56',
      '57',
      '58',
      '59',
      '60',
    ],
    []
  );
  const P3Data = useMemo(
    () => [
      13.5, 13.4, 13.4, 13.4, 13.4, 13.4, 13.3, 13.3, 13.3, 13.3, 13.2, 13.2, 13.2, 13.2, 13.2, 13.1, 13.1, 13.1, 13.1, 13.0, 13.0, 13.0, 13.0, 13.0, 12.9,
      12.9, 12.9, 12.9, 12.9, 12.9, 12.9, 12.9, 12.8, 12.8, 12.8, 12.8, 12.8,
    ],
    []
  );
  const P15Data = useMemo(
    () => [
      14.4, 14.4, 14.4, 14.3, 14.3, 14.3, 14.3, 14.2, 14.2, 14.2, 14.2, 14.1, 14.1, 14.1, 14.1, 14.1, 14.0, 14.0, 14.0, 14.0, 14.0, 14.0, 13.9, 13.9, 13.9,
      13.9, 13.9, 13.9, 13.9, 13.9, 13.9, 13.9, 13.8, 13.8, 13.8, 13.8, 13.8,
    ],
    []
  );
  const P50Data = useMemo(
    () => [
      15.7, 15.7, 15.6, 15.6, 15.6, 15.6, 15.5, 15.5, 15.5, 15.5, 15.4, 15.4, 15.4, 15.4, 15.4, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3,
      15.3, 15.3, 15.3, 15.2, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3, 15.3,
    ],
    []
  );
  const P85Data = useMemo(
    () => [
      17.2, 17.1, 17.1, 17.1, 17.0, 17.0, 17.0, 17.0, 16.9, 16.9, 16.9, 16.9, 16.9, 16.8, 16.8, 16.8, 16.8, 16.8, 16.8, 16.8, 16.8, 16.8, 16.8, 16.8, 16.8,
      16.8, 16.8, 16.8, 16.9, 16.9, 16.9, 16.9, 16.9, 16.9, 16.9, 16.9, 17.0,
    ],
    []
  );
  const P97Data = useMemo(
    () => [
      18.5, 18.5, 18.5, 18.4, 18.4, 18.4, 18.3, 18.3, 18.3, 18.3, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.2, 18.3, 18.3, 18.3, 18.3,
      18.3, 18.3, 18.4, 18.4, 18.4, 18.4, 18.4, 18.5, 18.5, 18.5, 18.5, 18.6,
    ],
    []
  );
  const meses = patientAge;
  const imc = isValidNumber(weight) && isValidNumber(height) && Number(weight) && Number(height) ? calculateBMI(Number(weight), Number(height)) : 0;

  const data = useMemo(() => {
    return {
      labels: months,
      datasets: [
        {
          label: '97h',
          data: P97Data,
          borderColor: 'red',
        },
        {
          label: '85th',
          data: P85Data,
          borderColor: 'orange',
        },
        {
          label: '50th',
          data: P50Data,
          borderColor: 'green',
        },
        {
          label: '15th',
          data: P15Data,
          borderColor: 'orange',
        },
        {
          label: '3rd',
          data: P3Data,
          borderColor: 'red',
        },
        {
          label: 'IMC atual',
          data: months.map((month) => (Number(month) === meses ? imc : null)),
          borderColor: 'purple', // Cor do marcador
          backgroundColor: 'purple', // Cor de fundo do marcador
          pointRadius: 8, // Tamanho do marcador
          pointHoverRadius: 12, // Tamanho ao passar o mouse
          showLine: false, // Não mostrar linha
          fill: false, // Sem preenchimento
        },
      ],
    };
  }, [P15Data, P3Data, P50Data, P85Data, P97Data, imc, meses, months]);
  const config: ChartConfiguration<keyof ChartTypeRegistry, (number | null)[], string | number | boolean> = useMemo(() => {
    return {
      type: 'line',
      options: {
        layout: {
          padding: 0,
        },
        showLine: true,
        plugins: {
          // crosshair: Crosshair,
          // datalabels: false,
          // tooltip: ChartTooltipForCrosshair,
          // legend: false,
          // streaming: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            grid: {
              display: true,
              lineWidth: 1,
              color: themeValues.separatorLight,
              drawBorder: false,
              drawTicks: true,
            },
            ticks: {
              padding: 8,
              stepSize: 1,
              fontColor: themeValues.alternate,
            },
            title: {
              display: true,
              text: 'IMC (kg/m2)',
              color: themeValues.primary,
            },
          },
          x: {
            type: 'category',
            grid: {
              display: false,
              drawTicks: true,
              drawBorder: false,
            },
            ticks: { padding: 8, stepSize: 1, fontColor: themeValues.alternate },
            title: {
              display: true,
              text: 'Idade em meses',
              color: themeValues.primary,
            },
          },
        },
      },
      data,
    };
  }, [themeValues, data]);

  useEffect(() => {
    let myChart: Chart | null = null;
    if (chartContainer && chartContainer.current) {
      Chart.register(...registerables);

      myChart = new Chart(chartContainer.current, config);
    }
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };
  }, [config]);

  return <canvas ref={chartContainer} />;
};

export default React.memo(ChartBMI2a5Fem);
