import React, { useState, useEffect } from 'react';

const OfflineNotification: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowNotification(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Если пользователь офлайн при загрузке компонента, показываем уведомление
    if (isOffline) {
      setShowNotification(true);
    }

    // Скрываем уведомление через 5 секунд
    let timer: number;
    if (showNotification) {
      timer = window.setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, [isOffline, showNotification]);

  if (!showNotification) return null;

  return (
    <div className="offline-notification">
      {isOffline ? 'Вы находитесь в офлайн-режиме. Некоторые функции могут быть недоступны.' : 'Соединение восстановлено.'}
    </div>
  );
};

export default OfflineNotification; 