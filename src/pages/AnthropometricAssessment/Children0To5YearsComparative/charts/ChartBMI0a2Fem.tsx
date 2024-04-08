import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '/src/types/Interface';
import { useParametersStore } from '../Parameters/hooks';
import { calculateBMI } from '../Parameters/Results/helpers/GeneralEquations';
import { isValidNumber } from '/src/helpers/MathHelpers';

const ChartBMI0a2Fem = () => {
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
      11.2, 12.1, 13.2, 13.7, 14.0, 14.2, 14.3, 14.3, 14.3, 14.2, 14.1, 14.0, 13.9, 13.8, 13.7, 13.7, 13.6, 13.5, 13.4, 13.4, 13.3, 13.3, 13.3, 13.2, 13.2,
    ],
    []
  );
  const P15Data = useMemo(
    () => [
      12.1, 13.2, 14.3, 14.9, 15.2, 15.3, 15.4, 15.4, 15.4, 15.3, 15.2, 15.1, 15.0, 14.8, 14.7, 14.6, 14.6, 14.5, 14.4, 14.3, 14.3, 14.2, 14.2, 14.2, 14.1,
    ],
    []
  );
  const P50Data = useMemo(
    () => [
      13.3, 14.6, 15.8, 16.4, 16.7, 16.8, 16.9, 16.9, 16.8, 16.7, 16.6, 16.5, 16.4, 16.2, 16.1, 16.0, 15.9, 15.8, 15.7, 15.7, 15.6, 15.5, 15.5, 15.4, 15.4,
    ],
    []
  );
  const P85Data = useMemo(
    () => [
      14.7, 16.1, 17.4, 18.0, 18.3, 18.5, 18.6, 18.6, 18.5, 18.4, 18.2, 18.1, 17.9, 17.8, 17.7, 17.5, 17.4, 17.3, 17.2, 17.2, 17.1, 17.0, 17.0, 16.9, 16.9,
    ],
    []
  );
  const P97Data = useMemo(
    () => [
      15.9, 17.3, 18.8, 19.4, 19.8, 20.0, 20.1, 20.1, 20.0, 19.9, 19.7, 19.6, 19.4, 19.2, 19.1, 19.0, 18.8, 18.7, 18.6, 18.5, 18.5, 18.4, 18.3, 18.3, 18.2,
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

export default React.memo(ChartBMI0a2Fem);
