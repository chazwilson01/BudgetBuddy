// usePersistentState.js - Custom hook for persistent state
import { useState, useEffect } from 'react';

export function usePersistentState(key, initialValue) {
  // Create state based on persisted value or initial value
  const [state, setState] = useState(() => {
    try {
      // Get from localStorage by key
      const item = localStorage.getItem(key);
      // Parse stored json or return initialValue if null
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      // Convert state to JSON and save to localStorage
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}