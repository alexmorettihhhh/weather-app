import React, { useEffect, useState, lazy, Suspense } from 'react';
import axios from 'axios';
import './Weather.css';
import weatherLogo from '../assets/image.png';
import Daylight from '../Components/Daylight';
import SearchSuggestions from '../Components/SearchSuggestions';
import AnimatedWeather from '../Components/AnimatedWeather';
import { WeatherData as ApiWeatherData } from '../types/weather';
import type { MoonPhase } from '../Components/WeatherWidgets';
import weatherRecommendations from '../Components/WeatherRecommendations';
import extendedWeatherData from '../Components/ExtendedWeatherData';
import weatherWidgets from '../Components/WeatherWidgets';
import weatherCalendar from '../Components/WeatherCalendar';
import weatherEducation from './WeatherEducation';

// Ленивая загрузка тяжелых компонентов
const TemperatureChart = lazy(() => import('../Components/TemperatureChart'));
const WeatherRecommendations = lazy(() => import('../Components/WeatherRecommendations'));
const ExtendedWeatherData = lazy(() => import('../Components/ExtendedWeatherData'));
const WeatherWidgets = lazy(() => import('../Components/WeatherWidgets'));
const WeatherCalendar = lazy(() => import('../Components/WeatherCalendar'));
const WeatherEducation = lazy(() => import('./WeatherEducation'));

interface DayWeather {
    date: string;
    temperature: number;
    description: string;
    icon: string;
}

interface Forecast {
    date: string;
    temp: string;
    condition: string;
    day: string;
}

interface AirQuality {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
}

interface WeatherData {
    temperature: string;
    description: string;
    feelsLike: string;
    wind: string;
    humidity: string;
    pressure: string;
    forecast: Forecast[];
    airQuality: AirQuality;
    uvIndex: number;
    maxUvTime: string;
    moonPhase: string;
    moonInfluence: string;
    magneticField: string;
    precipitationChance: number;
    hourlyTemperatures: number[];
    sunrise: string;
    sunset: string;
    daylightDuration: string;
    weather?: ApiWeatherData['weather'];
    sys?: ApiWeatherData['sys'];
    main?: ApiWeatherData['main'];
    name: string;
}

interface FetchError extends Error {
    response?: {
        data?: {
            error?: string;
            details?: string;
        };
    };
    code?: string;
}

