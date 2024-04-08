import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '/src/types/Interface';
import { useParametersStore } from '../Parameters/hooks';

const Height2a5anosFem = () => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const patientAge = useParametersStore((state) => state.patientAge);
  const height = useParametersStore((state) => state.height);

  const chartContainer = useRef(null);

  const months = useMemo(() => ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'], []);
  const P3Data = useMemo(() => [79.6, 80.4, 81.2, 81.9, 82.6, 83.4, 84.0, 84.7, 85.4, 86.0, 86.7, 87.3, 87.9, 88.5, 89.1, 89.7, 90.3, 90.8, 91.4, 92.0, 92.5, 93.0, 93.6, 94.1, 94.6, 95.1, 95.7, 96.2, 96.7, 97.2, 97.6, 98.1, 98.6, 99.1, 99.6, 100.0, 100.5], []);
  const P15Data = useMemo(() => [82.4, 83.2, 84.0, 84.8, 85.5, 86.3, 87.0, 87.7, 88.4, 89.1, 89.8, 90.5, 91.1, 91.7, 92.4, 93.0, 93.6, 94.2, 94.8, 95.4, 96.0, 96.6, 97.2, 97.7, 98.3, 98.8, 99.4, 99.9, 100.4, 101.0, 101.5, 102.0, 102.5, 103.0, 103.5, 104.0, 104.5], []);
  const P50Data = useMemo(() => [85.7, 86.6, 87.4, 88.3, 89.1, 89.9, 90.7, 91.4, 92.2, 92.9, 93.6, 94.4, 95.1, 95.7, 96.4, 97.1, 97.7, 98.4, 99.0, 99.7, 100.3, 100.9, 101.5, 102.1, 102.7, 103.3, 103.9, 104.5, 105.0, 105.6, 106.2, 106.7, 107.3, 107.8, 108.4, 108.9, 109.4], []);
  const P85Data = useMemo(() => [89.1, 90.0, 90.9, 91.8, 92.7, 93.5, 94.3, 95.2, 95.9, 96.7, 97.5, 98.3, 99.0, 99.7, 100.5, 101.2, 101.9, 102.6, 103.3, 103.9, 104.6, 105.3, 105.9, 106.6, 107.2, 107.8, 108.4, 109.1, 109.7, 110.3, 110.9, 111.5, 112.1, 112.6, 113.2, 113.8, 114.4], []);
  const P97Data = useMemo(() => [91.8, 92.8, 93.7, 94.6, 95.6, 96.4, 97.3, 98.2, 99.0, 99.8, 100.6, 101.4, 102.2, 103.0, 103.7, 104.5, 105.2, 106.0, 106.7, 107.4, 108.1, 108.8, 109.5, 110.2, 110.8, 111.5, 112.1, 112.8, 113.4, 114.1, 114.7, 115.3, 116.0, 116.6, 117.2, 117.8, 118.4], []);

  const meses = patientAge;

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
          label: 'Comprimento atual',
          data: months.map((month) => Number(month) === meses ? Number(height) : null),
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
        plugins: {},
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
            ticks: {
              padding: 8,
              stepSize: 1,
              fontColor: themeValues.alternate,
            },
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

export default React.memo(Height2a5anosFem);
