import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, WeatherPhenomenon, Quiz, InteractiveMaterial, KidsContent } from '../types/education';
import './WeatherEducation.css';

interface Tab {
    id: string;
    label: string;
    icon: string;
}

const tabs: Tab[] = [
    { id: 'articles', label: 'Статьи', icon: '📚' },
    { id: 'phenomena', label: 'Погодные явления', icon: '🌈' },
    { id: 'interactive', label: 'Интерактив', icon: '🎮' },
    { id: 'quizzes', label: 'Викторины', icon: '❓' },
    { id: 'kids', label: 'Детский раздел', icon: '🎨' },
    { id: 'facts', label: 'Интересные факты', icon: '💡' },
    { id: 'climate', label: 'Климат', icon: '🌍' },
];

// Моковые данные для примера
const weatherPhenomena: WeatherPhenomenon[] = [
    {
        id: '1',
        name: 'Гроза',
        description: 'Атмосферное явление с молниями и громом',
        explanation: 'Сложное атмосферное явление, при котором в кучево-дождевых облаках и между облаками и землей возникают электрические разряды — молнии, сопровождаемые громом.',
        causes: [
            'Возникает при столкновении теплого и холодного воздуха',
            'Молния может нагреть воздух до 30,000°C',
            'Гром - это звуковая волна от быстрого расширения воздуха',
            'Средняя продолжительность грозы - 30 минут'
        ],
        effects: [
            'Электрические разряды',
            'Сильные осадки',
            'Шквалистый ветер',
            'Возможный град'
        ]
    },
    {
        id: '2',
        name: 'Радуга',
        description: 'Оптическое явление в атмосфере',
        explanation: 'Оптическое явление, вызванное преломлением и отражением солнечного света в водяных каплях.',
        causes: [
            'Появляется при преломлении солнечного света в каплях воды',
            'Всегда имеет семь основных цветов',
            'Наблюдатель всегда видит свою уникальную радугу',
            'Радуга - это полный круг, но мы видим только его часть'
        ],
        effects: [
            'Визуальное разделение света на спектр',
            'Создание оптической иллюзии',
            'Формирование двойной радуги'
        ]
    }
];

// Обновляем моковые данные для статей
const mockArticles: Article[] = [
    {
        id: '1',
        title: 'Как формируются облака',
        content: 'Облака образуются, когда водяной пар в воздухе конденсируется в капли воды или кристаллы льда. Этот процесс происходит при охлаждении воздуха до точки росы. Существует несколько основных типов облаков: перистые, кучевые, слоистые и другие. Каждый тип формируется на определенной высоте и при определенных атмосферных условиях...',
        category: 'meteorology',
        difficulty: 'beginner',
        tags: ['облака', 'атмосфера', 'конденсация'],
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: '/images/clouds.jpg'
    },
    {
        id: '2',
        title: 'Влияние атмосферного давления на погоду',
        content: 'Атмосферное давление играет ключевую роль в формировании погодных условий. Области высокого и низкого давления определяют движение воздушных масс. Когда давление падает, это часто предвещает ухудшение погоды. Высокое давление обычно связано с ясной погодой. Резкие перепады давления могут вызывать головные боли у метеочувствительных людей...',
        category: 'meteorology',
        difficulty: 'intermediate',
        tags: ['давление', 'циклоны', 'антициклоны'],
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: '/images/pressure.jpg'
    },
    {
        id: '3',
        title: 'Как образуется ветер',
        content: 'Ветер возникает из-за разницы атмосферного давления между различными участками земной поверхности. Воздух всегда движется из области высокого давления в область низкого давления. На направление ветра влияет вращение Земли (сила Кориолиса), а на скорость - разница температур и рельеф местности...',
        category: 'meteorology',
        difficulty: 'beginner',
        tags: ['ветер', 'давление', 'циркуляция'],
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: '/images/wind.jpg'
    },
    {
        id: '4',
        title: 'Климатические зоны Земли',
        content: 'На Земле существует несколько основных климатических зон, каждая со своими уникальными характеристиками. От экваториального пояса до полярных регионов, климат определяется множеством факторов: широтой, океаническими течениями, рельефом и другими географическими особенностями...',
        category: 'climate',
        difficulty: 'intermediate',
        tags: ['климат', 'зоны', 'география'],
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: '/images/climate-zones.jpg'
    },
    {
        id: '5',
        title: 'Метеорологические приборы',
        content: 'Современная метеорология использует множество приборов для измерения различных параметров атмосферы. Барометр измеряет давление, анемометр - скорость ветра, гигрометр - влажность воздуха. Метеорологические спутники и радары позволяют получать данные о погоде в глобальном масштабе...',
        category: 'instruments',
        difficulty: 'intermediate',
        tags: ['приборы', 'измерения', 'технологии'],
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrl: '/images/instruments.jpg'
    }
];