const CITIES_LIST = `Абаза
Абакан
Абдулино
Абинск
Агидель
Агрыз
Адыгейск
Азнакаево
Азов
Ак-Довурак
Аксай
Алагир
Алапаевск
Алатырь
Алдан
Алейск
Александров
Александровск
Александровск-Сахалинский
Алексеевка
Алексин
Алзамай
Альметьевск
Амурск
Анадырь
Анапа
Ангарск
Андреаполь
Анжеро-Судженск
Анива
Апатиты
Апрелевка
Апшеронск
Арамиль
Аргун
Арзатов
Ардон
Аркадак
Армавир
Арсеньев
Арск
Артём
Артёмовск
Артёмовский
Архангельск
Асбест
Асино
Астрахань
Аткарск
Ахтубинск
Ачинск
Аша
Бабаево
Бабушкин
Байкальск
Баймак
Бакал
Баксан
Балабаново
Балаково
Балахна
Балашиха
Балашов
Балей
Балтийск
Барабинск
Барнаул
Барыш
Батайск
Бежецк
Белая Калитва
Белая Холуница
Белгород
Белебей
Белёв
Белинский
Белово
Белогорск
Белозерск
Белокуриха
Беломорск
Белоозёрский
Белорецк
Белореченск
Белоусово
Белоярский
Белый
Бердск
Березники
Берёзовский
Берёзовский
Беслан
Бийск
Бикин
Билибино
Бирск
Бирюсинск
Бирюч
Благовещенск
Благодарный
Бобров
Богданович
Богородицк
Богородск
Боготол
Богучар
Бодайбо
Бокситогорск
Болгар
Бологое
Болотное
Болохово
Болхов
Большой Камень
Бор
Борзя
Борисоглебск
Боровичи
Боровск
Бородино
Братск
Бронницы
Брянск
Бугульма
Бугуруслан
Будённовск
Бузулук
Буинск
Буй
Буйнакск
Бутурлиновка
Валдай
Валуйки
Велиж
Великие Луки
Великий Новгород
Великий Устюг
Вельск
Венёв
Верещагино
Верея
Верхнеуральск
Верхний Тагил
Верхний Уфалей
Верхняя Пышма
Верхняя Салда
Верхняя Тура
Верхотурье
Верхоянск
Весьегонск
Ветлуга
Видное
Вилюйск
Вилючинск
Вихоревка
Вичуга
Владивосток
Владикавказ
Владимир
Волгоград
Волгодонск
Волгореченск
Волжск
Волжский
Вологда
Володарск
Волоколамск
Волосово
Волхов
Волчанск
Вольск
Воркута
Воронеж
Ворсма
Воскресенск
Воткинск
Всеволожск
Вуктыл
Выборг
Выкса
Высоковск
Высоцк
Вытегра
Вышний Волочёк
Вяземский
Вязники
Вязьма
Вятские Поляны
Гаврилов Посад
Гаврилов-Ям
Гагарин
Гаджиево
Гай
Галич
Гатчина
Гвардейск
Гдов
Геленджик
Георгиевск
Глазов
Голицыно
Горбатов
Горно-Алтайск
Горнозаводск
Горняк
Городец
Городище
Городовиковск
Гороховец
Горячий Ключ
Грайворон
Гремячинск
Грозный
Грязи
Грязовец
Губаха
Губкин
Губкинский
Гудермес
Гуково
Гулькевичи
Гурьевск
Гурьевск
Гусев
Гусиноозёрск
Гусь-Хрустальный
Давлеканово
Дагестанские Огни
Далматово
Дальнегорск
Дальнереченск
Данилов
Данков
Дегтярск
Дедовск
Демидов
Дербент
Десногорск
Дзержинск
Дзержинский
Дивногорск
Дигора
Димитровград
Дмитриев
Дмитров
Дмитровск
Дно
Добрянка
Долгопрудный
Домодедово
Донецк
Донской
Дорогобуж
Дрезна
Дубна
Дубовка
Дудинка
Духовщина
Дюртюли
Дятьково
Егорьевск
Ейск
Екатеринбург
Елабуга
Елец
Елизово
Ельня
Еманжелинск
Емва
Енисейск
Ермолино
Ершов
Ессентуки
Ефремов
Железноводск
Железногорск
Железногорск
Железногорск-Илимский
Жердевка
Жигулёвск
Жидрак
Жирновск
Жуков
Жуковка
Жуковский
Завитинск
Заводоуковск
Заволжск
Заволжье
Задонск
Заинск
Закаменск
Заозёрный
Заозёрск
Западная Двина
Заполярный
Зарайск
Заречный
Заречный
Заринск
Звенигово
Звенигород
Зверево
Зеленогорск
Зеленоградск
Зеленодольск
Зеленокумск
Зерноград
Зея
Зима
Златоуст
Злынка
Змеиногорск
Знаменск
Зубцов
Зуевка
Ивангород
Иваново
Ивантеевка
Ивдель
Игарка
Ижевск
Избербаш
Изобильный
Иланский
Инза
Иннополис
Инсар
Инта
Ипатово
Ирбит
Иркутск
Исилькуль
Искитим
Истра
Ишим
Ишимбай
Йошкар-Ола
Кадников
Казань
Калач
Калач-на-Дону
Калачинск
Калининград
Калининск
Калтан
Калуга
Калязин
Камбарка
Каменка
Каменногорск
Каменск-Уральский
Каменск-Шахтинский
Камень-на-Оби
Камешково
Камызяк
Камышин
Камышлов
Канаш
Кандалакша
Канск
Карабаново
Карабаш
Карабулак
Карасук
Карачаевск
Карачев
Каргат
Каргополь
Карпинск
Карталы
Касимов
Касли
Каспийск
Катайск
Качканар
Кашин
Кашира
Кедровый
Кемерово
Кемь
Кизел
Кизилюрт
Кизляр
Кимовск
Кимры
Кингисепп
Кинель
Кинешма
Киреевск
Киренск
Киржач
Кириллов
Кириши
Киров
Киров
Кировград
Киров-Чепецк
Кировск
Кировск
Кирс
Кирсанов
Киселёвск
Кисловодск
Клин
Клинцы
Княгинино
Ковдор
Ковров
Ковылкино
Когалым
Кодинск
Козельск
Козловка
Козьмодемьянск
Кола
Кологрив
Коломна
Колпашево
Кольчугино
Коммунар
Комсомольск
Комсомольск-на-Амуре
Конаково
Кондопога
Кондрово
Константиновск
Копейск
Кораблино
Кореновск
Коркино
Королёв
Короча
Корсаков
Коряжма
Костерёво
Костомукша
Кострома
Котельники
Котельниково
Котельнич
Котлас
Котово
Котовск
Кохма
Красавино
Красноармейск
Красноармейск
Красновишерск
Красногорск
Краснодар
Краснозаводск
Краснознаменск
Краснознаменск
Краснокаменск
Краснокамск
Краснослободск
Краснослободск
Краснотурьинск
Красноуральск
Красноуфимск
Красноярск
Красный Кут
Красный Сулин
Красный Холм
Кремёнки
Кропоткин
Крымск
Кстово
Кубинка
Кувшиново
Кудрово
Кудымкар
Кузнецк
Куйбышев
Кукмор
Кулебаки
Кумертау
Кунгур
Купино
Курган
Курганинск
Курильск
Курлово
Куровское
Курск
Куртамыш
Курчалой
Курчатов
Куса
Кушва
Кызыл
Кыштым
Кяхта
Лабинск
Лабытнанги
Лагань
Ладушкин
Лаишево
Лакинск
Лангепас
Лахденпохья
Лебедянь
Лениногорск
Ленинск
Ленинск-Кузнецкий
Ленск
Лермонтов
Лесной
Лесозаводск
Лесосибирск
Ливны
Ликино-Дулёво
Липецк
Липки
Лиски
Лихославль
Лобня
Лодейное Поле
Лосино-Петровский
Луга
Луза
Лукоянов
Луховицы
Лысково
Лысьва
Лыткарино
Льгов
Любань
Люберцы
Любим
Людиново
Лянтор
Магадан
Магас
Магнитогорск
Майкоп
Майский
Макаров
Макарьев
Макушино
Малая Вишера
Малгобек
Малмыж
Малоархангельск
Малоярославец
Мамадыш
Мамоново
Мантурово
Мариинск
Мариинский Посад
Маркс
Махачкала
Мглин
Мегион
Медвежьегорск
Медногорск
Медынь
Межгорье
Междуреченск
Мезень
Меленки
Мелеуз
Менделеевск
Мензелинск
Мещовск
Миасс
Микунь
Миллерово
Минеральные Воды
Минусинск
Миньяр
Мирный
Мирный
Михайлов
Михайловка
Михайловск
Михайловск
Мичуринск
Могоча
Можайск
Можга
Моздок
Мончегорск
Морозовск
Моршанск
Мосальск
Москва
Муравленко
Мураши
Мурино
Мурманск
Муром
Мценск
Мыски
Мытищи
Мышкин
Набережные Челны
Навашино
Наволоки
Надым
Назарово
Назрань
Называевск
Нальчик
Нариманов
Наро-Фоминск
Нарткала
Нарьян-Мар
Находка
Невель
Невельск
Невинномысск
Невьянск
Нелидово
Неман
Нерехта
Нерчинск
Нерюнгри
Нестеров
Нефтегорск
Нефтекамск
Нефтекумск
Нефтеюганск
Нея
Нижневартовск
Нижнекамск
Нижнеудинск
Нижние Серги
Нижний Ломов
Нижний Новгород
Нижний Тагил
Нижняя Салда
Нижняя Тура
Николаевск
Николаевск-на-Амуре
Никольск
Никольск
Никольское
Новая Ладога
Новая Ляля
Новоалександровск
Новоалтайск
Новоаннинский
Нововоронеж
Новодвинск
Новозыбков
Новокубанск
Новокузнецк
Новокуйбышевск
Новомичуринск
Новомосковск
Новопавловск
Новоржев
Новороссийск
Новосибирск
Новосиль
Новосокольники
Новотроицк
Новоузенск
Новоульяновск
Новоуральск
Новохопёрск
Новочебоксарск
Новочеркасск
Новошахтинск
Новый Оскол
Новый Уренгой
Ногинск
Нолинск
Норильск
Ноябрьск
Нурлат
Нытва
Нюрба
Нягань
Нязепетровск
Няндома
Облучье
Обнинск
Обоянь
Обь
Одинцово
Озёрск
Озёрск
Озёры
Октябрьск
Октябрьский
Окуловка
Олёкминск
Оленегорск
Олонец
Омск
Омутнинск
Онега
Опочка
Орёл
Оренбург
Орехово-Зуево
Орлов
Орск
Оса
Осинники
Осташков
Остров
Островной
Острогожск
Отрадное
Отрадный
Оха
Оханск
Очёр
Павлово
Павловск
Павловский Посад
Палласовка
Партизанск
Певек
Пенза
Первомайск
Первоуральск
Перевоз
Пересвет
Переславль-Залесский
Пермь
Пестово
Петров Вал
Петровск
Петровск-Забайкальский
Петрозаводск
Петропавловск-Камчатский
Петухово
Петушки
Печора
Печоры
Пикалёво
Пионерский
Питкяранта
Плавск
Пласт
Плёс
Поворино
Подольск
Подпорожье
Покачи
Покров
Покровск
Полевской
Полесск
Полысаево
Полярные Зори
Полярный
Поронайск
Порхов
Похвистнево
Почеп
Починок
Пошехонье
Правдинск
Приволжск
Приморск
Приморск
Приморско-Ахтарск
Приозерск
Прокопьевск
Пролетарск
Протвино
Прохладный
Псков
Пугачёв
Пудож
Пустошка
Пучеж
Пушкино
Пущино
Пыталово
Пыть-Ях
Пятигорск
Радужный
Радужный
Райчихинск
Раменское
Рассказово
Ревда
Реж
Реутов
Ржев
Родники
Рославль
Россошь
Ростов-на-Дону
Ростов
Рошаль
Ртищево
Рубцовск
Рудня
Руза
Рузаевка
Рыбинск
Рыбное
Рыльск
Ряжск
Рязань
Салават
Салаир
Салехард
Сальск
Самара
Санкт-Петербург
Саранск
Сарапул
Саратов
Саров
Сасово
Сальск
Сафоново
Саяногорск
Саянск
Светлогорск
Светлоград
Светлый
Светогорск
Свирск
Свободный
Себеж
Северо-Курильск
Северобайкальск
Северодвинск
Североморск
Североуральск
Северск
Севск
Сегежа
Сельцо
Семёнов
Семикаракорск
Семилуки
Сенгилей
Серафимович
Сергач
Сергиев Посад
Сердобск
Серов
Серпухов
Сертолово
Сибай
Сим
Сковородино
Скопин
Славгород
Славск
Славянск-на-Кубани
Сланцы
Слободской
Слюдянка
Смоленск
Снежинск
Снежногорск
Собинка
Советск
Советск
Советск
Советская Гавань
Советский
Сокол
Солигалич
Соликамск
Солнечногорск
Соль-Илецк
Сольвычегодск
Сольцы
Сорочинск
Сорск
Сортавала
Сосенский
Сосновка
Сосновоборск
Сосновый Бор
Сосногорск
Сочи
Спас-Деменск
Спас-Клепики
Спасск
Спасск-Дальний
Спасск-Рязанский
Среднеколымск
Среднеуральск
Сретенск
Ставрополь
Старая Купавна
Старая Русса
Старица
Стародуб
Старый Оскол
Стерлитамак
Стрежевой
Строитель
Струнино
Ступино
Суворов
Суджа
Судогда
Суздаль
Сунжа
Суоярви
Сураж
Сургут
Суровикино
Сурск
Сусуман
Сухиничи
Сухой Лог
Сызрань
Сыктывкар
Сысерть
Сычёвка
Сясьстрой
Тавда
Таганрог
Тайга
Тайшет
Талдом
Талица
Тамбов
Тара
Тарко-Сале
Таруса
Таттарск
Тверь
Теберда
Тейково
Темников
Темрюк
Терек
Тетюши
Тимашёвск
Тихвин
Тихорецк
Тобольск
Тогучин
Тольятти
Томари
Томот
Томск
Топки
Торжок
Торопец
Тосно
Тотьма
Трёхгорный
Троицк
Трубчевск
Туапсе
Туймазы
Тула
Тулун
Туран
Туринск
Тутаев
Тында
Тырныауз
Тюкалинск
Тюмень
Уварово
Углегорск
Углич
Удачный
Удомля
Ужур
Узловая
Улан-Удэ
Ульяновск
Унеча
Урай
Урень
Уржум
Урус-Мартан
Урюпинск
Усинск
Усолье-Сибирское
Усолье
Уссурийск
Усть-Джегута
Усть-Илимск
Усть-Катав
Усть-Кут
Усть-Лабинск
Устюжна
Уфа
Ухта
Учалы
Уяр
Фатеж
Фокино
Фокино
Фролово
Фрязино
Фурманов
Хабаровск
Хадыженск
Ханты-Мансийск
Харабали
Харовск
Хасавюрт
Хвалынск
Хилок
Химки
Холм
Холмск
Хотьково
Цивильск
Цимлянск
Циолковский
Чадан
Чайковский
Чапаевск
Чаплыгин
Чебаркуль
Чебоксары
Чегем
Чекалин
Челябинск
Чердынь
Черемхово
Черепаново
Череповец
Черкесск
Чёрмоз
Черноголовка
Черногорск
Чернушка
Черняховск
Чехов
Чистополь
Чита
Чкаловск
Чудово
Чулым
Чусовой
Чухлома
Шагонар
Шадринск
Шали
Шарыпово
Шарья
Шатура
Шахты
Шахунья
Шацк
Шебекино
Шелехов
Шенкурск
Шилка
Шимановск
Шиханы
Шлиссельбург
Шумерля
Шумиха
Шуя
Щёкино
Щёлково
Щигры
Щучье
Электрогорск
Электросталь
Электроугли
Элиста
Энгельс
Эртиль
Югорск
Южа
Южно-Сахалинск
Южно-Сухокумск
Южноуральск
Юрга
Юрьев-Польский
Юрьевец
Юрюзань
Юхнов
Ядрин
Якутск
Ялуторовск
Янаул
Яранск
Яровое
Ярославль
Ярцево
Ясногорск
Ясный
Яхрома`;

