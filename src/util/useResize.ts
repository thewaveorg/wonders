import React, { useEffect, useState } from "react";

export const useResize = (ref: React.MutableRefObject<any>) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  
  const handleResize = () => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }
  
  useEffect(() => {
    ref.current && ref.current.addEventListener('resize', handleResize);
  
    return () => {
      ref.current.removeEventListener('resize', handleResize);
    }
  }, [ref]);
  
  return { width, height };
}