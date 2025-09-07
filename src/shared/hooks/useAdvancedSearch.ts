import { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useDebounce } from './useDebounce';

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: string[];
}

export interface SearchConfig {
  searchFields: string[];
  fuzzySearch?: boolean;
  threshold?: number;
  maxResults?: number;
}

export function useAdvancedSearch<T extends Record<string, any>>(
  items: T[],
  config: SearchConfig
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('advanced-search-recent', []);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  // Advanced search with fuzzy matching
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim() || items.length === 0) {
      return items.map(item => ({ item, score: 1, matches: [] }));
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    const searchWords = searchLower.split(/\s+/).filter(word => word.length > 0);
    
    const results: SearchResult<T>[] = items.map(item => {
      let totalScore = 0;
      let matches: string[] = [];
      
      config.searchFields.forEach(field => {
        const fieldValue = String(item[field] || '').toLowerCase();
        
        searchWords.forEach(word => {
          if (fieldValue.includes(word)) {
            // Exact match gets higher score
            const exactMatch = fieldValue === word;
            const startsWithMatch = fieldValue.startsWith(word);
            
            if (exactMatch) {
              totalScore += 10;
            } else if (startsWithMatch) {
              totalScore += 5;
            } else {
              totalScore += 2;
            }
            
            matches.push(field);
          } else if (config.fuzzySearch) {
            // Simple fuzzy matching - check if all characters are present
            const wordChars = word.split('');
            let fieldIndex = 0;
            let matchedChars = 0;
            
            for (const char of wordChars) {
              const charIndex = fieldValue.indexOf(char, fieldIndex);
              if (charIndex !== -1) {
                matchedChars++;
                fieldIndex = charIndex + 1;
              }
            }
            
            if (matchedChars === wordChars.length) {
              totalScore += 1;
              matches.push(field);
            }
          }
        });
      });
      
      return {
        item,
        score: totalScore,
        matches: [...new Set(matches)],
      };
    });

    // Filter and sort by score
    const threshold = config.threshold || 0;
    const filtered = results
      .filter(result => result.score > threshold)
      .sort((a, b) => b.score - a.score);

    return config.maxResults ? filtered.slice(0, config.maxResults) : filtered;
  }, [items, debouncedSearchTerm, config]);

  const addToRecentSearches = useCallback((term: string) => {
    if (!term.trim()) return;
    
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 10);
    setRecentSearches(updated);
  }, [recentSearches, setRecentSearches]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      addToRecentSearches(term);
    }
  }, [addToRecentSearches]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const highlightMatches = useCallback((text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSearch,
    clearSearch,
    searchResults,
    recentSearches,
    highlightMatches,
    isSearching: debouncedSearchTerm !== searchTerm,
  };
}