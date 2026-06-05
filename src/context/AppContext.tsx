import React, { createContext, useContext, useState, useEffect } from 'react';
import { Review, Snippet } from '../types';
import { initialReviews, initialSnippets } from '../lib/mockData';

interface AppContextType {
  reviews: Review[];
  snippets: Snippet[];
  addReview: (review: Review) => void;
  deleteReview: (id: string) => void;
  addSnippet: (snippet: Snippet) => void;
  updateSnippet: (snippet: Snippet) => void;
  deleteSnippet: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setSnippetToReview: (snippet: Snippet | null) => void;
  snippetToReview: Snippet | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [snippetToReview, setSnippetToReview] = useState<Snippet | null>(null);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addReview = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const addSnippet = (snippet: Snippet) => {
    setSnippets((prev) => [snippet, ...prev]);
  };

  const updateSnippet = (snippet: Snippet) => {
    setSnippets((prev) => prev.map((s) => (s.id === snippet.id ? snippet : s)));
  };

  const deleteSnippet = (id: string) => {
    setSnippets((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider
      value={{
        reviews,
        snippets,
        addReview,
        deleteReview,
        addSnippet,
        updateSnippet,
        deleteSnippet,
        theme,
        toggleTheme,
        snippetToReview,
        setSnippetToReview
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
