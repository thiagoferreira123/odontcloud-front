import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, TooltipModel, registerables } from 'chart.js';
import { useSelector } from 'react-redux';
import { EquivalentEatingPlanMeal } from '/src/types/PlanoAlimentarEquivalente';
import { carbohydrate, fat, protein } from '../meal/utils/MathHelpers';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { parseFloatNumber } from '/src/helpers/MathHelpers';

interface ThemeValues {
  font: string;
  primary: string;
  primaryrgb: string;
  secondary: string;
  secondaryrgb: string;
  tertiary: string;
  tertiaryrgb: string;
  quaternary: string;
  quaternaryrgb: string;
  borderRadiusMd: string;
  separatorLight: string;
  alternate: string;
}

interface CalorieDistributionGraphProps {
  meals: EquivalentEatingPlanMeal[];
}

const CalorieDistributionGraph = (props: CalorieDistributionGraphProps) => {
  const { themeValues } = useSelector<{ settings: { themeValues: ThemeValues } }, { themeValues: ThemeValues }>((state) => state.settings);
  const chartContainer = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [tollTipLabel, setToolTipLabel] = useState('');
  const [tollTipValue, setToolTipValue] = useState(0);
  const [tollTipIcon, setToolTipIcon] = useState('');

  const ExternalTooltip = React.useCallback(({ chart, tooltip }: { chart: Chart; tooltip: TooltipModel<keyof ChartTypeRegistry> }) => {
    // let color = '';
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
      // color = tooltip.labelColors[0].borderColor.toString();
      text = (chart.data.labels[dataIndex] as string).toLocaleUpperCase() + ' | ' + (chart.data.datasets[datasetIndex]?.label as string).toLocaleUpperCase();
      value = chart.data.datasets[datasetIndex]?.data[dataIndex]?.toString() || '';
      // icon = chart.data.datasets[datasetIndex].icon || '';
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
      setToolTipIcon('burger');
    }
  }, []);

  const LegendLabels = React.useMemo(() => {
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

  const maxValue = React.useMemo(() => {
    return Math.max(
      ...props.meals.map((meal) => {return fat(meal.alimentos) * 9}),
      ...props.meals.map((meal) => {return carbohydrate(meal.alimentos) * 4}),
      ...props.meals.map((meal) => {return protein(meal.alimentos) * 4}),
    );
  }, [props.meals]);

  const data = React.useMemo(() => {
    return {
      labels: props.meals.map((meal, index) => meal.nome || 'refeição sem nome ' + (index + 1)),
      datasets: [
        {
          label: 'LIPÍDEOS',
          icon: 'burger',
          borderColor: themeValues.primary,
          backgroundColor: `rgba(${themeValues.primaryrgb},0.1)`,
          data: props.meals.map((meal) => fat(meal.alimentos) * 9),
        },
        {
          label: 'CARBOIDRATOS',
          icon: 'loaf',
          borderColor: themeValues.secondary,
          backgroundColor: `rgba(${themeValues.secondaryrgb},0.1)`,
          data: props.meals.map((meal) => carbohydrate(meal.alimentos) * 4),
        },
        {
          label: 'PROTEÍNAS',
          icon: 'loaf',
          borderColor: themeValues.quaternary,
          backgroundColor: `rgba(${themeValues.quaternaryrgb},0.1)`,
          data: props.meals.map((meal) => protein(meal.alimentos) * 4),
        },
      ],
    };
  }, [props.meals, themeValues.primary, themeValues.primaryrgb, themeValues.quaternary, themeValues.quaternaryrgb, themeValues.secondary, themeValues.secondaryrgb]);

  const config: ChartConfiguration<keyof ChartTypeRegistry, number[], string> = React.useMemo(() => {
    return {
      type: 'bar',
      options: {
        elements: {
          bar: {
            borderWidth: 1.5,
            borderRadius: parseInt(themeValues.borderRadiusMd, 10),
            borderSkipped: false,
          },
        },
        plugins: {
          crosshair: false,
          // datalabels: false,
          legend: {
            position: 'bottom',
            labels: LegendLabels,
          },
          tooltip: {
            enabled: false,
            external: ExternalTooltip,
          },
          // streaming: false,
        },
        interaction: {
          intersect: true,
          mode: 'point',
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: maxValue,
            grid: {
              display: true,
              lineWidth: 1,
              color: themeValues.separatorLight,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              stepSize: 10,
              padding: 8,
              fontColor: themeValues.alternate,
            },
          },
          x: {
            grid: { display: false, drawBorder: false },
          },
        },
      },
      data,
    };
  }, [themeValues.borderRadiusMd, themeValues.separatorLight, themeValues.alternate, LegendLabels, ExternalTooltip, maxValue, data]);

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
        <div
          style={{ borderColor: themeValues.primary, borderWidth: 1, borderStyle: 'solid' }}
          className="icon-container  d-flex align-middle align-items-center justify-content-center align-self-center rounded-xl sh-5 sw-5 rounded-xl me-3"
        >
          <CsLineIcons icon={tollTipIcon} stroke={themeValues.primary} />
        </div>
        <div>
          <span className="text d-flex align-middle text-alternate align-items-center text-small">{tollTipLabel}</span>
          <span className="value d-flex align-middle text-body align-items-center cta-4">{tollTipValue}</span>
        </div>
      </div>
    </>
  );
};

export default React.memo(CalorieDistributionGraph);
