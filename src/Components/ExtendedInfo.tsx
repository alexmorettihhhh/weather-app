import React from 'react';

interface ExtendedInfoProps {
    uvIndex: number;
    maxUvTime: string;
    moonPhase: string;
    moonInfluence: string;
    magneticField: string;
    precipitationChance: number;
}

const ExtendedInfo: React.FC<ExtendedInfoProps> = ({
    uvIndex,
    maxUvTime,
    moonPhase,
    moonInfluence,
    magneticField,
    precipitationChance
}) => {
    return (
        <div className="extended-info">
            <h2>Расширенная информация</h2>
            <div className="extended-info-grid">
                <div className="info-card">
                    <h3>UV Индекс</h3>
                    <p className="value">{uvIndex}</p>
                    <p>Пик активности: {maxUvTime}</p>
                </div>
                <div className="info-card">
                    <h3>Фаза луны</h3>
                    <p>{moonPhase}</p>
                    <p>{moonInfluence}</p>
                </div>
                <div className="info-card">
                    <h3>Магнитное поле</h3>
                    <p>{magneticField}</p>
                </div>
                <div className="info-card">
                    <h3>Вероятность осадков</h3>
                    <p>{precipitationChance}%</p>
                </div>
            </div>
        </div>
    );
};

export default ExtendedInfo; 