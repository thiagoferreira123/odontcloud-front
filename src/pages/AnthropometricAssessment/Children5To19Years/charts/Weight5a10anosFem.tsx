import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '../../../../types/Interface';
import { useParametersStore } from '../Parameters/hooks/ParametersStore';

const Weight5a19anosFem = () => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const patientAge = useParametersStore((state) => state.patientAge);
  const weight = useParametersStore((state) => state.weight);

  const chartContainer = useRef(null);

  const months = [
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '70',
    '71',
    '72',
    '73',
    '74',
    '75',
    '76',
    '77',
    '78',
    '79',
    '80',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99',
    '100',
    '101',
    '102',
    '103',
    '104',
    '105',
    '106',
    '107',
    '108',
    '109',
    '110',
    '111',
    '112',
    '113',
    '114',
    '115',
    '116',
    '117',
    '118',
    '119',
    '120',
  ];
  const P3Data = [
    14.173, 14.297, 14.421, 14.544, 14.666, 14.788, 14.909, 15.03, 15.151, 15.272, 15.392, 15.513, 15.634, 15.756, 15.878, 16.001, 16.126, 16.252, 16.38,
    16.509, 16.641, 16.774, 16.91, 17.049, 17.189, 17.332, 17.477, 17.625, 17.775, 17.927, 18.082, 18.24, 18.4, 18.562, 18.728, 18.896, 19.066, 19.24, 19.416,
    19.595, 19.777, 19.961, 20.147, 20.337, 20.528, 20.722, 20.918, 21.116, 21.316, 21.518, 21.723, 21.929, 22.138, 22.349, 22.563, 22.78, 22.999, 23.222,
    23.447, 23.676,
  ];
  const P15Data = [
    15.821, 15.965, 16.108, 16.25, 16.392, 16.534, 16.675, 16.815, 16.956, 17.096, 17.236, 17.377, 17.518, 17.66, 17.803, 17.947, 18.092, 18.239, 18.388,
    18.539, 18.693, 18.848, 19.007, 19.168, 19.332, 19.499, 19.668, 19.84, 20.014, 20.192, 20.372, 20.556, 20.742, 20.931, 21.124, 21.319, 21.518, 21.72,
    21.925, 22.133, 22.345, 22.559, 22.776, 22.996, 23.219, 23.444, 23.672, 23.902, 24.135, 24.37, 24.607, 24.847, 25.09, 25.336, 25.584, 25.836, 26.091,
    26.349, 26.611, 26.877,
  ];
  const P50Data = [
    18.258, 18.433, 18.607, 18.781, 18.954, 19.128, 19.3, 19.473, 19.646, 19.818, 19.991, 20.164, 20.338, 20.512, 20.688, 20.866, 21.046, 21.227, 21.411,
    21.598, 21.787, 21.98, 22.175, 22.374, 22.576, 22.782, 22.99, 23.202, 23.418, 23.637, 23.859, 24.085, 24.315, 24.548, 24.785, 25.026, 25.271, 25.52, 25.772,
    26.028, 26.288, 26.552, 26.819, 27.09, 27.364, 27.641, 27.921, 28.204, 28.49, 28.779, 29.071, 29.366, 29.665, 29.966, 30.272, 30.58, 30.893, 31.21, 31.532,
    31.858,
  ];
  const P85Data = [
    21.288, 21.506, 21.723, 21.941, 22.158, 22.375, 22.591, 22.808, 23.026, 23.243, 23.461, 23.68, 23.9, 24.121, 24.344, 24.569, 24.797, 25.028, 25.261, 25.498,
    25.738, 25.982, 26.231, 26.483, 26.74, 27, 27.265, 27.535, 27.808, 28.086, 28.368, 28.655, 28.946, 29.242, 29.543, 29.849, 30.159, 30.474, 30.794, 31.119,
    31.448, 31.782, 32.121, 32.463, 32.81, 33.161, 33.516, 33.874, 34.237, 34.603, 34.972, 35.346, 35.723, 36.104, 36.49, 36.881, 37.275, 37.676, 38.081,
    38.493,
  ];
  const P97Data = [
    24.336, 24.601, 24.866, 25.132, 25.398, 25.664, 25.93, 26.197, 26.465, 26.733, 27.002, 27.273, 27.545, 27.819, 28.095, 28.375, 28.658, 28.945, 29.234,
    29.529, 29.828, 30.132, 30.441, 30.755, 31.075, 31.399, 31.73, 32.065, 32.406, 32.752, 33.103, 33.46, 33.823, 34.192, 34.567, 34.947, 35.334, 35.727,
    36.126, 36.53, 36.94, 37.355, 37.778, 38.204, 38.636, 39.073, 39.514, 39.96, 40.411, 40.867, 41.326, 41.791, 42.26, 42.734, 43.214, 43.699, 44.189, 44.687,
    45.19, 45.7,
  ];
  const meses = patientAge * 12;

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
          data: months.map((month) => (Number(month) === meses ? Number(weight) : null)),
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

export default React.memo(Weight5a19anosFem);
