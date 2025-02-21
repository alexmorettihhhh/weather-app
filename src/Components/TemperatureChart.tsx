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
                backgroundColor: '#646cff',
                borderColor: '#646cff',
                tension: 0.4,
                pointBackgroundColor: '#535bf2',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#646cff',
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#ffffff',
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                backgroundColor: '#1a1a1a',
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
                beginAtZero: false,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#ffffff',
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
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#ffffff',
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
        <div style={{ height: '400px' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default TemperatureChart;
