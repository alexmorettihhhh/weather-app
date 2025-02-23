import React, { useEffect, useState } from 'react';
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
    magneticField = "Спокойное",
    uvIndex = 0
}) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const getUVIndexText = (index: number): string => {
        if (index <= 2) return 'Низкий УФ-индекс';
        if (index <= 5) return 'Средний УФ-индекс';
        if (index <= 7) return 'Высокий УФ-индекс';
        return 'Очень высокий УФ-индекс';
    };

    return (
        <div className={`daylight-info ${mounted ? 'mounted' : ''}`}>
            <div className="daylight-visualization">
                <div className="daylight-arc">
                    <div className="earth-container">
                        <div className="earth" />
                    </div>
                    <div className="sun-time sunrise">
                        <div className="sun-icon" />
                        {convertTo24Hour(sunrise)}
                    </div>
                    <div className="sun-time sunset">
                        <div className="sun-icon" />
                        {convertTo24Hour(sunset)}
                    </div>
                </div>
                <div className="daylight-duration">
                    {daylightDuration}
                </div>
                <div className="additional-info">
                    <div>{moonPhase}</div>
                    <div>{magneticField}</div>
                    <div>{getUVIndexText(uvIndex)}</div>
                </div>
            </div>
        </div>
    );
};

export default Daylight;

