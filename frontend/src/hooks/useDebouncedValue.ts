import { useEffect, useState } from 'react';

/** `value`, once it has stopped changing for `delay` milliseconds. */
export default function useDebouncedValue<T>(value: T, delay: number): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSettled(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return settled;
}
