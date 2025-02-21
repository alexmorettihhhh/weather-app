import React, { useEffect, useRef } from 'react';
import './AnimatedWeather.css';

interface AnimatedWeatherProps {
    weatherType: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm';
    temperature: number;
    isDay: boolean;
}

const AnimatedWeather: React.FC<AnimatedWeatherProps> = ({ weatherType, temperature, isDay }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cloudsRef = useRef<Cloud[]>([]);

    interface Cloud {
        x: number;
        y: number;
        speed: number;
        size: number;
        opacity: number;
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Устанавливаем размер canvas
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize();

        // Инициализация облаков
        const initClouds = () => {
            cloudsRef.current = Array.from({ length: 10 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height / 2),
                speed: 0.2 + Math.random() * 0.3,
                size: 50 + Math.random() * 100,
                opacity: 0.4 + Math.random() * 0.3
            }));
        };

        // Отрисовка облака
        const drawCloud = (cloud: Cloud) => {
            if (!ctx) return;
            
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
            
            // Создаем форму облака из нескольких окружностей
            const centerX = cloud.x;
            const centerY = cloud.y;
            
            ctx.arc(centerX, centerY, cloud.size * 0.3, 0, Math.PI * 2);
            ctx.arc(centerX + cloud.size * 0.2, centerY - cloud.size * 0.1, cloud.size * 0.25, 0, Math.PI * 2);
            ctx.arc(centerX - cloud.size * 0.2, centerY, cloud.size * 0.25, 0, Math.PI * 2);
            ctx.arc(centerX + cloud.size * 0.3, centerY, cloud.size * 0.2, 0, Math.PI * 2);
            
            ctx.fill();
            ctx.restore();
        };

        // Анимация
        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Обновляем и отрисовываем облака
            cloudsRef.current.forEach(cloud => {
                cloud.x += cloud.speed;
                if (cloud.x > canvas.width + cloud.size) {
                    cloud.x = -cloud.size;
                }
                drawCloud(cloud);
            });

            // Добавляем эффекты в зависимости от погоды
            switch (weatherType) {
                case 'rain':
                    drawRain(ctx, canvas);
                    break;
                case 'snow':
                    drawSnow(ctx, canvas);
                    break;
                case 'thunderstorm':
                    drawLightning(ctx, canvas);
                    break;
            }

            requestAnimationFrame(animate);
        };

        // Эффект дождя
        const drawRain = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
            ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + 1, y + 20);
                ctx.stroke();
            }
        };

        // Эффект снега
        const drawSnow = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
            ctx.fillStyle = 'white';
            for (let i = 0; i < 100; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        // Эффект молнии
        const drawLightning = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
            if (Math.random() < 0.03) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                setTimeout(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }, 50);
            }
        };

        initClouds();
        animate();

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };
    }, [weatherType]);

    return (
        <div className={`animated-weather ${weatherType} ${isDay ? 'day' : 'night'}`}>
            <canvas ref={canvasRef} className="weather-canvas" />
            <div className="weather-overlay"></div>
        </div>
    );
};

export default AnimatedWeather; 