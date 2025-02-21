import React from 'react';
import './WeatherRecommendations.css';

interface WeatherRecommendationsProps {
    temperature: number;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    precipitation: number;
    pressure: number;
}

const WeatherRecommendations: React.FC<WeatherRecommendationsProps> = ({
    temperature,
    humidity,
    windSpeed,
    uvIndex,
    precipitation,
    pressure
}) => {
    const getClothingRecommendations = () => {
        const recommendations = [];
        
        if (temperature < 0) {
            recommendations.push('Тёплая зимняя одежда, шапка, шарф и перчатки');
        } else if (temperature < 10) {
            recommendations.push('Куртка, свитер, тёплые брюки');
        } else if (temperature < 20) {
            recommendations.push('Лёгкая куртка или кардиган');
        } else {
            recommendations.push('Лёгкая одежда, головной убор от солнца');
        }

        if (precipitation > 30) {
            recommendations.push('Возьмите зонт или дождевик');
        }

        if (uvIndex > 5) {
            recommendations.push('Используйте солнцезащитный крем');
        }

        return recommendations;
    };

    const getSportRecommendations = () => {
        if (temperature < -10) return 'Лучше заниматься спортом в помещении';
        if (temperature > 30) return 'Избегайте интенсивных нагрузок в жару';
        if (precipitation > 50) return 'Рекомендуются занятия в помещении';
        return 'Благоприятные условия для спорта на улице';
    };

    const getAllergyWarnings = () => {
        const warnings = [];
        if (humidity > 60) {
            warnings.push('Повышенная влажность - возможно обострение астмы');
        }
        if (pressure < 740) {
            warnings.push('Пониженное давление - следите за самочувствием');
        }
        return warnings;
    };

    const getGardeningAdvice = () => {
        const advice = [];
        if (temperature < 5) {
            advice.push('Защитите растения от заморозков');
        }
        if (precipitation < 30) {
            advice.push('Рекомендуется полив растений');
        }
        if (uvIndex > 7) {
            advice.push('Обеспечьте тень для чувствительных растений');
        }
        return advice;
    };

    return (
        <div className="weather-recommendations">
            <div className="recommendations-section">
                <h3>Рекомендации по одежде</h3>
                <ul>
                    {getClothingRecommendations().map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            </div>

            <div className="recommendations-section">
                <h3>Спортивные рекомендации</h3>
                <p>{getSportRecommendations()}</p>
            </div>

            <div className="recommendations-section">
                <h3>Предупреждения об аллергии</h3>
                <ul>
                    {getAllergyWarnings().map((warning, index) => (
                        <li key={index}>{warning}</li>
                    ))}
                </ul>
            </div>

            <div className="recommendations-section">
                <h3>Советы садоводам</h3>
                <ul>
                    {getGardeningAdvice().map((advice, index) => (
                        <li key={index}>{advice}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WeatherRecommendations; 