export const createLinearScale = (domainMin, domainMax, rangeMin, rangeMax) => {
  const domainSpan = domainMax - domainMin || 1;
  const rangeSpan = rangeMax - rangeMin;
  return (value) => {
    return rangeMin + ((value - domainMin) / domainSpan) * rangeSpan;
  };
};

export const createTimeScale = (dates, rangeMin, rangeMax) => {
  if (dates.length === 0) return () => rangeMin;
  const minTime = Math.min(...dates.map((d) => d.getTime()));
  const maxTime = Math.max(...dates.map((d) => d.getTime()));
  const timeSpan = maxTime - minTime || 1;
  const rangeSpan = rangeMax - rangeMin;
  return (date) => {
    return rangeMin + ((date.getTime() - minTime) / timeSpan) * rangeSpan;
  };
};

export const getValueBounds = (values, bufferPercent = 0.1) => {
  if (values.length === 0) return { min: 0, max: 100 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || Math.abs(max) * 0.2 || 10;
  return {
    min: min - range * bufferPercent,
    max: max + range * bufferPercent,
  };
};

export const generateTicks = (min, max, count = 5) => {
  const range = max - min;
  const step = range / (count - 1);
  return Array.from({ length: count }, (_, i) => min + step * i);
};

export const generateDateTicks = (dates, count = 6) => {
  if (dates.length <= count) return dates;
  const step = Math.floor(dates.length / (count - 1));
  const ticks = [];
  for (let i = 0; i < count - 1; i++) {
    ticks.push(dates[i * step]);
  }
  ticks.push(dates[dates.length - 1]);
  return ticks;
};
