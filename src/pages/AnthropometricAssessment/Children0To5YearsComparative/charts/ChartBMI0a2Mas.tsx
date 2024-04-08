import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '/src/types/Interface';
import { useParametersStore } from '../Parameters/hooks';
import { isValidNumber } from '/src/helpers/MathHelpers';
import { calculateBMI } from '../Parameters/Results/helpers/GeneralEquations';

const ChartBMI0a2Mas = () => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const patientAge = useParametersStore((state) => state.patientAge);
  const height = useParametersStore((state) => state.height);
  const weight = useParametersStore((state) => state.weight);

  const chartContainer = useRef(null);

  const months = useMemo(
    () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
    []
  );
  const P3Data = useMemo(
    () => [
      11.3, 12.6, 13.8, 14.4, 14.7, 14.8, 14.9, 14.9, 14.9, 14.8, 14.7, 14.6, 14.5, 14.4, 14.3, 14.2, 14.2, 14.1, 14.0, 13.9, 13.9, 13.8, 13.8, 13.7, 13.7,
    ],
    []
  );
  const P15Data = useMemo(
    () => [
      12.2, 13.6, 14.9, 15.5, 15.7, 15.9, 15.9, 15.9, 15.9, 15.8, 15.7, 15.6, 15.5, 15.4, 15.3, 15.2, 15.1, 15.0, 14.9, 14.8, 14.8, 14.7, 14.6, 14.6, 14.5,
    ],
    []
  );
  const P50Data = useMemo(
    () => [
      13.4, 14.9, 16.3, 16.9, 17.2, 17.3, 17.3, 17.3, 17.3, 17.2, 17.0, 16.9, 16.8, 16.7, 16.6, 16.4, 16.3, 16.2, 16.1, 16.1, 16.0, 15.9, 15.8, 15.8, 15.7,
    ],
    []
  );
  const P85Data = useMemo(
    () => [
      14.8, 16.4, 17.8, 18.5, 18.7, 18.9, 18.9, 18.9, 18.8, 18.7, 18.6, 18.4, 18.3, 18.1, 18.0, 17.9, 17.8, 17.6, 17.5, 17.4, 17.4, 17.3, 17.2, 17.1, 17.1,
    ],
    []
  );
  const P97Data = useMemo(
    () => [
      16.1, 17.6, 19.2, 19.8, 20.1, 20.2, 20.3, 20.3, 20.2, 20.1, 19.9, 19.8, 19.6, 19.5, 19.3, 19.2, 19.1, 18.9, 18.8, 18.7, 18.6, 18.6, 18.5, 18.4, 18.3,
    ],
    []
  );
  const meses = patientAge;
  const imc = useMemo(
    () => {
      const bmi = isValidNumber(weight) && isValidNumber(height) && Number(weight) && Number(height) ? calculateBMI(Number(weight), Number(height)) : 0;

      return bmi < 999 ? bmi : 999;
    },
    [height, weight]
  );

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

export default React.memo(ChartBMI0a2Mas);
