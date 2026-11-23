import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay);
    // cleanup: tiap `value` berubah sebelum 400ms, timer lama dibatalkan
    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}