export const arrContinent = [
  "Europe",
  "Asia",
  "Africa",
  "South America",
  "North America",
  "Oceania",
];

export const continentToIdx = (continent) => {
  return arrContinent.findIndex(
    (cont) => cont.toLowerCase() === continent.toLowerCase()
  );
};

export const idxToContinent = (idx) => {
  return arrContinent[Number(idx)];
};