interface QuizState {
    isActive: boolean;
    currentQuestion: number;
    selectedAnswer: number | null;
    showExplanation: boolean;
    score: number;
    timeLeft: number;
    isFinished: boolean;
}

// Добавляем новые викторины
const mockQuizzes: Quiz[] = [
    {
        id: '1',
        title: 'Основы метеорологии',
        description: 'Проверьте свои знания о базовых понятиях в метеорологии',
        difficulty: 'easy',
        category: 'meteorology',
        timeLimit: 600,
        questions: [
            {
                id: 'q1',
                question: 'Что такое атмосферное давление?',
                options: [
                    'Давление воздуха на поверхность Земли и все находящиеся на ней тела',
                    'Температура воздуха у поверхности Земли',
                    'Скорость движения воздушных масс',
                    'Количество водяного пара в воздухе'
                ],
                correctAnswer: 0,
                explanation: 'Атмосферное давление - это давление воздуха на поверхность Земли и находящиеся на ней тела. Оно создается весом воздушного столба.'
            },
            {
                id: 'q2',
                question: 'Какой прибор используется для измерения влажности воздуха?',
                options: [
                    'Термометр',
                    'Барометр',
                    'Гигрометр',
                    'Анемометр'
                ],
                correctAnswer: 2,
                explanation: 'Гигрометр - это прибор для измерения влажности воздуха. Он показывает количество водяного пара в воздухе.'
            },
            {
                id: 'q3',
                question: 'Как называется движение воздуха в горизонтальном направлении?',
                options: [
                    'Конвекция',
                    'Ветер',
                    'Турбулентность',
                    'Диффузия'
                ],
                correctAnswer: 1,
                explanation: 'Ветер - это движение воздуха в горизонтальном направлении, вызванное разницей атмосферного давления.'
            },
            {
                id: 'q4',
                question: 'Какое явление вызывает образование росы?',
                options: [
                    'Испарение воды',
                    'Конденсация водяного пара',
                    'Сублимация льда',
                    'Таяние снега'
                ],
                correctAnswer: 1,
                explanation: 'Роса образуется в результате конденсации водяного пара из воздуха на охлажденной поверхности.'
            },
            {
                id: 'q5',
                question: 'Что такое изобары на метеорологической карте?',
                options: [
                    'Линии равной температуры',
                    'Линии равного давления',
                    'Линии равной влажности',
                    'Линии равной высоты'
                ],
                correctAnswer: 1,
                explanation: 'Изобары - это линии на карте, соединяющие точки с одинаковым атмосферным давлением.'
            }
        ]
    },
    {
        id: '2',
        title: 'Погодные явления',
        description: 'Тест на знание различных погодных явлений',
        difficulty: 'medium',
        category: 'phenomena',
        timeLimit: 480,
        questions: [
            {
                id: 'q1',
                question: 'Какое условие необходимо для формирования радуги?',
                options: [
                    'Сильный ветер',
                    'Высокая влажность',
                    'Солнечный свет и капли воды в воздухе',
                    'Низкое атмосферное давление'
                ],
                correctAnswer: 2,
                explanation: 'Радуга образуется при преломлении и отражении солнечного света в каплях воды, находящихся в воздухе.'
            },
            {
                id: 'q2',
                question: 'Что является причиной грома?',
                options: [
                    'Столкновение облаков',
                    'Быстрое расширение воздуха от молнии',
                    'Сильный ветер',
                    'Изменение давления'
                ],
                correctAnswer: 1,
                explanation: 'Гром возникает из-за быстрого расширения воздуха, нагретого молнией до очень высокой температуры.'
            },
            {
                id: 'q3',
                question: 'Как образуется град?',
                options: [
                    'Замерзание дождевых капель в воздухе',
                    'Кристаллизация водяного пара',
                    'Многократное поднятие и опускание капель в грозовом облаке',
                    'Конденсация при низких температурах'
                ],
                correctAnswer: 2,
                explanation: 'Град образуется, когда капли воды многократно поднимаются и опускаются в грозовом облаке, постепенно наращивая слои льда.'
            },
            {
                id: 'q4',
                question: 'Какое явление называют "северным сиянием"?',
                options: [
                    'Отражение солнечного света от снега',
                    'Свечение атмосферы под воздействием солнечного ветра',
                    'Особый вид молнии',
                    'Отражение света от облаков'
                ],
                correctAnswer: 1,
                explanation: 'Северное сияние - это свечение верхних слоев атмосферы под воздействием заряженных частиц солнечного ветра.'
            },
            {
                id: 'q5',
                question: 'Что такое смерч?',
                options: [
                    'Сильный ветер',
                    'Вращающийся столб воздуха',
                    'Грозовое облако',
                    'Резкое похолодание'
                ],
                correctAnswer: 1,
                explanation: 'Смерч (торнадо) - это вращающийся столб воздуха, соединяющий облако с поверхностью земли или воды.'
            }
        ]
    },
    {
        id: '3',
        title: 'Климат и погода',
        description: 'Проверьте свои знания о климатических особенностях',
        difficulty: 'medium',
        category: 'climate',
        timeLimit: 540,
        questions: [
            {
                id: 'q1',
                question: 'Что определяет климат региона?',
                options: [
                    'Только температура воздуха',
                    'Комплекс метеорологических условий за длительный период',
                    'Количество осадков',
                    'Направление ветра'
                ],
                correctAnswer: 1,
                explanation: 'Климат определяется комплексом метеорологических условий, наблюдаемых в данной местности за многолетний период.'
            },
            {
                id: 'q2',
                question: 'Какой фактор не влияет на климат?',
                options: [
                    'Широта местности',
                    'Близость к океану',
                    'Цвет почвы',
                    'Высота над уровнем моря'
                ],
                correctAnswer: 2,
                explanation: 'Цвет почвы может влиять на локальную температуру, но не является значимым фактором формирования климата.'
            },
            {
                id: 'q3',
                question: 'Что такое континентальный климат?',
                options: [
                    'Климат с большими суточными колебаниями температуры',
                    'Климат с частыми дождями',
                    'Климат с постоянной температурой',
                    'Климат с сильными ветрами'
                ],
                correctAnswer: 0,
                explanation: 'Континентальный климат характеризуется большими колебаниями температуры и удаленностью от океана.'
            }
        ]
    },
    {
        id: '4',
        title: 'Атмосферные явления',
        description: 'Углубленный тест по атмосферным явлениям',
        difficulty: 'hard',
        category: 'phenomena',
        timeLimit: 720,
        questions: [
            {
                id: 'q1',
                question: 'Какое явление не относится к оптическим атмосферным явлениям?',
                options: [
                    'Мираж',
                    'Гало',
                    'Гром',
                    'Радуга'
                ],
                correctAnswer: 2,
                explanation: 'Гром - это акустическое явление, сопровождающее молнию, а не оптическое явление.'
            },
            {
                id: 'q2',
                question: 'При каком атмосферном явлении образуется воронка?',
                options: [
                    'Ураган',
                    'Смерч',
                    'Гроза',
                    'Метель'
                ],
                correctAnswer: 1,
                explanation: 'Смерч (торнадо) характеризуется образованием вращающейся воронки, соединяющей облако с поверхностью.'
            },
            {
                id: 'q3',
                question: 'Что такое "огни святого Эльма"?',
                options: [
                    'Свечение газов в атмосфере',
                    'Отражение солнечного света от облаков',
                    'Электрические разряды на заостренных предметах',
                    'Вид молнии'
                ],
                correctAnswer: 2,
                explanation: 'Огни святого Эльма - это светящиеся электрические разряды на заостренных предметах при большой напряженности электрического поля в атмосфере.'
            }
        ]
    }
];

