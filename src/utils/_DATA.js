import { isNull } from "util";

let users = {
  sarah_edo: {
    id: "sarah_edo",
    name: "Sarah Drasner",
    avatarURL: "https://tylermcginnis.com/would-you-rather/sarah.jpg",
    tweets: [
      "8xf0y6ziyjabvozdd253nd",
      "hbsc73kzqi75rg7v1e0i6a",
      "2mb6re13q842wu8n106bhk",
      "6h5ims9iks66d4m7kqizmv",
      "3sklxkf9yyfowrf0o1ftbb",
    ],
  },
  tylermcginnis: {
    id: "tylermcginnis",
    name: "Tyler McGinnis",
    avatarURL: "https://tylermcginnis.com/would-you-rather/tyler.jpg",
    tweets: [
      "5c9qojr2d1738zlx09afby",
      "f4xzgapq7mu783k9t02ghx",
      "nnvkjqoevs8t02lzcc0ky",
      "4pt0px8l0l9g6y69ylivti",
      "fap8sdxppna8oabnxljzcv",
      "leqp4lzfox7cqvsgdj0e7",
      "26p5pskqi88i58qmza2gid",
      "xi3ca2jcfvpa0i3t4m7ag",
    ],
  },
  dan_abramov: {
    id: "dan_abramov",
    name: "Dan Abramov",
    avatarURL: "https://tylermcginnis.com/would-you-rather/dan.jpg",
    tweets: [
      "5w6k1n34dkp1x29cuzn2zn",
      "czpa59mg577x1oo45cup0d",
      "omdbjl68fxact38hk7ypy6",
      "3km0v4hf1ps92ajf4z2ytg",
      "njv20mq7jsxa6bgsqc97",
      "sfljgka8pfddbcer8nuxv",
      "r0xu2v1qrxa6ygtvf2rkjw",
    ],
  },
};

let filtersOld = {
  0: {
    parentId: null,
    childId: 1,
    items: [
      { val: 1, children: [0, 1, 2], checked: true },
      { val: 2, children: [3, 4, 5], checked: false },
      { val: 3, children: [6, 7, 8], checked: false },
    ],
  },
  1: {
    parentId: 0,
    childId: 2,
    items: [
      { val: "1.1", children: [0, 1], checked: true },
      { val: "1.2", children: [2, 3], checked: false },
      { val: "1.3", children: [4, 5], checked: false },
      { val: "2.1", children: [6, 7], checked: false },
      { val: "2.2", children: [8, 9], checked: false },
      { val: "2.3", children: [10, 11], checked: false },
      { val: "3.1", children: [12, 13], checked: false },
      { val: "3.2", children: [14, 15], checked: false },
      { val: "3.3", children: [16, 17], checked: false },
    ],
  },
  2: {
    parentId: 1,
    items: [
      { val: "1.1.1", checked: false },
      { val: "1.1.2", checked: false },
      { val: "1.2.1", checked: false },
      { val: "1.2.2", checked: false },
      { val: "1.3.1", checked: false },
      { val: "1.3.2", checked: false },
      { val: "2.1.1", checked: false },
      { val: "2.1.2", checked: false },
      { val: "2.2.1", checked: false },
      { val: "2.2.2", checked: false },
      { val: "2.3.1", checked: false },
      { val: "2.3.2", checked: false },
      { val: "3.1.1", checked: false },
      { val: "3.1.2", checked: false },
      { val: "3.2.1", checked: false },
      { val: "3.2.2", checked: false },
      { val: "3.3.1", checked: false },
      { val: "3.3.2", checked: false },
    ],
  },
};

let filters = [
  {
    Caption: "Area Type",
    code: "area_type",
    child_nodes: ["Code", "continent"],
  },
  { Caption: "Century", code: "_select", child_nodes: ["dt1"] },
  { Caption: "Continent", code: "continent" },
  { Caption: "Country", code: "Code" },
  { Caption: "Month", code: "dt2" },
  { Caption: "Year", code: "dt1", child_nodes: ["dt2"] },
];

let filters2 = {
  type: {
    captions: [
      "Простейшие",
      "Губки",
      "Кишечнополостные",
      "Черви",
      "Моллюски",
      "Членистоногие",
      "Хордовые",
    ],
  },
  class: {
    captions: [
      "Ракообразные",
      "Паукообразные",
      "Насекомые",
      "Млекопитающие",
      "Птицы",
      "Пресмыкающиеся",
      "Земноводные",
      "Рыбы",
    ],
  },
  order: {
    captions: [
      "Насекомоядные",
      "Рукокрылые",
      "Грызуны",
      "Хищные",
      "Китообразные",
      "Парнокопытные",
      "Хоботные",
      "Приматы",
    ],
  },
  family: {
    captions: [
      "Зайчьи",
      "Беличьи",
      "Мышиные",
      "Кошачьи",
      "Псовые",
      "Медвежьи",
      "Куньи",
    ],
  },
  genus: {
    captions: ["Заяц", "Кролик", "Собака", "Лисица"],
  },
  species: {
    captions: ["Заяц-Беляк", "Заяц-Русак", "Волк", "Шакал", "Песец"],
  },
};

export function _getUsers() {
  return new Promise((res, rej) => {
    setTimeout(() => res({ ...users }), 1000);
  });
}

export function _getFilters() {
  return new Promise((res, rej) => {
    setTimeout(() => res(filters), 1000);
  });
}

export function _getFilterById(id) {
  return new Promise((res, rej) => {
    setTimeout(() => res(filters[id]), 1000);
  });
}
