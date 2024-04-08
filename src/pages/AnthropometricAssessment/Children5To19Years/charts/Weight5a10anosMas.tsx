import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '../../../../types/Interface';
import { useParametersStore } from '../Parameters/hooks/ParametersStore';

const Weight5a19anosMas = () => {
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
    14.58, 14.711, 14.844, 14.978, 15.114, 15.251, 15.389, 15.53, 15.672, 15.815, 15.959, 16.105, 16.252, 16.4, 16.548, 16.697, 16.848, 16.999, 17.15, 17.303,
    17.455, 17.609, 17.762, 17.916, 18.07, 18.224, 18.378, 18.532, 18.686, 18.841, 18.995, 19.148, 19.302, 19.456, 19.609, 19.763, 19.916, 20.069, 20.222,
    20.375, 20.528, 20.681, 20.833, 20.986, 21.14, 21.293, 21.448, 21.603, 21.759, 21.917, 22.076, 22.236, 22.398, 22.561, 22.727, 22.894, 23.063, 23.234,
    23.406, 23.581,
  ];
  const P15Data = [
    16.204, 16.352, 16.501, 16.652, 16.804, 16.957, 17.113, 17.27, 17.428, 17.588, 17.749, 17.912, 18.076, 18.24, 18.406, 18.572, 18.739, 18.908, 19.077,
    19.247, 19.418, 19.59, 19.762, 19.935, 20.108, 20.281, 20.455, 20.629, 20.803, 20.978, 21.153, 21.328, 21.504, 21.679, 21.855, 22.031, 22.208, 22.385,
    22.562, 22.74, 22.918, 23.096, 23.275, 23.454, 23.635, 23.816, 23.998, 24.182, 24.368, 24.555, 24.744, 24.936, 25.129, 25.325, 25.523, 25.724, 25.927,
    26.133, 26.341, 26.551,
  ];
  const P50Data = [
    18.506, 18.68, 18.856, 19.034, 19.213, 19.394, 19.576, 19.761, 19.947, 20.134, 20.324, 20.514, 20.705, 20.898, 21.092, 21.287, 21.483, 21.681, 21.88, 22.08,
    22.281, 22.484, 22.687, 22.892, 23.097, 23.303, 23.51, 23.718, 23.927, 24.137, 24.348, 24.56, 24.772, 24.986, 25.2, 25.416, 25.633, 25.851, 26.071, 26.291,
    26.513, 26.736, 26.96, 27.186, 27.414, 27.643, 27.875, 28.109, 28.346, 28.585, 28.828, 29.073, 29.322, 29.574, 29.829, 30.088, 30.35, 30.616, 30.885,
    31.159,
  ];
  const P85Data = [
    21.212, 21.423, 21.636, 21.851, 22.068, 22.286, 22.507, 22.729, 22.954, 23.18, 23.408, 23.637, 23.868, 24.101, 24.335, 24.571, 24.809, 25.048, 25.29,
    25.533, 25.778, 26.025, 26.273, 26.524, 26.776, 27.03, 27.286, 27.543, 27.803, 28.065, 28.328, 28.594, 28.862, 29.132, 29.405, 29.68, 29.957, 30.238, 30.52,
    30.806, 31.093, 31.384, 31.678, 31.974, 32.274, 32.578, 32.885, 33.196, 33.512, 33.832, 34.155, 34.484, 34.817, 35.155, 35.497, 35.844, 36.197, 36.554,
    36.916, 37.283,
  ];
  const P97Data = [
    23.774, 24.026, 24.279, 24.535, 24.793, 25.053, 25.315, 25.58, 25.847, 26.117, 26.388, 26.661, 26.937, 27.215, 27.494, 27.777, 28.061, 28.349, 28.639,
    28.931, 29.227, 29.525, 29.826, 30.13, 30.436, 30.746, 31.059, 31.375, 31.695, 32.017, 32.343, 32.674, 33.007, 33.345, 33.687, 34.033, 34.384, 34.74,
    35.099, 35.464, 35.832, 36.206, 36.585, 36.969, 37.358, 37.753, 38.155, 38.562, 38.975, 39.395, 39.82, 40.252, 40.69, 41.135, 41.587, 42.044, 42.508,
    42.978, 43.455, 43.938,
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

export default React.memo(Weight5a19anosMas);
