export const themes = {
  "red-raicing": {
    bgColor: "#5c0d0d",
    mainColor: "#d8d254",
    subColor: "#c8d543",
    text: "#d9d9d9",
  },
  dune: {
    bgColor: "#d1b192",
    mainColor: "#a05006",
    subColor: "#181409",
    text: "#101010",
  },
  ASOIAF: {
    bgColor: "#fdfdfd",
    mainColor: "#11b0dd",
    subColor: "#181409",
    text: "#101010",
  },
  "empire-of-silence": {
    bgColor: "#171716",
    mainColor: "#8b31bc",
    subColor: "#a83cbb",
    text: "#f8f8f8",
  },
  it: {
    bgColor: "#ececec",
    mainColor: "#e94735",
    subColor: "#d3662f",
    text: "#191717",
  },
  mistborn: {
    bgColor: "#171716",
    mainColor: "#d4c446",
    subColor: "#a38739",
    text: "#d9d9d9",
  },
  "ship-of-magic": {
    bgColor: "#88d2cc",
    mainColor: "#139654",
    subColor: "#094768",
    text: "#101010",
  },
  "name-of-wind": {
    bgColor: "#efeded",
    mainColor: "#bde145",
    subColor: "#aeb840",
    text: "#1e1d1d",
  },
  "jade-city": {
    bgColor: "#242222",
    mainColor: "#97b45a",
    subColor: "#67bf8a",
    text: "#FFFFFF",
  },
};

export const themeList = Object.keys(themes)
  .sort()
  .map((key) => {
    return {
      ...themes[key],
      name: key,
    };
  });
