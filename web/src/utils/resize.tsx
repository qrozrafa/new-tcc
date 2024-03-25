import { useState, useEffect } from 'react';

export function useScreenSize(size = 768, greaterThan = false) {
  const [isLessThanSize, setIsLessThanSize] = useState(false);

  useEffect(() => {
    function onResize() {
      if (!greaterThan) {
        if (window.innerWidth < size) {
          setIsLessThanSize(true);
        } else {
          setIsLessThanSize(false);
        }
      } else {
        if (window.innerWidth > size) {
          setIsLessThanSize(true);
        } else {
          setIsLessThanSize(false);
        }
      }
    }

    window.addEventListener('resize', onResize);
    onResize();

    return () => window.removeEventListener('resize', onResize);
  }, [size]);

  return isLessThanSize;
}

export default useScreenSize;
