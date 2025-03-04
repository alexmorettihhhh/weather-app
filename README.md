# Weather App

Современное веб-приложение для отслеживания погоды с интерактивным интерфейсом, расширенной функциональностью и поддержкой PWA.

![Weather App Screenshot](./screenshot.png)

## 📋 Описание проекта

Weather App - это полнофункциональное приложение для отслеживания погоды, которое предоставляет пользователям подробную информацию о текущих погодных условиях и прогнозах. Приложение отличается современным интерфейсом с анимациями, интерактивными элементами и обширным набором данных о погоде. Благодаря поддержке PWA, приложение можно установить на устройство и использовать в офлайн-режиме.

## 🚀 Функциональность

- **Текущая погода**: Отображение текущей температуры, ощущаемой температуры, влажности, давления и скорости ветра
- **Прогноз на 14 дней**: Календарь с прогнозом погоды на две недели вперед
- **Почасовой прогноз**: График температуры на 24 часа
- **Месячный прогноз**: График температуры на 30 дней
- **Качество воздуха**: Показатели CO, NO₂, O₃, PM2.5
- **Дополнительная информация**: Восход/закат солнца, фаза луны, направление ветра
- **Образовательный раздел**: Статьи о погодных явлениях, интерактивные материалы, викторины
- **Геолокация**: Определение погоды по текущему местоположению пользователя
- **Поиск городов**: Поиск с автодополнением и подсказками
- **Переключение единиц измерения**: Поддержка градусов Цельсия и Фаренгейта
- **PWA**: Возможность установки на устройство и работы в офлайн-режиме
- **Кэширование данных**: Сохранение последних запросов для доступа без интернета

## 🛠️ Технологический стек

### Frontend
- **React**: Библиотека для создания пользовательского интерфейса
- **TypeScript**: Типизированный JavaScript для повышения надежности кода
- **CSS**: Стилизация компонентов с использованием современных CSS-свойств
- **Chart.js**: Библиотека для создания интерактивных графиков
- **Framer Motion**: Библиотека для создания анимаций

### PWA и кэширование
- **Service Worker**: Для кэширования ресурсов и работы в офлайн-режиме
- **Workbox**: Библиотека для упрощения работы с Service Worker
- **Web App Manifest**: Для настройки установки приложения на устройство
- **IndexedDB**: Для локального кэширования данных
- **Cache API**: Для кэширования запросов и ответов

### Дополнительные инструменты
- **Axios**: HTTP-клиент для выполнения API-запросов
- **LocalStorage**: Для хранения пользовательских настроек
- **Performance API**: Для отслеживания производительности приложения
- **Vite**: Быстрый инструмент сборки с поддержкой PWA через плагин

## 📊 UML-диаграмма компонентов

```
+-------------------+       +-------------------+
|     Weather       |------>|  AnimatedWeather  |
+-------------------+       +-------------------+
        |
        |                   +-------------------+
        +------------------>| WeatherCalendar   |
        |                   +-------------------+
        |
        |                   +-------------------+
        +------------------>| TemperatureChart  |
        |                   +-------------------+
        |
        |                   +-------------------+
        +------------------>| WeatherWidgets    |
        |                   +-------------------+
        |
        |                   +-------------------+
        +------------------>| ExtendedWeatherData|
        |                   +-------------------+
        |
        |                   +-------------------+
        +------------------>| Daylight          |
        |                   +-------------------+
        |
        |                   +-------------------+
        +------------------>| SearchSuggestions |
        |                   +-------------------+
        |
        |                   +-------------------+
        +------------------>| WeatherEducation  |
        |                   +-------------------+
        |
        |                   +-------------------+
        +------------------>| PWAInstallPrompt  |
        |                   +-------------------+
        |
        |                   +-------------------+
        +------------------>| OfflineNotification|
                            +-------------------+
                                    |
                                    |
                +-------------------+-------------------+
                |                   |                   |
    +-----------v------+  +---------v--------+  +------v-----------+
    | ArticleCard      |  | PhenomenonCard   |  | InteractiveMaterial|
    +------------------+  +------------------+  +------------------+
                |                   |                   |
                |                   |                   |
    +-----------v------+  +---------v--------+  +------v-----------+
    | QuizCard         |  | KidsContentCard  |  | FactCard         |
    +------------------+  +------------------+  +------------------+
```

## 📁 Структура проекта

```
src/
├── Components/
│   ├── AnimatedWeather.tsx
│   ├── Daylight.tsx
│   ├── ExtendedWeatherData.tsx
│   ├── OfflineNotification.tsx
│   ├── PWAInstallPrompt.tsx
│   ├── SearchSuggestions.tsx
│   ├── TemperatureChart.tsx
│   ├── Weather.tsx
│   ├── Weather.css
│   ├── WeatherCalendar.tsx
│   ├── WeatherCalendar.css
│   ├── WeatherEducation.tsx
│   ├── WeatherEducation.css
│   └── WeatherWidgets.tsx
├── types/
│   ├── education.ts
│   └── weather.ts
├── utils/
│   ├── analytics.ts
│   └── cache.ts
├── serviceWorkerRegistration.ts
└── assets/
    └── image.png
public/
├── manifest.json
├── service-worker.js
├── offline.html
├── pwa-192x192.svg
├── pwa-512x512.svg
└── images/
    └── ...
```

## 🔄 Архитектура приложения

Приложение построено на основе компонентной архитектуры React с использованием функциональных компонентов и хуков. Основные архитектурные особенности:

1. **Компонентная структура**: Каждый элемент интерфейса выделен в отдельный компонент
2. **Ленивая загрузка**: Тяжелые компоненты загружаются асинхронно для оптимизации производительности
3. **Кэширование данных**: Реализовано кэширование API-запросов для уменьшения нагрузки на сервер
4. **PWA**: Поддержка установки на устройство и работы в офлайн-режиме
5. **Аналитика**: Встроенная система аналитики для отслеживания производительности и ошибок
6. **Типизация**: Полная типизация данных с использованием TypeScript интерфейсов

## 📱 PWA функциональность

Приложение поддерживает следующие PWA-функции:

1. **Установка на устройство**: Пользователи могут установить приложение на домашний экран
2. **Офлайн-режим**: Кэширование основных ресурсов и последних запросов погоды
3. **Фоновая синхронизация**: Обновление данных о погоде в фоновом режиме
4. **Уведомления**: Информирование пользователя о состоянии подключения
5. **Адаптивный дизайн**: Оптимизация для различных устройств и ориентаций экрана

## 🚀 Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск тестов
npm test
```

## 📄 Лицензия

MIT
