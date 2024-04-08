import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '/src/types/Interface';
import { ChartConfiguration } from 'chart.js';
import { useParametersStore } from '../Parameters/hooks';

const Height0a2anosMas = () => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const patientAge = useParametersStore((state) => state.patientAge);
  const height = useParametersStore((state) => state.height);

  const chartContainer = useRef(null);

  const months = useMemo(
    () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
    []
  );
  const P3Data = useMemo(
    () => [46.3, 51.1, 54.7, 57.6, 60, 61.9, 63.6, 65.1, 66.5, 67.7, 69, 70.2, 71.3, 72.4, 73.4, 74.4, 75.4, 76.3, 77.2, 78.1, 78.9, 79.7, 80.5, 81.3, 82.1],
    []
  );
  const P15Data = useMemo(
    () => [47.9, 52.7, 56.4, 59.3, 61.7, 63.7, 65.4, 66.9, 68.3, 69.6, 70.9, 72.1, 73.3, 74.4, 75.5, 76.5, 77.5, 78.5, 79.5, 80.4, 81.3, 82.2, 83, 83.8, 84.6],
    []
  );
  const P50Data = useMemo(
    () => [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72, 73.3, 74.5, 75.7, 76.9, 78, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86, 86.9, 87.8],
    []
  );
  const P85Data = useMemo(
    () => [51.8, 56.7, 60.5, 63.5, 66, 68.1, 69.8, 71.4, 72.9, 74.3, 75.6, 77, 78.2, 79.4, 80.6, 81.8, 82.9, 84, 85.1, 86.1, 87.1, 88.1, 89.1, 90, 91],
    []
  );
  const P97Data = useMemo(
    () => [
      53.4, 58.4, 62.2, 65.3, 67.8, 69.9, 71.6, 73.2, 74.7, 76.2, 77.6, 78.9, 80.2, 81.5, 82.7, 83.9, 85.1, 86.2, 87.3, 88.4, 89.5, 90.5, 91.6, 92.6, 93.6,
    ],
    []
  );

  const meses = patientAge;

  const data = React.useMemo(() => {
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
          label: 'Comprimento atual',
          data: months.map((month) => (Number(month) === meses ? Number(height) : null)),
          borderColor: 'purple', // Cor do marcador
          backgroundColor: 'purple', // Cor de fundo do marcador
          pointRadius: 8, // Tamanho do marcador
          pointHoverRadius: 12, // Tamanho ao passar o mouse
          showLine: false, // Não mostrar linha
          fill: false, // Sem preenchimento
        },
      ],
    };
  }, [P15Data, P3Data, P50Data, P85Data, P97Data, height, meses, months]);

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
          // // legend: false,
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
              text: 'Comprimento (cm)',
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

export default React.memo(Height0a2anosMas);