const mockInteractiveMaterials: InteractiveMaterial[] = [
    {
        id: '1',
        title: 'Симулятор формирования облаков',
        type: 'simulation',
        content: 'Исследуйте процесс образования различных типов облаков в интерактивной модели. Узнайте, как температура и влажность влияют на формирование облаков разных видов - от перистых до кучевых.',
        instructions: [
            'Выберите начальную температуру воздуха в диапазоне от -10°C до +30°C',
            'Установите уровень влажности воздуха от 0% до 100%',
            'Наблюдайте за процессом конденсации и формированием облаков',
            'Экспериментируйте с разными условиями для создания различных типов облаков'
        ],
        ageGroup: 'teenager',
        requirements: ['Современный браузер с поддержкой WebGL', 'Стабильное интернет-соединение']
    },
    {
        id: '2',
        title: 'Эксперимент: Создание торнадо в бутылке',
        type: 'experiment',
        content: 'Создайте безопасную модель торнадо в домашних условиях. Этот эксперимент поможет понять принципы формирования вихревых потоков в атмосфере и механизм образования торнадо.',
        instructions: [
            'Наполните пластиковую бутылку водой, оставив немного воздуха',
            'Добавьте несколько капель пищевого красителя или блестки для лучшей визуализации',
            'Переверните бутылку вверх дном и создайте вращательное движение',
            'Наблюдайте за формированием воронки и обратите внимание на скорость вращения'
        ],
        ageGroup: 'children',
        requirements: [
            'Прозрачная пластиковая бутылка с крышкой',
            'Чистая вода комнатной температуры',
            'Пищевой краситель или блестки',
            'Помощь взрослых при проведении эксперимента'
        ]
    }
];

