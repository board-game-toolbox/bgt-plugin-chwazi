const COLOR_LIST = [
  "#F44336",
  "#2196F3",
  "#FFEB3B",
  "#00E676",
  "#AB47BC",
  "#EC407A",
  "#FF9800",
];

export function colorGenerator(): () => string {
  let index = Math.floor(Math.random() * COLOR_LIST.length);
  return () => {
    const color = COLOR_LIST[index];
    index = (index + 1) % COLOR_LIST.length;
    return color;
  };
}
