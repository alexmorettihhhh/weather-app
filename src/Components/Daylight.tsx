import React from 'react';
import './Daylight.css';

interface DaylightProps {
    sunrise: string;
    sunset: string;
    daylightDuration: string;
    moonPhase?: string;
    magneticField?: string;
    uvIndex?: number;
}

const Daylight: React.FC<DaylightProps> = ({ 
    sunrise, 
    sunset, 
    daylightDuration,
    moonPhase = "Убывающая луна",
    magneticField = "Спокойное магнитное поле",
    uvIndex = 0
}) => {
    const convertTo24Hour = (timeStr: string): string => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours !== 12) {
            return `${String(hours + 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        }
        if (period === 'AM' && hours === 12) {
            return `00:${String(minutes).padStart(2, '0')}`;
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    return (
        <div className="daylight-info">
            <div className="daylight-visualization">
                <div className="daylight-arc">
                    <div className="earth-container">
                        <div className="earth"></div>
                        <div className="moon" title={moonPhase}></div>
                    </div>
                    <div className="sun-time sunrise">
                        <div className="sun-icon"></div>
                        <span>{convertTo24Hour(sunrise)}</span>
                    </div>
                    <div className="sun-time sunset">
                        <div className="sun-icon"></div>
                        <span>{convertTo24Hour(sunset)}</span>
                    </div>
                </div>
                <div className="daylight-duration">{daylightDuration}</div>
                <div className="additional-info">
                    <div>{moonPhase}</div>
                    <div>{magneticField}</div>
                    <div>Низкий УФ-индекс</div>
                </div>
            </div>
        </div>
    );
};

export default Daylight;
