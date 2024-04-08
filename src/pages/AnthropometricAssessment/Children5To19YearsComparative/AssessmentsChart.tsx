import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, ChartData, TooltipModel, registerables } from 'chart.js';
import { useSelector } from 'react-redux';
import { ChartTypeRegistry } from 'chart.js';
import { ChartConfiguration } from 'chart.js';
import { ChartDataset } from 'chart.js';
import { AntropometricAssessmentHistory, Child5to19AntropometricData } from '../../../types/AntropometricAssessment';
import { InterfaceState, ThemeValues } from '../../../types/Interface';
import { parseFloatNumber } from '../../../helpers/MathHelpers';

interface AssessmentsChartProps {
  assessments: Array<AntropometricAssessmentHistory<Child5to19AntropometricData> | null>;
}

const AssessmentsChart = (props: AssessmentsChartProps) => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);
  const chartContainer = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [tollTipLabel, setToolTipLabel] = useState('');
  const [tollTipValue, setToolTipValue] = useState(0);

  const ExternalTooltip = React.useCallback(({ chart, tooltip }: { chart: Chart; tooltip: TooltipModel<keyof ChartTypeRegistry> }) => {
    let text = '';
    let value = '';
    // let icon = '';
    const positionY = chart.canvas.offsetTop;
    const positionX = chart.canvas.offsetLeft;
    const { opacity } = tooltip;

    const left = `${positionX + tooltip.dataPoints[0].element.x - 75}px`;
    const top = `${positionY + tooltip.caretY}px`;

    if (tooltip.body && chart.data.labels) {
      const { dataIndex, datasetIndex } = tooltip.dataPoints[0];
      text = (chart.data.labels[dataIndex] as string).toLocaleUpperCase() + ' | ' + (chart.data.datasets[datasetIndex]?.label as string).toLocaleUpperCase();
      value = chart.data.datasets[datasetIndex]?.data[dataIndex]?.toString() || '';
    }

    tooltipRef.current?.classList.remove('above', 'below', 'no-transform');
    if (tooltip.yAlign) {
      tooltipRef.current?.classList.add(tooltip.yAlign);
    } else {
      tooltipRef.current?.classList.add('no-transform');
    }

    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = String(opacity);
      tooltipRef.current.style.left = left;
      tooltipRef.current.style.top = top;

      setToolTipLabel(text);
      setToolTipValue(parseFloatNumber(value));
    }
  }, []);

  const LegendLabels = useMemo(() => {
    return {
      font: {
        size: 14,
        family: themeValues.font,
      },
      padding: 20,
      usePointStyle: true,
      boxWidth: 10,
    };
  }, [themeValues]);

  const datasets: ChartDataset<keyof ChartTypeRegistry, number[]>[] = useMemo(() => {

    const medida_ossea = props.assessments.reduce((acc, assessment) => {
      return assessment && assessment.data && Number(assessment.data.diametroBicondioFemural) && Number(assessment.data.diametroEstiloUlnar) ? true : acc;
    }, false);

    if(medida_ossea) return [
      {
        type: 'line',
        label: 'Peso (kg)',
        icon: 'loaf',
        backgroundColor: `rgba(${themeValues.primaryrgb},0.1)`,
        borderColor: themeValues.primary,
        barPercentage: 0.5,
        borderSkipped: 'bottom',
        borderWidth: 1.5,
        borderRadius: parseInt(themeValues.borderRadiusMd, 10),
        data: props.assessments.map((assessment) => (assessment && assessment.data ? parseFloatNumber(assessment.data.peso ?? 0) : 0)),
      },
      {
        label: 'Peso ósseo (kg)',
        icon: 'loaf',
        backgroundColor: `rgba(${themeValues.bodyrgb},0.1)`,
        borderColor: themeValues.body,
        barPercentage: 0.5,
        borderSkipped: 'bottom',
        borderWidth: 1.5,
        borderRadius: parseInt(themeValues.borderRadiusMd, 10),
        data: props.assessments.map((assessment) =>
          assessment && assessment.data && Number(assessment.data.diametroBicondioFemural) && Number(assessment.data.diametroEstiloUlnar)
            ? parseFloatNumber(assessment.data.pesoOsseo ?? 0)
            : 0
        ),
      },
      {
        label: 'Peso residual (kg)',
        icon: 'cupcake',
        backgroundColor: `rgba(${themeValues.inforgb},0.1)`,
        borderColor: themeValues.info,
        barPercentage: 0.5,
        borderSkipped: 'bottom',
        borderWidth: 1.5,
        borderRadius: parseInt(themeValues.borderRadiusMd, 10),
        data: props.assessments.map((assessment) =>
          assessment && assessment.data && Number(assessment.data.diametroBicondioFemural) && Number(assessment.data.diametroEstiloUlnar)
            ? parseFloatNumber(assessment.data.pesoResidual ?? 0)
            : 0
        ),
      },
      {
        label: 'Gordura corporal (kg)',
        icon: 'cupcake',
        backgroundColor: `rgba(${themeValues.warningrgb},0.1)`,
        borderColor: themeValues.warning,
        barPercentage: 0.5,
        borderSkipped: 'bottom',
        borderWidth: 1.5,
        borderRadius: parseInt(themeValues.borderRadiusMd, 10),
        data: props.assessments.map((assessment) => (assessment && assessment.data ? parseFloatNumber(assessment.data.pesoGordo ?? 0) : 0)),
      },
      {
        label: 'Peso muscular (kg)',
        icon: 'cupcake',
        backgroundColor: `rgba(${themeValues.dangerrgb},0.1)`,
        borderColor: themeValues.danger,
        barPercentage: 0.5,
        borderSkipped: 'bottom',
        borderWidth: 1.5,
        borderRadius: parseInt(themeValues.borderRadiusMd, 10),
        data: props.assessments.map((assessment) =>
          assessment && assessment.data && Number(assessment.data.diametroBicondioFemural) && Number(assessment.data.diametroEstiloUlnar)
            ? parseFloatNumber(assessment.data.pesoMagro ?? 0)
            : 0
        ),
      },
    ]

    return [
      {
        type: 'line',
        label: 'Peso (kg)',
        icon: 'loaf',
        backgroundColor: `rgba(${themeValues.primaryrgb},0.1)`,
        borderColor: themeValues.primary,
        barPercentage: 0.5,
        borderSkipped: 'bottom',
        borderWidth: 1.5,
        borderRadius: parseInt(themeValues.borderRadiusMd, 10),
        data: props.assessments.map((assessment) => (assessment && assessment.data ? parseFloatNumber(assessment.data.peso ?? 0) : 0)),
      },
      {
        label: 'Gordura corporal (kg)',
        icon: 'cupcake',
        backgroundColor: `rgba(${themeValues.warningrgb},0.1)`,
        borderColor: themeValues.warning,
        barPercentage: 0.5,
        borderSkipped: 'bottom',
        borderWidth: 1.5,
        borderRadius: parseInt(themeValues.borderRadiusMd, 10),
        data: props.assessments.map((assessment) => (assessment && assessment.data ? parseFloatNumber(assessment.data.pesoGordo ?? 0) : 0)),
      },
      {
        label: 'Massa livre de Gordura (kg)',
        icon: 'cupcake',
        backgroundColor: `rgba(${themeValues.successrgb},0.1)`,
        borderColor: themeValues.success,
        barPercentage: 0.5,
        borderSkipped: 'bottom',
        borderWidth: 1.5,
        borderRadius: parseInt(themeValues.borderRadiusMd, 10),
        data: props.assessments.map((assessment) =>
          assessment && assessment.data && !(Number(assessment.data.diametroBicondioFemural) && Number(assessment.data.diametroEstiloUlnar))
            ? parseFloatNumber(assessment.data.massaLivreDeGorduraKg ?? 0)
            : 0
        ),
      },
    ]
  }, [props.assessments, themeValues.body, themeValues.bodyrgb, themeValues.borderRadiusMd, themeValues.danger, themeValues.dangerrgb, themeValues.info, themeValues.inforgb, themeValues.primary, themeValues.primaryrgb, themeValues.success, themeValues.successrgb, themeValues.warning, themeValues.warningrgb]);

  const data: ChartData<keyof ChartTypeRegistry, number[], string> = useMemo(() => {
    return {
      labels: props.assessments.map((assessment) => (assessment ? new Date(assessment.data_registro * 1000).toLocaleDateString() : '')),
      datasets,
    };
  }, [datasets, props.assessments]);

  const config: ChartConfiguration<keyof ChartTypeRegistry, number[], string> = useMemo(() => {
    return {
      type: 'bar',
      plugins: [],
      options: {
        plugins: {
          crosshair: false,
          tooltip: {
            enabled: false,
            external: ExternalTooltip,
          },
          legend: {
            position: 'bottom',
            labels: LegendLabels,
          },
        },
        interaction: {
          intersect: true,
          mode: 'point',
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            stacked: true,
            min: 0,
            max: props.assessments.reduce((acc, assessment) => (assessment && assessment.data ? Math.max(acc, parseFloatNumber(assessment.data.peso ?? 0)) : acc), 0) + 4,
            grid: {
              display: true,
              lineWidth: 1,
              color: themeValues.separatorLight,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              padding: 8,
              fontColor: themeValues.alternate,
            },
          },
          x: {
            stacked: true,
            grid: { display: false, drawBorder: false },
          },
        },
      },
      data,
    };
  }, [ExternalTooltip, LegendLabels, themeValues.separatorLight, themeValues.alternate, data]);

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

  return (
    <>
      <canvas ref={chartContainer} />
      <div
        ref={tooltipRef}
        className="custom-tooltip position-absolute bg-foreground rounded-md border border-separator pe-none p-3 d-flex z-index-1 align-items-center opacity-0 basic-transform-transition"
      >
        <div>
          <span className="text d-flex align-middle text-alternate align-items-center text-small">{tollTipLabel}</span>
          <span className="value d-flex align-middle text-body align-items-center cta-4">{tollTipValue}kg</span>
        </div>
      </div>
    </>
  );
};

export default React.memo(AssessmentsChart);
