import { useState, useEffect } from "react";

export function usePersistentState(key, initialValue, ttl = null) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;

      const { value, expiry } = JSON.parse(item);

      // If there is an expiration time and it's expired, return initialValue and clear storage
      if (ttl && expiry && Date.now() > expiry) {
        localStorage.removeItem(key);
        return initialValue;
      }

      return value;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      const expiry = ttl ? Date.now() + ttl : null; // Set expiry if TTL is provided
      const storedData = JSON.stringify({ value: state, expiry });
      localStorage.setItem(key, storedData);
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, state, ttl]);

  return [state, setState];
}
