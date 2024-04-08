import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, ChartConfiguration, LegendItem, TooltipModel, registerables } from 'chart.js';
import { useSelector } from 'react-redux';
import { InterfaceState, ThemeValues } from '../../../types/Interface';
import { ChartTypeRegistry } from 'chart.js';
import { parseFloatNumber } from '../../../helpers/MathHelpers';
import { PatientsAnalysis } from './hooks';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import * as Icon from 'react-bootstrap-icons';

interface ChartPatientsAnalysisProps {
  data: PatientsAnalysis;
}

const ChartPatientsAnalysis = (props: ChartPatientsAnalysisProps) => {
  const { themeValues } = useSelector<InterfaceState, { themeValues: ThemeValues }>((state) => state.settings);
  const chartContainer = useRef(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const legendRef = useRef(null);

  const [tollTipLabel, setToolTipLabel] = useState('');
  const [tollTipValue, setToolTipValue] = useState(0);
  const [tollTipIcon, setToolTipIcon] = useState('');
  const [toolTipColor, setToolTipColor] = useState(themeValues.primary);

  const [labelItems, setLabelItems] = useState<LegendItem[]>([]);

  const CustomLegendBarPlugin = useMemo(() => {
    return {
      id: 'htmlLegendBar',
      afterUpdate: (chart: Chart) => {
        const labels = chart.options?.plugins?.legend?.labels;

        if (!labels || !labels.generateLabels) return;

        const items = labels.generateLabels(chart);

        setLabelItems(items);
      },
    };
  }, []);

  const ExternalTooltip = React.useCallback(({ chart, tooltip }: { chart: Chart; tooltip: TooltipModel<keyof ChartTypeRegistry> }) => {
    let color = '';
    let text = '';
    let value = '';

    const positionY = chart.canvas.offsetTop;
    const positionX = chart.canvas.offsetLeft;
    const { opacity } = tooltip;

    const left = `${positionX + tooltip.dataPoints[0].element.x - 75}px`;
    const top = `${positionY + tooltip.caretY}px`;

    if (chart.data.labels) {
      const { dataIndex, datasetIndex } = tooltip.dataPoints[0];
      color = tooltip.labelColors[0].borderColor.toString();
      text = (chart.data.labels[dataIndex] as string).toLocaleUpperCase() + ' | ' + (chart.data.datasets[datasetIndex]?.label as string).toLocaleUpperCase();
      value = chart.data.datasets[datasetIndex]?.data[dataIndex]?.toString() || '';
      setToolTipIcon(chart.data.datasets[datasetIndex].label ?? 'Masculino')
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
      // setToolTipIcon('gender');
      setToolTipColor(color);
    }
  }, []);

  const data = useMemo(() => {
    return {
      labels: props.data.meses.map((item) => item.mes),
      datasets: [
        {
          label: 'Masculino',
          icon: 'gender',
          backgroundColor: `rgba(${themeValues.primaryrgb},0.1)`,
          borderColor: themeValues.primary,
          barPercentage: 0.5,
          borderSkipped: 'bottom',
          borderWidth: 1.5,
          borderRadius: parseInt(themeValues.borderRadiusMd, 10),
          data: props.data.meses.map((item) => item.genero1),
        },
        {
          label: 'Feminino',
          icon: 'gender',
          backgroundColor: `rgba(${themeValues.secondaryrgb},0.1)`,
          borderColor: themeValues.secondary,
          barPercentage: 0.5,
          borderSkipped: 'bottom',
          borderWidth: 1.5,
          borderRadius: parseInt(themeValues.borderRadiusMd, 10),
          data: props.data.meses.map((item) => item.genero0),
        },
      ],
    };
  }, [props.data.meses, themeValues.borderRadiusMd, themeValues.primary, themeValues.primaryrgb, themeValues.secondary, themeValues.secondaryrgb]);

  const config: ChartConfiguration<keyof ChartTypeRegistry, number[], string> = useMemo(() => {
    return {
      type: 'bar',
      plugins: [CustomLegendBarPlugin],
      options: {
        plugins: {
          crosshair: false,
          // datalabels: false,
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
            external: ExternalTooltip,
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
            max: props.data.meses.reduce(
              (acc, item) => (Number(item.genero0) + Number(item.genero1) > acc ? Number(item.genero0) + Number(item.genero1) : acc),
              0
            ),
            grid: {
              display: true,
              lineWidth: 1,
              color: themeValues.separatorLight,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              stepSize:
                props.data.meses.reduce(
                  (acc, item) => (Number(item.genero0) + Number(item.genero1) > acc ? Number(item.genero0) + Number(item.genero1) : acc),
                  0
                ) / 12,
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
  }, [CustomLegendBarPlugin, ExternalTooltip, data, props.data.meses, themeValues.alternate, themeValues.separatorLight]);

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
      <div ref={legendRef} className="custom-legend-container mb-3 pb-3 d-flex flex-row">
        {labelItems.map((legend) => {
          const { datasetIndex, strokeStyle, text } = legend;

          if (datasetIndex === undefined) return;

          const total = data.datasets[datasetIndex].data.reduce((acc, num) => {
            return num ? Number(num) + Number(acc) : 0;
          }, 0);

          return (
            <a
              key={`legend_bar${datasetIndex}`}
              href="#!"
              className="d-flex flex-row g-0 align-items-center me-5"
              onClick={(event) => {
                event.preventDefault();
                // chart.setDatasetVisibility(datasetIndex, !chart.isDatasetVisible(datasetIndex));
                // chart.update();
              }}
            >
              <div className="pe-2">
                <div
                  style={{ borderColor: strokeStyle as string, borderWidth: 1, borderStyle: 'solid' }}
                  className="icon-container  sw-5 sh-5 rounded-xl d-flex justify-content-center align-items-center"
                >
                  {/* <CsLineIcons icon={data.datasets[datasetIndex].icon} stroke={strokeStyle as string} /> */}
                  {data.datasets[datasetIndex].label === 'Feminino' ? <Icon.GenderFemale style={{ color: data.datasets[datasetIndex].borderColor }} /> : <Icon.GenderMale style={{ color: data.datasets[datasetIndex].borderColor }} />}
                </div>
              </div>
              <div>
                <div className="text p mb-0 d-flex align-items-center text-small text-muted">{text.toLocaleUpperCase()}</div>
                <div className="value cta-4">{total}</div>
              </div>
            </a>
          );
        })}
      </div>
      <div className="sh-30">
        <canvas ref={chartContainer} />
        <div
          ref={tooltipRef}
          className="custom-tooltip position-absolute bg-foreground rounded-md border border-separator pe-none p-3 d-flex z-index-1 align-items-center opacity-0 basic-transform-transition"
        >
          <div
            style={{ borderColor: toolTipColor, borderWidth: 1, borderStyle: 'solid' }}
            className="icon-container  d-flex align-middle align-items-center justify-content-center align-self-center rounded-xl sh-5 sw-5 rounded-xl me-3"
          >
            {tollTipIcon === 'Feminino' ? <Icon.GenderFemale style={{ color: toolTipColor }} /> : <Icon.GenderMale style={{ color: toolTipColor }} />}
          </div>
          <div>
            <span className="text d-flex align-middle text-alternate align-items-center text-small">{tollTipLabel}</span>
            <span className="value d-flex align-middle text-body align-items-center cta-4">{tollTipValue}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(ChartPatientsAnalysis);
