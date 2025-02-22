import React, { useState } from 'react';
import './WeatherEducation.css';

interface WeatherPhenomenon {
    title: string;
    description: string;
    icon: string;
    details: string[];
}

interface WeatherFact {
    fact: string;
    explanation: string;
    icon: string;
}

interface ClimateFeature {
    region: string;
    description: string;
    characteristics: string[];
    icon: string;
}

const weatherPhenomena: WeatherPhenomenon[] = [
    {
        title: "Гроза",
        description: "Атмосферное явление с молниями и громом",
        icon: "⛈️",
        details: [
            "Возникает при столкновении теплого и холодного воздуха",
            "Молния может нагреть воздух до 30,000°C",
            "Гром - это звуковая волна от быстрого расширения воздуха",
            "Средняя продолжительность грозы - 30 минут"
        ]
    },
    {
        title: "Радуга",
        description: "Оптическое явление в атмосфере",
        icon: "🌈",
        details: [
            "Появляется при преломлении солнечного света в каплях воды",
            "Всегда имеет семь основных цветов",
            "Наблюдатель всегда видит свою уникальную радугу",
            "Радуга - это полный круг, но мы видим только его часть"
        ]
    },
    {
        title: "Торнадо",
        description: "Вихревое движение воздуха с воронкообразным облаком",
        icon: "🌪️",
        details: [
            "Скорость ветра может достигать 500 км/ч",
            "Диаметр воронки от нескольких метров до километра",
            "Чаще всего возникает в США",
            "Может поднять в воздух автомобиль или небольшой дом"
        ]
    }
];

const weatherFacts: WeatherFact[] = [
    {
        fact: "Молния ударяет в землю 100 раз в секунду",
        explanation: "На Земле каждую секунду происходит около 100 ударов молний, что составляет около 8 миллионов молний в день.",
        icon: "⚡"
    },
    {
        fact: "Самая низкая температура на Земле",
        explanation: "Самая низкая температура (-89.2°C) была зарегистрирована на станции Восток в Антарктиде в 1983 году.",
        icon: "❄️"
    },
    {
        fact: "Самый длинный дождь",
        explanation: "Самый продолжительный дождь длился 331 день на острове Кауаи, Гавайи, с 1 августа 1993 по 27 июля 1994 года.",
        icon: "🌧️"
    }
];

const climateFeatures: ClimateFeature[] = [
    {
        region: "Тропический пояс",
        description: "Жаркий климат с обильными осадками",
        characteristics: [
            "Среднегодовая температура выше 20°C",
            "Высокая влажность воздуха",
            "Два сезона: сухой и дождливый",
            "Богатая растительность"
        ],
        icon: "🌴"
    },
    {
        region: "Умеренный пояс",
        description: "Четыре четко выраженных сезона",
        characteristics: [
            "Изменчивая погода",
            "Средняя температура от -5°C до +25°C",
            "Регулярные осадки в течение года",
            "Разнообразная растительность"
        ],
        icon: "🍁"
    },
    {
        region: "Арктический пояс",
        description: "Холодный климат с длинной зимой",
        characteristics: [
            "Температура редко поднимается выше 10°C",
            "Полярный день и полярная ночь",
            "Вечная мерзлота",
            "Скудная растительность"
        ],
        icon: "🧊"
    }
];

const WeatherEducation: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'phenomena' | 'facts' | 'climate'>('phenomena');

    return (
        <div className="weather-education">
            <div className="education-tabs">
                <button 
                    className={`tab-button ${activeTab === 'phenomena' ? 'active' : ''}`}
                    onClick={() => setActiveTab('phenomena')}
                >
                    Метеорологические явления
                </button>
                <button 
                    className={`tab-button ${activeTab === 'facts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('facts')}
                >
                    Интересные факты
                </button>
                <button 
                    className={`tab-button ${activeTab === 'climate' ? 'active' : ''}`}
                    onClick={() => setActiveTab('climate')}
                >
                    Климатические особенности
                </button>
            </div>

            <div className="education-content">
                {activeTab === 'phenomena' && (
                    <div className="phenomena-grid">
                        {weatherPhenomena.map((phenomenon, index) => (
                            <div key={index} className="phenomenon-card">
                                <div className="phenomenon-header">
                                    <span className="phenomenon-icon">{phenomenon.icon}</span>
                                    <h3>{phenomenon.title}</h3>
                                </div>
                                <p className="phenomenon-description">{phenomenon.description}</p>
                                <ul className="phenomenon-details">
                                    {phenomenon.details.map((detail, i) => (
                                        <li key={i}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'facts' && (
                    <div className="facts-grid">
                        {weatherFacts.map((fact, index) => (
                            <div key={index} className="fact-card">
                                <span className="fact-icon">{fact.icon}</span>
                                <h3>{fact.fact}</h3>
                                <p>{fact.explanation}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'climate' && (
                    <div className="climate-grid">
                        {climateFeatures.map((climate, index) => (
                            <div key={index} className="climate-card">
                                <div className="climate-header">
                                    <span className="climate-icon">{climate.icon}</span>
                                    <h3>{climate.region}</h3>
                                </div>
                                <p className="climate-description">{climate.description}</p>
                                <ul className="climate-characteristics">
                                    {climate.characteristics.map((char, i) => (
                                        <li key={i}>{char}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherEducation; 