const mockKidsContent: KidsContent[] = [
    {
        id: '1',
        title: 'Приключения Капельки',
        description: 'Увлекательная история о путешествии капельки воды',
        content: 'Жила-была маленькая капелька воды, которая мечтала увидеть мир. Однажды солнышко пригрело её, и она поднялась высоко в небо, где познакомилась с облаками...',
        ageRange: [5, 8],
        type: 'story',
        difficulty: 'easy',
        imageUrl: '/images/clouds.jpg',
        parentGuidance: 'Обсудите с ребенком круговорот воды в природе'
    },
    {
        id: '2',
        title: 'Сделай свою радугу',
        description: 'Веселый эксперимент по созданию радуги дома',
        content: 'С помощью простых материалов мы создадим настоящую радугу! Этот эксперимент поможет понять, как образуется радуга в природе.',
        ageRange: [6, 10],
        type: 'experiment',
        difficulty: 'medium',
        materials: ['Миска с водой', 'Зеркало', 'Белый лист бумаги', 'Солнечный свет'],
        imageUrl: '/images/climate-zones.jpg'
    }
];

const mockFacts = [
    {
        id: '1',
        title: 'Молния',
        fact: 'Температура молнии может достигать 30,000°C, что в 5 раз горячее поверхности Солнца!',
        icon: '⚡'
    },
    {
        id: '2',
        title: 'Снежинки',
        fact: 'Каждая снежинка уникальна! Вероятность найти две одинаковые снежинки практически равна нулю.',
        icon: '❄️'
    },
    {
        id: '3',
        title: 'Ураганы',
        fact: 'Один ураган может выделить столько энергии, сколько выделяют 10,000 атомных бомб!',
        icon: '🌪️'
    }
];

const mockClimateZones = [
    {
        id: '1',
        name: 'Тропический климат',
        description: 'Характеризуется высокими температурами и обильными осадками круглый год',
        characteristics: [
            'Средняя температура выше 18°C',
            'Годовое количество осадков более 1500 мм',
            'Отсутствие выраженных сезонов'
        ],
        flora: ['Пальмы', 'Орхидеи', 'Лианы'],
        fauna: ['Туканы', 'Ягуары', 'Колибри'],
        icon: '🌴'
    },
    {
        id: '2',
        name: 'Умеренный климат',
        description: 'Четко выраженные сезоны с умеренными температурами',
        characteristics: [
            'Четыре сезона',
            'Средняя температура от -3°C до +22°C',
            'Равномерное распределение осадков'
        ],
        flora: ['Дубы', 'Клёны', 'Берёзы'],
        fauna: ['Лоси', 'Медведи', 'Волки'],
        icon: '🍁'
    }
];

