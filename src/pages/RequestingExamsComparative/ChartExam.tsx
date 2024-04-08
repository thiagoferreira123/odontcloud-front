import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, ChartConfiguration, ChartTypeRegistry, TooltipModel, registerables } from 'chart.js';
import { Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ExamAnalyse } from '.';
import { InterfaceState, ThemeValues } from '../../types/Interface';
import { parseFloatNumber } from '../../helpers/MathHelpers';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';

interface ChartLargeLineSalesProps {
  exam: ExamAnalyse;
}

const ChartLargeLineSales = (props: ChartLargeLineSalesProps) => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);
  const chartContainer = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [tollTipText, setToolTipText] = useState('');
  const [tollTipValue, setToolTipValue] = useState(0);
  const [tollTipIcon, setToolTipIcon] = useState('vaccine');

  const ExternalTooltip = React.useCallback(({ chart, tooltip }: { chart: Chart; tooltip: TooltipModel<keyof ChartTypeRegistry> }) => {
    let text = '';
    let value = '';

    const positionY = chart.canvas.offsetTop;
    const positionX = chart.canvas.offsetLeft;
    const { opacity } = tooltip;

    const left = `${positionX + tooltip.dataPoints[0].element.x - 75}px`;
    const top = `${positionY + tooltip.caretY}px`;

    if (tooltip.body && chart.data.labels) {
      const { dataIndex, datasetIndex } = tooltip.dataPoints[0];
      text = (chart.data.labels[dataIndex] as string).toLocaleUpperCase() + ' | ' + (chart.data.datasets[datasetIndex]?.label as string).toLocaleUpperCase();
      value = chart.data.datasets[datasetIndex]?.data[dataIndex]?.toString() || '';
      // icon = chart.data.datasets[datasetIndex].icon || '';
    }

    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = String(opacity);
      tooltipRef.current.style.left = left;
      tooltipRef.current.style.top = top;

      setToolTipText(text);
      setToolTipValue(parseFloatNumber(value));
      setToolTipIcon('vaccine');
    }
  }, []);

  const data = useMemo(() => {
    return {
      labels: props.exam.dates,
      datasets: [
        {
          label: 'Exames',
          data: props.exam.value.map((value) => (value ? value : null)),
          icons: ['arrow-top', 'arrow-top', 'arrow-top', 'arrow-top', 'arrow-bottom'],
          borderColor: themeValues.primary,
          pointBackgroundColor: themeValues.primary,
          pointBorderColor: themeValues.primary,
          pointHoverBackgroundColor: themeValues.foreground,
          pointHoverBorderColor: themeValues.primary,
          borderWidth: 2,
          pointRadius: 2,
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointHoverRadius: 5,
          fill: false,
          cubicInterpolationMode: 'monotone',
        },
      ]
    };
  }, [props.exam.dates, props.exam.value, themeValues.foreground, themeValues.primary]);

  const config: ChartConfiguration<keyof ChartTypeRegistry, (number | null)[], string | number | boolean> = useMemo(() => {
    return {
      type: 'line',
      plugins: [ChartDataLabels],
      options: {
        layout: {
          padding: {
            left: 15,
            right: 15,
            top: 35,
            bottom: 0,
          },
        },
        showLine: true,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          crosshair: true,
          datalabels: {
            align: 'end',
            anchor: 'end',
            offset: 5,
            backgroundColor: 'transparent',
            borderRadius: parseInt(themeValues.borderRadiusMd, 10),
            borderWidth: 1,
            padding: 5,
            borderColor: (context) => {
              return context.dataset.borderColor ? (context.dataset.borderColor as string) : '';
            },
            color: themeValues.primary,
            font: {
              size: 10,
            },
            formatter: Math.round,
          },
          tooltip: {
            enabled: false,
            external: ExternalTooltip,
          },
          legend: {
            display: false,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            type: 'linear',
            grid: {
              display: false,
              drawBorder: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
          x: {
            type: 'category',
            grid: {
              display: false,
              drawTicks: false,
              drawBorder: false,
            },
            ticks: { display: false },
          },
        },
      },
      data,
    };
  }, [ExternalTooltip, data, themeValues.alternate, themeValues.borderRadiusMd]);

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
      <Col md="12" sm="auto" className="d-flex flex-column justify-content-between custom-tooltip pe-0 pe-sm-4">
        <p className="heading title mb-1">{props.exam.name}</p>
        <div ref={tooltipRef} />
      </Col>
      <Col md="12" className="col-sm">
        <div
          ref={tooltipRef}
          className="custom-tooltip position-absolute bg-foreground rounded-md border border-separator pe-none p-3 d-flex z-index-1 align-items-center opacity-0 basic-transform-transition"
        >
          <div>
            <div className="cta-2 text-primary value d-inline-block align-middle">{tollTipValue}</div>
            <CsLineIcons icon={tollTipIcon} className="icon d-inline-block align-middle text-primary" size={15} />
          </div>
          <div className="text-small text-muted mb-1 text text-uppercase">{tollTipText}</div>
        </div>
      </Col>
      <Col md="12" className="col-sm sh-17">
        <canvas data-name={props.exam.name} ref={chartContainer} />
      </Col>
    </>
  );
};

export default React.memo(ChartLargeLineSales);
