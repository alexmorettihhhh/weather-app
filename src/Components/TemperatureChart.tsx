import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface TemperatureChartProps {
    temperatures: number[];
    labels: string[];
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ temperatures, labels }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Температура',
                data: temperatures,
                fill: false,
                borderColor: '#646cff',
                tension: 0.4,
                pointBackgroundColor: '#646cff',
                pointBorderColor: '#000000',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#646cff',
                pointRadius: 4,
                pointHoverRadius: 6,
                borderWidth: 2
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#000000',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#646cff',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function(context: any) {
                        return `${context.parsed.y}°C`;
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 12
                    },
                    callback: function(value: any) {
                        return `${value}°`;
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 12
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        }
    };

    return (
        <div style={{ height: '400px', padding: '20px 0' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default TemperatureChart;