const WeatherEducation: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('articles');
    const [articles, setArticles] = useState<Article[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [interactiveMaterials, setInteractiveMaterials] = useState<InteractiveMaterial[]>([]);
    const [kidsContent, setKidsContent] = useState<KidsContent[]>([]);

    useEffect(() => {
        loadMockData();
    }, []);

    const loadMockData = () => {
        setArticles(mockArticles);
        setQuizzes(mockQuizzes);
        setInteractiveMaterials(mockInteractiveMaterials);
        setKidsContent(mockKidsContent);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'phenomena':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="weather-phenomena"
                    >
                        {weatherPhenomena.map(phenomenon => (
                            <PhenomenonCard key={phenomenon.id} phenomenon={phenomenon} />
                        ))}
                    </motion.div>
                );
            case 'articles':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="education-articles"
                    >
                        {articles.map(article => (
                            <ArticleCard key={article.id} article={article} />
                        ))}
                    </motion.div>
                );
            case 'interactive':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="interactive-materials"
                    >
                        {interactiveMaterials.map(material => (
                            <InteractiveMaterialCard key={material.id} material={material} />
                        ))}
                    </motion.div>
                );
            case 'quizzes':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="education-quizzes"
                    >
                        {quizzes.map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </motion.div>
                );
            case 'kids':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="kids-content"
                    >
                        {kidsContent.map(content => (
                            <KidsContentCard key={content.id} content={content} />
                        ))}
                    </motion.div>
                );
            case 'facts':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="interesting-facts"
                    >
                        {mockFacts.map(fact => (
                            <FactCard key={fact.id} fact={fact} />
                        ))}
                    </motion.div>
                );
            case 'climate':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="climate-zones"
                    >
                        {mockClimateZones.map(zone => (
                            <ClimateZoneCard key={zone.id} zone={zone} />
                        ))}
                    </motion.div>
                );
            default:
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="coming-soon"
                    >
                        <h3>Этот раздел находится в разработке</h3>
                        <p>Скоро здесь появится интересный контент!</p>
                    </motion.div>
                );
        }
    };

    return (
        <div className="weather-education">
            <nav className="education-tabs">
                {tabs.map(tab => (
                    <motion.button
                        key={tab.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </motion.button>
                ))}
            </nav>

            <AnimatePresence mode="wait">
                {renderContent()}
            </AnimatePresence>

            <motion.div 
                className="education-footer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="scroll-top-button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    ↑ Наверх
                </motion.button>
            </motion.div>
        </div>
    );
};

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <motion.div
            className="article-card interactive-element"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {article.imageUrl && (
                <picture>
                    <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="article-image"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                </picture>
            )}
            <div className="article-content">
                <h3>{article.title}</h3>
                <div className="article-meta">
                    <span className="article-category">{article.category}</span>
                    <span className="article-difficulty">{article.difficulty}</span>
                </div>
                <p>{article.content.substring(0, 150)}...</p>
                <div className="article-tags">
                    {article.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

interface PhenomenonCardProps {
    phenomenon: WeatherPhenomenon;
}

const PhenomenonCard: React.FC<PhenomenonCardProps> = ({ phenomenon }) => {
    return (
        <motion.div
            className="phenomenon-card interactive-element"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {phenomenon.imageUrl && (
                <img src={phenomenon.imageUrl} alt={phenomenon.name} className="phenomenon-image" />
            )}
            <div className="phenomenon-content">
                <h3>{phenomenon.name}</h3>
                                <p className="phenomenon-description">{phenomenon.description}</p>
                <div className="phenomenon-details">
                    <h4>Причины:</h4>
                    <ul>
                        {phenomenon.causes.map((cause, index) => (
                            <li key={index}>{cause}</li>
                        ))}
                    </ul>
                    <h4>Эффекты:</h4>
                    <ul>
                        {phenomenon.effects.map((effect, index) => (
                            <li key={index}>{effect}</li>
                                    ))}
                                </ul>
                            </div>
            </div>
        </motion.div>
    );
};

interface InteractiveMaterialCardProps {
    material: InteractiveMaterial;
}

const InteractiveMaterialCard: React.FC<InteractiveMaterialCardProps> = ({ material }) => {
    return (
        <motion.div
            className="interactive-material-card interactive-element"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="material-content">
                <h3>{material.title}</h3>
                <span className="material-type">{material.type}</span>
                <p>{material.content}</p>
                <div className="material-instructions">
                    <h4>Инструкции:</h4>
                    <ol>
                        {material.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ol>
                </div>
                {material.requirements && (
                    <div className="material-requirements">
                        <h4>Требования:</h4>
                        <ul>
                            {material.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <span className="age-group">Возрастная группа: {material.ageGroup}</span>
            </div>
        </motion.div>
    );
};

interface QuizCardProps {
    quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
    const [state, setState] = useState<QuizState>({
        isActive: false,
        currentQuestion: 0,
        selectedAnswer: null,
        showExplanation: false,
        score: 0,
        timeLeft: quiz.timeLimit || 0,
        isFinished: false
    });

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (state.isActive && !state.isFinished && quiz.timeLimit) {
            const interval = setInterval(() => {
                setState(prev => {
                    if (prev.timeLeft <= 0) {
                        clearInterval(interval);
                        return { ...prev, isFinished: true };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);
            setTimer(interval);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [state.isActive, quiz.timeLimit]);

    const startQuiz = () => {
        setState({
            isActive: true,
            currentQuestion: 0,
            selectedAnswer: null,
            showExplanation: false,
            score: 0,
            timeLeft: quiz.timeLimit || 0,
            isFinished: false
        });
    };

    const exitQuiz = () => {
        if (timer) clearInterval(timer);
        setState({
            isActive: false,
            currentQuestion: 0,
            selectedAnswer: null,
            showExplanation: false,
            score: 0,
            timeLeft: quiz.timeLimit || 0,
            isFinished: false
        });
    };

    const handleAnswerSelect = (answerIndex: number) => {
        if (state.showExplanation) return;
        setState(prev => ({ ...prev, selectedAnswer: answerIndex }));
    };

    const checkAnswer = () => {
        const currentQ = quiz.questions[state.currentQuestion];
        if (state.selectedAnswer === currentQ.correctAnswer) {
            setState(prev => ({ ...prev, score: prev.score + 1 }));
        }
        setState(prev => ({ ...prev, showExplanation: true }));
    };

    const nextQuestion = () => {
        if (state.currentQuestion === quiz.questions.length - 1) {
            setState(prev => ({ ...prev, isFinished: true }));
            if (timer) clearInterval(timer);
        } else {
            setState(prev => ({
                ...prev,
                currentQuestion: prev.currentQuestion + 1,
                selectedAnswer: null,
                showExplanation: false
            }));
        }
    };

    const restartQuiz = () => {
        startQuiz();
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (!state.isActive) {
        return (
            <motion.div
                className="quiz-card interactive-element"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="quiz-content">
                    <h3>{quiz.title}</h3>
                    <p>{quiz.description}</p>
                    <div className="quiz-meta">
                        <span className="quiz-difficulty">{quiz.difficulty}</span>
                        <span className="quiz-category">{quiz.category}</span>
                        {quiz.timeLimit && (
                            <span className="quiz-time">
                                {Math.floor(quiz.timeLimit / 60)} мин
                            </span>
                        )}
                    </div>
                    <div className="quiz-preview">
                        <p>Количество вопросов: {quiz.questions.length}</p>
                        <button className="start-quiz-button" onClick={startQuiz}>
                            Начать викторину
                        </button>
                    </div>
                            </div>
            </motion.div>
        );
    }

    if (state.isFinished) {
        const percentage = (state.score / quiz.questions.length) * 100;
        let feedback = '';
        if (percentage >= 80) {
            feedback = 'Отличный результат! Вы настоящий эксперт!';
        } else if (percentage >= 60) {
            feedback = 'Хороший результат! Но есть куда расти.';
        } else {
            feedback = 'Попробуйте еще раз, чтобы улучшить свой результат.';
        }

        return (
            <motion.div
                className="quiz-active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="quiz-results">
                    <div className="quiz-score">{percentage}%</div>
                    <p className="quiz-feedback">{feedback}</p>
                    <p>Правильных ответов: {state.score} из {quiz.questions.length}</p>
                    <div className="quiz-final-buttons">
                        <button className="quiz-button quiz-restart" onClick={restartQuiz}>
                            Пройти еще раз
                        </button>
                        <button className="quiz-button quiz-exit" onClick={exitQuiz}>
                            Вернуться к списку
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    const currentQuestion = quiz.questions[state.currentQuestion];

    return (
        <motion.div
            className="quiz-active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="quiz-header">
                <h3>{quiz.title}</h3>
                <button className="quiz-button quiz-exit" onClick={exitQuiz}>
                    Выйти
                </button>
            </div>
            <div className="quiz-question">
                <h3>{currentQuestion.question}</h3>
                <div className="quiz-options">
                    {currentQuestion.options.map((option, index) => (
                        <motion.button
                            key={index}
                            className={`quiz-option ${state.selectedAnswer === index ? 'selected' : ''} ${
                                state.showExplanation
                                    ? index === currentQuestion.correctAnswer
                                        ? 'correct'
                                        : state.selectedAnswer === index
                                        ? 'incorrect'
                                        : ''
                                    : ''
                            }`}
                            onClick={() => handleAnswerSelect(index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={state.showExplanation}
                        >
                            {option}
                        </motion.button>
                    ))}
                </div>
                {state.showExplanation && (
                    <motion.div
                        className="quiz-explanation"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {currentQuestion.explanation}
                    </motion.div>
                )}
            </div>

            <div className="quiz-progress">
                <span>Вопрос {state.currentQuestion + 1} из {quiz.questions.length}</span>
                <div className="quiz-progress-bar">
                    <div
                        className="quiz-progress-fill"
                        style={{
                            width: `${((state.currentQuestion + 1) / quiz.questions.length) * 100}%`
                        }}
                    />
                </div>
                {quiz.timeLimit && (
                    <span className="quiz-timer">{formatTime(state.timeLeft)}</span>
                )}
            </div>

            <div className="quiz-controls">
                {!state.showExplanation ? (
                    <button
                        className="quiz-button"
                        onClick={checkAnswer}
                        disabled={state.selectedAnswer === null}
                    >
                        Проверить ответ
                    </button>
                ) : (
                    <button className="quiz-button" onClick={nextQuestion}>
                        {state.currentQuestion === quiz.questions.length - 1
                            ? 'Завершить'
                            : 'Следующий вопрос'}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

interface KidsContentCardProps {
    content: KidsContent;
}

const KidsContentCard: React.FC<KidsContentCardProps> = ({ content }) => {
    return (
        <motion.div
            className="kids-content-card interactive-element"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="kids-content-image-container">
                {content.imageUrl && (
                    <picture>
                        <img 
                            src={content.imageUrl} 
                            alt={content.title} 
                            className="kids-content-image"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    </picture>
                )}
            </div>
            <div className="kids-content-info">
                <h3>{content.title}</h3>
                <p className="kids-description">{content.description}</p>
                <div className="kids-content-meta">
                    <span className="age-range">
                        {content.ageRange[0]}-{content.ageRange[1]} лет
                    </span>
                    <span className="content-type">{content.type}</span>
                    <span className="content-difficulty">{content.difficulty}</span>
                </div>
                <p className="kids-content-text">{content.content}</p>
                {content.materials && (
                    <div className="materials-needed">
                        <h4>Необходимые материалы:</h4>
                        <ul>
                            {content.materials.map((material, index) => (
                                <li key={index}>{material}</li>
                            ))}
                        </ul>
                    </div>
                )}
                {content.parentGuidance && (
                    <div className="parent-guidance">
                        <h4>Для родителей:</h4>
                        <p>{content.parentGuidance}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

interface FactCardProps {
    fact: {
        id: string;
        title: string;
        fact: string;
        icon: string;
    };
}

const FactCard: React.FC<FactCardProps> = ({ fact }) => {
    return (
        <motion.div
            className="fact-card interactive-element"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <span className="fact-icon">{fact.icon}</span>
            <h3>{fact.title}</h3>
            <p>{fact.fact}</p>
        </motion.div>
    );
};

interface ClimateZoneCardProps {
    zone: {
        id: string;
        name: string;
        description: string;
        characteristics: string[];
        flora: string[];
        fauna: string[];
        icon: string;
    };
}

const ClimateZoneCard: React.FC<ClimateZoneCardProps> = ({ zone }) => {
    return (
        <motion.div
            className="climate-zone-card interactive-element"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="zone-header">
                <span className="zone-icon">{zone.icon}</span>
                <h3>{zone.name}</h3>
            </div>
            <p className="zone-description">{zone.description}</p>
            <div className="zone-details">
                <div className="characteristics">
                    <h4>Характеристики:</h4>
                    <ul>
                        {zone.characteristics.map((char, index) => (
                            <li key={index}>{char}</li>
                        ))}
                    </ul>
                </div>
                <div className="flora-fauna">
                    <div className="flora">
                        <h4>Флора:</h4>
                        <ul>
                            {zone.flora.map((plant, index) => (
                                <li key={index}>{plant}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="fauna">
                        <h4>Фауна:</h4>
                        <ul>
                            {zone.fauna.map((animal, index) => (
                                <li key={index}>{animal}</li>
                            ))}
                        </ul>
                    </div>
            </div>
        </div>
        </motion.div>
    );
};

export default WeatherEducation; 