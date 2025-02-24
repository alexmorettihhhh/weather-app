import React, { useEffect, useState } from 'react';
import { WeatherAlert } from '../types/weather';
import { analytics } from '../utils/analytics';
import './WeatherAlerts.css';

interface WeatherAlertsProps {
    city: string;
    alerts?: WeatherAlert[];
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ city, alerts = [] }) => {
    const [showNotification, setShowNotification] = useState(false);
    const [currentAlert, setCurrentAlert] = useState<WeatherAlert | null>(null);

    useEffect(() => {
        if (alerts.length > 0) {
            const hasHighSeverity = alerts.some(alert => alert.severity === 'high');
            if (hasHighSeverity) {
                setShowNotification(true);
                setCurrentAlert(alerts.find(alert => alert.severity === 'high') || alerts[0]);
                analytics.trackEvent('alert', 'show', 'high_severity');
            }
        }
    }, [alerts]);

    const handleDismiss = () => {
        setShowNotification(false);
        analytics.trackEvent('alert', 'dismiss');
    };

    const getSeverityColor = (severity: WeatherAlert['severity']): string => {
        switch (severity) {
            case 'high':
                return '#ff4444';
            case 'medium':
                return '#ffbb33';
            case 'low':
                return '#00C851';
            default:
                return '#33b5e5';
        }
    };

    const getAlertIcon = (type: WeatherAlert['type']): string => {
        switch (type) {
            case 'storm':
                return '⛈️';
            case 'rain':
                return '🌧️';
            case 'snow':
                return '❄️';
            case 'extreme':
                return '⚠️';
            default:
                return '🌤️';
        }
    };

    if (!showNotification || !currentAlert) {
        return null;
    }

    return (
        <div className="weather-alerts-container">
            <div 
                className="weather-alert"
                style={{ borderColor: getSeverityColor(currentAlert.severity) }}
                role="alert"
            >
                <div className="alert-header">
                    <span className="alert-icon">
                        {getAlertIcon(currentAlert.type)}
                    </span>
                    <h3>{currentAlert.title}</h3>
                    <button 
                        className="close-button"
                        onClick={handleDismiss}
                        aria-label="Закрыть уведомление"
                    >
                        ×
                    </button>
                </div>

                <div className="alert-content">
                    <p>{currentAlert.description}</p>
                    <div className="alert-meta">
                        <span className="alert-location">📍 {city}</span>
                        <span className="alert-time">
                            {new Date(currentAlert.startTime).toLocaleTimeString()} - 
                            {new Date(currentAlert.endTime).toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <div className="alert-actions">
                    <button 
                        className="action-button"
                        onClick={() => {
                            analytics.trackEvent('alert', 'details_view');
                            // Здесь будет открытие подробной информации
                        }}
                    >
                        Подробнее
                    </button>
                    <button 
                        className="action-button secondary"
                        onClick={() => {
                            analytics.trackEvent('alert', 'notification_settings');
                            // Здесь будет открытие настроек уведомлений
                        }}
                    >
                        Настройки уведомлений
                    </button>
                </div>
            </div>

            {alerts.length > 1 && (
                <div className="alerts-counter">
                    +{alerts.length - 1} еще {alerts.length - 1 === 1 ? 'предупреждение' : 'предупреждений'}
                </div>
            )}
        </div>
    );
};

export default WeatherAlerts; 