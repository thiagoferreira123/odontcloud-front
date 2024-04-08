import React, { useEffect, useRef, useState } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, registerables } from 'chart.js';

import { useSelector } from 'react-redux';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { TooltipModel } from 'chart.js';
import { parseFloatNumber } from '/src/helpers/MathHelpers';

interface ThemeValues {
  font: string;
  primary: string;
  primaryrgb: string;
  secondary: string;
  secondaryrgb: string;
  borderRadiusMd: string;
  separatorLight: string;
  alternate: string;
  quaternary: string;
  quaternaryrgb: string;
}

interface GroupValue {
  id: number;
  title: string;
  name: string;
  total: number;
  percentage: number;
  grams: number;
  color: string;
}

interface FoodGroupChartProps {
  groupValues: GroupValue[];
}

const FoodGroupChart = (props: FoodGroupChartProps) => {
  const { themeValues } = useSelector<{ settings: { themeValues: ThemeValues } }, { themeValues: ThemeValues }>((state) => state.settings);
  const chartContainer = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [tollTipLabel, setToolTipLabel] = useState('');
  const [tollTipValue, setToolTipValue] = useState(0);
  const [tollTipIcon, setToolTipIcon] = useState('');
  const [toolTipColor, setToolTipColor] = useState(themeValues.primary);

  const ExternalTooltip = React.useCallback(({ chart, tooltip }: { chart: Chart; tooltip: TooltipModel<keyof ChartTypeRegistry> }) => {
    let color = '';
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
      color = tooltip.labelColors[0].borderColor.toString();
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
      setToolTipColor(color);
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

  const data = React.useMemo(() => {
    return {
      datasets: [
        {
          label: '',
          data: props.groupValues.map((group) => group.percentage),
          backgroundColor: [`rgba(${themeValues.primaryrgb},0.1)`, `rgba(${themeValues.secondaryrgb},0.1)`, `rgba(${themeValues.quaternaryrgb},0.1)`],
          borderColor: props.groupValues.map((group) => group.color),
        },
      ],
      labels: props.groupValues.map((group) => group.title),
      icons: ['burger', 'cupcake', 'loaf'],
    };
  }, [props.groupValues, themeValues.primaryrgb, themeValues.quaternaryrgb, themeValues.secondaryrgb]);

  const config: ChartConfiguration<keyof ChartTypeRegistry, number[], string> = React.useMemo(() => {
    return {
      type: 'doughnut',
      plugins: [],
      options: {
        plugins: {
          crosshair: false,
          // datalabels: false,
          tooltip: {
            enabled: false,
            external: ExternalTooltip,
          },
          legend: {
            position: 'bottom',
            labels: LegendLabels,
          },
          // streaming: false,
        },
        interaction: {
          intersect: true,
          mode: 'point',
        },
        responsive: true,
        maintainAspectRatio: false,
        // cutout: 75,
        title: {
          display: false,
        },
      },
      data,
    };
  }, [data, LegendLabels, ExternalTooltip]);

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
          style={{ borderColor: toolTipColor, borderWidth: 1, borderStyle: 'solid' }}
          className="icon-container  d-flex align-middle align-items-center justify-content-center align-self-center rounded-xl sh-5 sw-5 rounded-xl me-3"
        >
          <CsLineIcons icon={tollTipIcon} stroke={toolTipColor} />
        </div>
        <div>
          <span className="text d-flex align-middle text-alternate align-items-center text-small">{tollTipLabel}</span>
          <span className="value d-flex align-middle text-body align-items-center cta-4">{tollTipValue}%</span>
        </div>
      </div>
    </>
  );
};

export default React.memo(FoodGroupChart);
