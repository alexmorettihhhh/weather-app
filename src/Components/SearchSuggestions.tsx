import React from 'react';
import './SearchSuggestions.css';

interface SearchSuggestionsProps {
    suggestions: string[];
    onSelect: (city: string) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, onSelect }) => {
    if (suggestions.length === 0) return null;

    return (
        <ul className="suggestions-list">
            {suggestions.map((city, index) => (
                <li 
                    key={index} 
                    onClick={() => onSelect(city)}
                    className="suggestion-item"
                >
                    {city}
                </li>
            ))}
        </ul>
    );
};

export default SearchSuggestions; 