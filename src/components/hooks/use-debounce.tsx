import { useEffect, useState } from "react";

type useDebounceType = <T>(value: T, delay: number) => T;

export const useDebounce: useDebounceType = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
