import React from 'react';
import './SearchSuggestions.css';

interface SearchSuggestionsProps {
    suggestions: string[];
    onSelect: (city: string) => void;
    isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ 
    suggestions, 
    onSelect,
    isVisible 
}) => {
    if (!isVisible || suggestions.length === 0) return null;

    const handleSelect = (city: string) => {
        onSelect(city);
    };

    return (
        <ul className={`suggestions-list ${isVisible ? 'visible' : ''}`}>
            {suggestions.map((city, index) => (
                <li 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => handleSelect(city)}
                >
                    {city}
                </li>
            ))}
        </ul>
    );
};

export default SearchSuggestions; 