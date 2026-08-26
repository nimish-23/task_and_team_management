import { useState, useEffect } from 'react';

/**
 * A custom hook to debounce rapidly changing values (like search inputs).
 * Demonstrates the "Custom Hooks" requirement for the assessment.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
