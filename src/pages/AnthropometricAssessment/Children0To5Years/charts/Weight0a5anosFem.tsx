import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { useParametersStore } from '../Parameters/hooks';
import { ChartTypeRegistry } from 'chart.js';
import { InterfaceState, ThemeValues } from '../../../../types/Interface';

const Weight0a5anosFem = () => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const patientAge = useParametersStore((state) => state.patientAge);
  const weight = useParametersStore((state) => state.weight);

  const chartContainer = useRef(null);

  const months = useMemo(() => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'], []);
  const P3Data = useMemo(() => [2.4, 3.2, 4, 4.6, 5.1, 5.5, 5.8, 6.1, 6.3, 6.6, 6.8, 7, 7.1, 7.3, 7.5, 7.7, 7.8, 8, 8.2, 8.3, 8.5, 8.7, 8.8, 9, 9.2, 9.3, 9.5, 9.6, 9.8, 10, 10.1, 10.3, 10.4, 10.5, 10.7, 10.8, 11, 11.1, 11.2, 11.4, 11.5, 11.6, 11.8, 11.9, 12, 12.1, 12.3, 12.4, 12.5, 12.6, 12.8, 12.9, 13, 13.1, 13.2, 13.4, 13.5, 13.6, 13.7, 13.8, 14], []);
  const P15Data = useMemo(() => [2.8, 3.6, 4.5, 5.1, 5.6, 6.1, 6.4, 6.7, 7, 7.3, 7.5, 7.7, 7.9, 8.1, 8.3, 8.5, 8.7, 8.8, 9, 9.2, 9.4, 9.6, 9.8, 9.9, 10.1, 10.3, 10.5, 10.7, 10.8, 11, 11.2, 11.3, 11.5, 11.7, 11.8, 12, 12.1, 12.3, 12.5, 12.6, 12.8, 12.9, 13.1, 13.2, 13.4, 13.5, 13.7, 13.8, 14, 14.1, 14.3, 14.4, 14.5, 14.7, 14.8, 15, 15.1, 15.3, 15.4, 15.5, 15.7], []);
  const P50Data = useMemo(() => [3.2, 4.2, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.9, 8.2, 8.5, 8.7, 8.9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.9, 11.1, 11.3, 11.5, 11.7, 11.9, 12.1, 12.3, 12.5, 12.7, 12.9, 13.1, 13.3, 13.5, 13.7, 13.9, 14, 14.2, 14.4, 14.6, 14.8, 15, 15.2, 15.3, 15.5, 15.7, 15.9, 16.1, 16.3, 16.4, 16.6, 16.8, 17, 17.2, 17.3, 17.5, 17.7, 17.9, 18, 18.2], []);
  const P85Data = useMemo(() => [3.7, 4.8, 5.9, 6.7, 7.3, 7.8, 8.3, 8.7, 9, 9.3, 9.6, 9.9, 10.2, 10.4, 10.7, 10.9, 11.2, 11.4, 11.6, 11.9, 12.1, 12.4, 12.6, 12.8, 13.1, 13.3, 13.6, 13.8, 14, 14.3, 14.5, 14.7, 15, 15.2, 15.4, 15.7, 15.9, 16.1, 16.3, 16.6, 16.8, 17, 17.3, 17.5, 17.7, 17.9, 18.2, 18.4, 18.6, 18.9, 19.1, 19.3, 19.5, 19.8, 20, 20.2, 20.4, 20.7, 20.9, 21.1, 21.3, 21.6], []);
  const P97Data = useMemo(() => [4.2, 5.4, 6.5, 7.4, 8.1, 8.7, 9.2, 9.6, 10, 10.4, 10.7, 11, 11.3, 11.6, 11.9, 12.2, 12.5, 12.7, 13, 13.3, 13.5, 13.8, 14.1, 14.3, 14.6, 14.9, 15.2, 15.4, 15.7, 16, 16.2, 16.5, 16.8, 17, 17.3, 17.6, 17.8, 18.1, 18.4, 18.6, 18.9, 19.2, 19.5, 19.7, 20, 20.3, 20.6, 20.8, 21.1, 21.4, 21.7, 22, 22.2, 22.5, 22.8, 23.1, 23.3, 23.6, 23.9, 24.2, 24.4], []);

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
          label: 'Peso atual',
          data: months.map((month) => Number(month) === meses ? Number(weight) : null),
          borderColor: 'purple', // Cor do marcador
          backgroundColor: 'purple', // Cor de fundo do marcador
          pointRadius: 8, // Tamanho do marcador
          pointHoverRadius: 12, // Tamanho ao passar o mouse
          showLine: false, // Não mostrar linha
          fill: false, // Sem preenchimento
        },
      ],
    };
  }, [P15Data, P3Data, P50Data, P85Data, P97Data, meses, months, weight]);

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
              text: 'Peso (kg)',
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
              fontColor: themeValues.alternate
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

export default React.memo(Weight0a5anosFem);
