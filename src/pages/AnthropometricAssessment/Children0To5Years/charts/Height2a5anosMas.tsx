import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '/src/types/Interface';
import { useParametersStore } from '../Parameters/hooks';

const Height2a5anosMas = () => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const chartContainer = useRef(null);

  const patientAge = useParametersStore((state) => state.patientAge);
  const height = useParametersStore((state) => state.height);

  const months  = useMemo(() => ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'], []);
  const P3Data  = useMemo(() => [81.4, 82.1, 82.8, 83.5, 84.2, 84.9, 85.5, 86.2, 86.8, 87.4, 88, 88.5, 89.1, 89.7, 90.2, 90.8, 91.3, 91.9, 92.4, 92.9, 93.4, 93.9, 94.4, 94.9, 95.4, 95.9, 96.4, 96.9, 97.4, 97.9, 98.4, 98.8, 99.3, 99.8, 100.3, 100.8, 101.2], []);
  const P15Data  = useMemo(() => [83.9, 84.7, 85.5, 86.3, 87, 87.7, 88.4, 89.1, 89.7, 90.4, 91, 91.6, 92.2, 92.8, 93.4, 94, 94.6, 95.2, 95.7, 96.3, 96.8, 97.4, 97.9, 98.5, 99, 99.5, 100, 100.5, 101.1, 101.6, 102.1, 102.6, 103.1, 103.6, 104.1, 104.7, 105.2], []);
  const P50Data  = useMemo(() => [87.1, 88, 88.8, 89.6, 90.4, 91.2, 91.9, 92.7, 93.4, 94.1, 94.8, 95.4, 96.1, 96.7, 97.4, 98, 98.6, 99.2, 99.9, 100.4, 101, 101.6, 102.2, 102.8, 103.3, 103.9, 104.4, 105, 105.6, 106.1, 106.7, 107.2, 107.8, 108.3, 108.9, 109.4, 110], []);
  const P85Data  = useMemo(() => [90.3, 91.2, 92.1, 93, 93.8, 94.7, 95.5, 96.2, 97, 97.8, 98.5, 99.2, 99.9, 100.6, 101.3, 102, 102.7, 103.3, 104, 104.6, 105.2, 105.8, 106.5, 107.1, 107.7, 108.3, 108.9, 109.5, 110.1, 110.7, 111.2, 111.8, 112.4, 113, 113.6, 114.2, 114.8], []);
  const P97Data  = useMemo(() => [92.9, 93.8, 94.8, 95.7, 96.6, 97.5, 98.3, 99.2, 100, 100.8, 101.5, 102.3, 103.1, 103.8, 104.5, 105.2, 105.9, 106.6, 107.3, 108, 108.6, 109.3, 109.9, 110.6, 111.2, 111.8, 112.5, 113.1, 113.7, 114.3, 115, 115.6, 116.2, 116.8, 117.4, 118.1, 118.7], []);

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

export default React.memo(Height2a5anosMas);
