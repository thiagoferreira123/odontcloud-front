import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { useParametersStore } from '../Parameters/hooks';
import { InterfaceState, ThemeValues } from '../../../../types/Interface';

const Height0a2anosFem = () => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const patientAge = useParametersStore((state) => state.patientAge);
  const height = useParametersStore((state) => state.height);

  const chartContainer = useRef(null);

  const months = useMemo(
    () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
    []
  );
  const P3Data = useMemo(
    () => [45.6, 50, 53.2, 55.8, 58, 59.9, 61.5, 62.9, 64.3, 65.6, 66.8, 68, 69.2, 70.3, 71.3, 72.4, 73.3, 74.3, 75.2, 76.2, 77, 77.9, 78.7, 79.6, 80.3],
    []
  );
  const P15Data = useMemo(
    () => [47.2, 51.7, 55, 57.6, 59.8, 61.7, 63.4, 64.9, 66.3, 67.6, 68.9, 70.2, 71.3, 72.5, 73.6, 74.7, 75.7, 76.7, 77.7, 78.7, 79.6, 80.5, 81.4, 82.2, 83.1],
    []
  );
  const P50Data = useMemo(
    () => [49.1, 53.7, 57.1, 59.8, 62.1, 64, 65.7, 67.3, 68.7, 70.1, 71.5, 72.8, 74, 75.2, 76.4, 77.5, 78.6, 79.7, 80.7, 81.7, 82.7, 83.7, 84.6, 85.5, 86.4],
    []
  );
  const P85Data = useMemo(
    () => [51.1, 55.7, 59.2, 62, 64.3, 66.3, 68.1, 69.7, 71.2, 72.6, 74, 75.4, 76.7, 77.9, 79.2, 80.3, 81.5, 82.6, 83.7, 84.8, 85.8, 86.8, 87.8, 88.8, 89.8],
    []
  );
  const P97Data = useMemo(
    () => [52.7, 57.4, 60.9, 63.8, 66.2, 68.2, 70, 71.6, 73.2, 74.7, 76.1, 77.5, 78.9, 80.2, 81.4, 82.7, 83.9, 85, 86.2, 87.3, 88.4, 89.4, 90.5, 91.5, 92.5],
    []
  );
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

export default React.memo(Height0a2anosFem);