const roundTemperature = (temp: number): string => {
    const rounded = Math.abs(temp % 1) >= 0.5 ? 
        Math.sign(temp) * Math.ceil(Math.abs(temp)) : 
        Math.sign(temp) * Math.floor(Math.abs(temp));
    return rounded.toString();
};

const validateSearchTerm = (term: string): boolean => {
    const sanitizedTerm = term.trim();
    return sanitizedTerm.length > 0 && sanitizedTerm.length < 100;
};

const sanitizeString = (str: string): string => {
    return str.replace(/[<>]/g, '');
};

const Weather: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string>('Москва');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isCelsius, setIsCelsius] = useState(true);
    const [monthData, setMonthData] = useState<DayWeather[]>([]);
    const [cities] = useState<string[]>(CITIES_LIST.split('\n').filter(city => city.trim() !== ''));
    const [isDay, setIsDay] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filterCities = (input: string) => {
        const filtered = cities
            .filter(city => 
                city.toLowerCase().startsWith(input.toLowerCase())
            )
            .slice(0, 10); // Ограничиваем количество подсказок
        return filtered;
    };

    const fetchWeather = async (city: string) => {
        try {
            if (!validateSearchTerm(city)) {
                setError('Пожалуйста, введите корректное название города');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            const sanitizedCity = encodeURIComponent(sanitizeString(city));
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/weather/${sanitizedCity}`);

            if (!response.data) {
                throw new Error('Пустой ответ от сервера');
            }

            const apiData = response.data;
            
            // Преобразуем данные API в формат нашего приложения
            const transformedData: WeatherData = {
                temperature: apiData.main.temp.toString(),
                description: apiData.weather[0].description,
                feelsLike: apiData.main.feels_like.toString(),
                wind: apiData.wind.speed.toString(),
                humidity: apiData.main.humidity.toString(),
                pressure: apiData.main.pressure.toString(),
                forecast: apiData.forecast || [],
                airQuality: apiData.air_quality || {
                    co: 0,
                    no2: 0,
                    o3: 0,
                    so2: 0,
                    pm2_5: 0,
                    pm10: 0
                },
                uvIndex: apiData.uv || 0,
                maxUvTime: apiData.max_uv_time || '',
                moonPhase: apiData.moon_phase || 'Не определена',
                moonInfluence: apiData.moon_influence || '',
                magneticField: apiData.magnetic_field || 'Спокойное',
                precipitationChance: apiData.precipitation_chance || 0,
                hourlyTemperatures: apiData.hourly_temperatures || Array(24).fill(apiData.main.temp),
                sunrise: apiData.sys.sunrise ? new Date(apiData.sys.sunrise * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '',
                sunset: apiData.sys.sunset ? new Date(apiData.sys.sunset * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '',
                daylightDuration: apiData.daylight_duration || 'Не определено',
                weather: apiData.weather,
                sys: apiData.sys,
                main: apiData.main,
                name: apiData.name
            };

            setWeatherData(transformedData);
            setError(null);
        } catch (error: unknown) {
            const fetchError = error as FetchError;
            console.error('Ошибка при получении погоды:', fetchError);
            
            if (fetchError.response) {
                const errorMessage = fetchError.response.data?.error || 'Неизвестная ошибка';
                const errorDetails = fetchError.response.data?.details;
                setError(errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage);
            } else if (fetchError.code === 'ECONNABORTED') {
                setError('Превышено время ожидания запроса. Пожалуйста, попробуйте снова.');
            } else if (fetchError.message === 'Network Error') {
                setError('Ошибка сети. Проверьте подключение к интернету.');
            } else {
                setError('Не удалось получить данные о погоде. Пожалуйста, попробуйте позже.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedCity) {
            fetchWeather(selectedCity);
        }
    }, [selectedCity]);

    useEffect(() => {
        if (weatherData) {
            const calendarData: DayWeather[] = weatherData.forecast.map((day: Forecast) => ({
                date: day.date,
                temperature: parseFloat(day.temp),
                description: day.condition,
                icon: `https://openweathermap.org/img/wn/${day.condition.toLowerCase().includes('дождь') ? '10d' : 
                       day.condition.toLowerCase().includes('облач') ? '03d' :
                       day.condition.toLowerCase().includes('ясно') ? '01d' :
                       day.condition.toLowerCase().includes('снег') ? '13d' : '02d'}@2x.png`
            }));
            setMonthData(calendarData);
        }
    }, [weatherData]);

    useEffect(() => {
        if (weatherData?.sys) {
            const now = Date.now() / 1000;
            setIsDay(now > weatherData.sys.sunrise && now < weatherData.sys.sunset);
        }
    }, [weatherData]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        
        if (value.length >= 2) {
            const filtered = filterCities(value);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionSelect = (city: string) => {
        setSearchTerm(city);
        setSuggestions([]);
        setShowSuggestions(false);
        fetchWeather(city);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setShowSuggestions(false);
            fetchWeather(searchTerm);
        }
    };

    const getLocationWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(`${latitude},${longitude}`);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const getAirQualityColor = (value: number): string => {
        if (value <= 50) return 'green';
        if (value <= 100) return 'yellow';
        if (value <= 150) return 'orange';
        if (value <= 200) return 'red';
        return 'darkred';
    };

    const toggleTemperatureUnit = () => {
        setIsCelsius(!isCelsius);
    };

    const getTemperature = (temp: string): string => {
        const numTemp = parseFloat(temp);
        if (isNaN(numTemp)) return "0";
        return isCelsius ? roundTemperature(numTemp) : roundTemperature((numTemp * 9/5) + 32);
    };

    const handleDayClick = (date: string) => {
        const dayData = monthData.find(day => day.date === date);
        if (dayData) {
            console.log('Selected day weather:', dayData);
        }
    };

    const getWeatherType = (): 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' => {
        if (!weatherData?.weather?.[0]) return 'clear';
        
        const weatherId = weatherData.weather[0].id;
        const description = weatherData.weather[0].description.toLowerCase();
        
        // Проверяем снег
        if ((weatherId >= 600 && weatherId < 700) || description.includes('снег')) {
            return 'snow';
        }
        
        // Проверяем грозу
        if (weatherId >= 200 && weatherId < 300) {
            return 'thunderstorm';
        }
        
        // Проверяем дождь
        if ((weatherId >= 300 && weatherId < 600) || 
            description.includes('дождь') || 
            description.includes('ливень')) {
            return 'rain';
        }
        
        // Проверяем облачность
        if ((weatherId >= 801 && weatherId < 900) || 
            description.includes('облач') || 
            description.includes('пасмурно')) {
            return 'clouds';
        }
        
        // Если ничего не подошло, считаем что ясно
        return 'clear';
    };

    const checkDayTime = (): boolean => {
        if (!weatherData?.sys) return true;
        const now = Math.floor(Date.now() / 1000);
        return now >= weatherData.sys.sunrise && now <= weatherData.sys.sunset;
    };

    // Add click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.weather-search')) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="weather-container">
            <AnimatedWeather 
                weatherType={getWeatherType()}
                temperature={weatherData?.main?.temp || 0}
                isDay={checkDayTime()}
            />
            <nav className="weather-nav">
                <div className="nav-content">
                    <div className="weather-logo">
                        <img src={weatherLogo} alt="Weather Logo" />
                    </div>
                    <div className="weather-search">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                placeholder="Введите город"
                                value={searchTerm}
                                onChange={handleSearch}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            <button type="submit">ПОИСК</button>
                        </form>
                        <button className="geolocation-button" onClick={getLocationWeather}>
                            ИСПОЛЬЗОВАТЬ ГЕОЛОКАЦИЮ
                        </button>
                        <SearchSuggestions 
                            suggestions={suggestions}
                            onSelect={handleSuggestionSelect}
                            isVisible={showSuggestions}
                        />
                    </div>
                </div>
            </nav>

            <div className="weather-app">
                {error ? (
                    <div className="error-message">{error}</div>
                ) : isLoading ? (
                    <div className="loading">Загрузка...</div>
                ) : weatherData ? (
                    <Suspense fallback={<div className="loading">Загрузка компонентов...</div>}>
                        <div className="weather-content">
                            <div className="weather-main">
                                <div className="weather-current">
                                    <div className="weather-info">
                                        <span className="city-name">Погода в {weatherData.name}</span>
                                        <div className="temperature-block">
                                            <span className="temperature">{getTemperature(weatherData.temperature)}°</span>
                                            <div className="unit-toggle">
                                                <label>
                                                    <input 
                                                        type="radio" 
                                                        checked={isCelsius} 
                                                        onChange={toggleTemperatureUnit}
                                                    />
                                                    °C
                                                </label>
                                                <label>
                                                    <input 
                                                        type="radio" 
                                                        checked={!isCelsius} 
                                                        onChange={toggleTemperatureUnit}
                                                    />
                                                    °F
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="weather-details">
                                        <span>Ощущается как {getTemperature(weatherData.feelsLike)}°</span>
                                        <span>{weatherData.description}</span>
                                    </div>
                                    <div className="weather-info-details">
                                        <div className="info-item">
                                            <span className="icon wind-icon"></span>
                                            <span>{weatherData.wind} км/ч</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="icon humidity-icon"></span>
                                            <span>{weatherData.humidity}%</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="icon pressure-icon"></span>
                                            <span>{weatherData.pressure} мм рт. ст.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="weather-forecast">
                                    <h2>Прогноз на 14 дней</h2>
                                    <div className="forecast-list">
                                        {weatherData.forecast.map((day, index) => (
                                            <div key={index} className="forecast-item">
                                                <div className="forecast-day">{day.day}</div>
                                                <div className="forecast-date">{day.date}</div>
                                                <div className="forecast-temp">{getTemperature(day.temp)}°</div>
                                                <div className="forecast-condition">{day.condition}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="air-quality">
                                    <h2>Качество воздуха</h2>
                                    <div className="air-quality-grid">
                                        <div className="air-quality-item">
                                            <div>CO</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.co) }}>
                                                {weatherData.airQuality.co} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>NO2</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.no2) }}>
                                                {weatherData.airQuality.no2} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>O3</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.o3) }}>
                                                {weatherData.airQuality.o3} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>SO2</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.so2) }}>
                                                {weatherData.airQuality.so2} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>PM2.5</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.pm2_5) }}>
                                                {weatherData.airQuality.pm2_5} µg/m³
                                            </div>
                                        </div>
                                        <div className="air-quality-item">
                                            <div>PM10</div>
                                            <div style={{ color: getAirQualityColor(weatherData.airQuality.pm10) }}>
                                                {weatherData.airQuality.pm10} µg/m³
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <Daylight 
                            sunrise={weatherData.sunrise}
                            sunset={weatherData.sunset}
                            daylightDuration={weatherData.daylightDuration}
                            moonPhase={weatherData.moonPhase}
                            magneticField={weatherData.magneticField}
                            uvIndex={weatherData.uvIndex}
                        />
                        
                        <div className="temperature-chart">
                            <h2>График температуры</h2>
                            <TemperatureChart 
                                temperatures={weatherData.hourlyTemperatures}
                                labels={Array.from({length: 24}, (_, i) => `${i}:00`)}
                            />
                        </div>

                        <WeatherWidgets 
                            sunrise={weatherData.sunrise}
                            sunset={weatherData.sunset}
                            moonPhase={weatherData.moonPhase as MoonPhase}
                            windDirection={45}
                            temperature={parseFloat(weatherData.temperature)}
                        />

                        <ExtendedWeatherData 
                            temperature={parseFloat(weatherData.temperature)}
                            humidity={parseFloat(weatherData.humidity)}
                            pressure={parseFloat(weatherData.pressure)}
                            visibility={10}
                            windSpeed={parseFloat(weatherData.wind)}
                        />

                        <WeatherRecommendations 
                            temperature={parseFloat(weatherData.temperature)}
                            humidity={parseFloat(weatherData.humidity)}
                            windSpeed={parseFloat(weatherData.wind)}
                            uvIndex={weatherData.uvIndex}
                            precipitation={weatherData.precipitationChance}
                            pressure={parseFloat(weatherData.pressure)}
                        />

                        <WeatherCalendar 
                            monthData={monthData}
                            onDayClick={handleDayClick}
                        />

                        <WeatherEducation />
                    </Suspense>
                ) : null}
            </div>
        </div>
    );
};

export default Weather;
