import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '/src/types/Interface';
import { ChartConfiguration } from 'chart.js';
import { AntropometricAssessmentHistory, Child0to5AntropometricData } from '/src/types/AntropometricAssessment';
import { getAssessmentHeight } from './helpers';

interface Height0a2anosMasProps {
  selectedAssessments: (AntropometricAssessmentHistory<Child0to5AntropometricData> | null)[];
}

const Height0a2anosMas = ({ selectedAssessments }: Height0a2anosMasProps) => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);

  const chartContainer = useRef(null);

  const months = useMemo(
    () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60',],
    []
  );
  const P3Data = useMemo(
    () => [46.3, 51.1, 54.7, 57.6, 60, 61.9, 63.6, 65.1, 66.5, 67.7, 69, 70.2, 71.3, 72.4, 73.4, 74.4, 75.4, 76.3, 77.2, 78.1, 78.9, 79.7, 80.5, 81.4, 82.1, 82.8,83.5, 84.2, 84.9, 85.5, 86.2, 86.8, 87.4, 88, 88.5, 89.1, 89.7, 90.2, 90.8, 91.3, 91.9, 92.4, 92.9, 93.4, 93.9, 94.4, 94.9, 95.4, 95.9, 96.4, 96.9, 97.4,97.9, 98.4, 98.8, 99.3, 99.8, 100.3, 100.8, 101.2,],
    []
  );
  const P15Data = useMemo(
    () => [47.9, 52.7, 56.4, 59.3, 61.7, 63.7, 65.4, 66.9, 68.3, 69.6, 70.9, 72.1, 73.3, 74.4, 75.5, 76.5, 77.5, 78.5, 79.5, 80.4, 81.3, 82.2, 83, 83.9, 84.7, 85.5,86.3, 87, 87.7, 88.4, 89.1, 89.7, 90.4, 91, 91.6, 92.2, 92.8, 93.4, 94, 94.6, 95.2, 95.7, 96.3, 96.8, 97.4, 97.9, 98.5, 99, 99.5, 100, 100.5, 101.1,101.6, 102.1, 102.6, 103.1, 103.6, 104.1, 104.7, 105.2,],
    []
  );
  const P50Data = useMemo(
    () => [49.9, 54.7, 58.4, 61.4, 63.9, 65.9, 67.6, 69.2, 70.6, 72, 73.3, 74.5, 75.7, 76.9, 78, 79.1, 80.2, 81.2, 82.3, 83.2, 84.2, 85.1, 86, 87.1, 88, 88.8, 89.6,90.4, 91.2, 91.9, 92.7, 93.4, 94.1, 94.8, 95.4, 96.1, 96.7, 97.4, 98, 98.6, 99.2, 99.9, 100.4, 101, 101.6, 102.2, 102.8, 103.3, 103.9, 104.4, 105, 105.6,106.1, 106.7, 107.2, 107.8, 108.3, 108.9, 109.4, 110,],
    []
  );
  const P85Data = useMemo(
    () => [51.8, 56.7, 60.5, 63.5, 66, 68.1, 69.8, 71.4, 72.9, 74.3, 75.6, 77, 78.2, 79.4, 80.6, 81.8, 82.9, 84, 85.1, 86.1, 87.1, 88.1, 89.1, 90.3, 91.2, 92.1, 93,93.8, 94.7, 95.5, 96.2, 97, 97.8, 98.5, 99.2, 99.9, 100.6, 101.3, 102, 102.7, 103.3, 104, 104.6, 105.2, 105.8, 106.5, 107.1, 107.7, 108.3, 108.9, 109.5,110.1, 110.7, 111.2, 111.8, 112.4, 113, 113.6, 114.2, 114.8,],
    []
  );
  const P97Data = useMemo(
    () => [53.4, 58.4, 62.2, 65.3, 67.8, 69.9, 71.6, 73.2, 74.7, 76.2, 77.6, 78.9, 80.2, 81.5, 82.7, 83.9, 85.1, 86.2, 87.3, 88.4, 89.5, 90.5, 91.6, 92.9, 93.8,94.8, 95.7, 96.6, 97.5, 98.3, 99.2, 100, 100.8, 101.5, 102.3, 103.1, 103.8, 104.5, 105.2, 105.9, 106.6, 107.3, 108, 108.6, 109.3, 109.9, 110.6, 111.2,111.8, 112.5, 113.1, 113.7, 114.3, 115, 115.6, 116.2, 116.8, 117.4, 118.1, 118.7,],
    []
  );

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
          data: months.map((month) => getAssessmentHeight(selectedAssessments, month)),
          borderColor: 'purple', // Cor do marcador
          backgroundColor: 'purple', // Cor de fundo do marcador
          pointRadius: 8, // Tamanho do marcador
          pointHoverRadius: 12, // Tamanho ao passar o mouse
          showLine: false, // Não mostrar linha
          fill: false, // Sem preenchimento
        },
      ],
    };
  }, [P15Data, P3Data, P50Data, P85Data, P97Data, months, selectedAssessments]);

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
