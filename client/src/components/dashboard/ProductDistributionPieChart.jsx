import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  plugins,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Colors } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, Colors, ChartDataLabels);

const ProductDistributionPieChart = ({ data }) => {
  if (!data) return;

  const formattedData = {
    labels: data.map((e) => e.category),
    datasets: [
      {
        label: '# of products',
        data: data.map((e) => e.count),
        borderWidth: 2,
      },
    ],
  };
  const options = {
    plugins: {
      // Change options for ALL labels of THIS CHART
      datalabels: {
        color: '#FFF',
        formatter: (val, ctx) => ctx.chart.data.labels[ctx.dataIndex],
        font: {
          size: '12px',
          weight: '600',
        },
      },
    },
  };
  return (
    <div className="card shadow h-100">
      <div className="card-header">Phân bố sản phẩm</div>
      <div className="card-body">
        <Pie data={formattedData} plugins={ChartDataLabels} options={options} />
        ;
      </div>
    </div>
  );
};

export default ProductDistributionPieChart;
