export const transform_languages_data = (langs: []) => {
  const hash = {};
  langs.forEach((item) => {
    hash[item[0]] = item[1];
  });
  return hash;
};
