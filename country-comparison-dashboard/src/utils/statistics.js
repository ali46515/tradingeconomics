export const calculateStatistics = (data) => {
  const grouped = {};

  data.forEach((point) => {
    if (point.value !== null) {
      if (!grouped[point.country]) grouped[point.country] = [];
      grouped[point.country].push(point.value);
    }
  });

  return Object.entries(grouped).map(([country, values]) => {
    const first = values[0] || 0;
    const last = values[values.length - 1] || 0;
    const growth = first !== 0 ? ((last - first) / Math.abs(first)) * 100 : 0;

    return {
      country,
      mean: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      latest: last,
      growth: Math.round(growth * 10) / 10,
      count: values.length,
    };
  });
};
