import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article, WeatherPhenomenon } from '../../types/education';
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

const WeatherEducation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('phenomena');
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // В будущем здесь будет загрузка данных с сервера
    loadMockData();
  }, []);

  const loadMockData = () => {
    setArticles([
      {
        id: '1',
        title: 'Как формируются облака',
        content: 'Подробное описание процесса формирования облаков и их классификация...',
        category: 'meteorology',
        difficulty: 'beginner',
        tags: ['облака', 'атмосфера', 'конденсация'],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
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
      // Остальные табы будут добавлены позже
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
        <img src={article.imageUrl} alt={article.title} className="article-image" />
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

export default WeatherEducation; 