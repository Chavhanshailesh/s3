// eslint-disable-next-line import/prefer-default-export
export function countriesToMap(countries) {
  return Object.entries(countries).reduce(
    (finalList, [code, country]) => ({
      ...finalList,
      [`countries.${code}`]: country,
    }),
    {}
  );
}
