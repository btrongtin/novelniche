import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
// const options = {
//   responsive: true,
//   // plugins: {
//   //   legend: {
//   //     position: 'top',
//   //   },
//   //   // title: {
//   //   //   display: true,
//   //   //   text: 'Chart.js Line Chart',
//   //   // },
//   // },
// };

const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

const StoreIncomeLineChart = ({ data }) => {
    if (!data) return;
    const transformedData = data.map((item) => ({
        month: labels[item.month - 1], // Adjusting for 0-based indexing
        amount: item.totalAmount,
    }));
    const formattedData = {
        labels: transformedData.map((e) => e.month),
        datasets: [
            {
                label: 'Revenue',
                data: transformedData.map((e) => e.amount),
                borderColor: 'rgb(73,131,116)',
                backgroundColor: 'rgb(73,131,116)',
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            datalabels: {
                display: false,
            },
        },
    };
    return (
        <div className="card shadow h-100">
            <div className="card-header">Store Income</div>
            <div className="card-body">
                <Line options={options} data={formattedData} />
            </div>
        </div>
    );
};

export default StoreIncomeLineChart;
