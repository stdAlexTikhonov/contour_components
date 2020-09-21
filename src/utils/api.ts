import { DataForQuery, Login, Register, ApiTypes } from "./types";
import { LOGIN, REGISTER_USER, LANGUAGES, BASE_URL } from "./constants";
import {
  _getFilters,
  _getFilterById,
  _setFilter,
  _getFullHierarchy,
} from "./_DATA.js";

export const post = async (url: string = BASE_URL, data: ApiTypes) => {
  const response = await fetch(url, {
    credentials: "same-origin", // параметр определяющий передвать ли разные сессионные данные вместе с запросом
    method: "POST", // метод POST
    body: JSON.stringify(data), // типа запрашиаемого документа
  });
  return response.json();
};

export const getData = async (data: DataForQuery) => {
  if (data.p_folder) data.folder = data.p_folder;
  return await post(BASE_URL, data);
};

export const getFilters = async () => await _getFilters();

export const getFullHierarchy = async () => await _getFullHierarchy();

export const getFilterByCode = async (code: string) =>
  await _getFilterById(code);

export const setFiltersOnServer = (code: string, filters: string) =>
  _setFilter(code, filters);

//Working with session
export const saveSession = (session: string) =>
  localStorage.setItem("user", JSON.stringify({ session }));

export const removeSession = () => localStorage.removeItem("user");

export const getSession = async () => {
  const user = localStorage.getItem("user");
  const { session } = user ? JSON.parse(user) : { session: null };

  const guest = {
    user: "guest",
    password: "guest",
  };

  const data = await userLogin(guest);

  return {
    session: session ? session : data.session,
    logged_in: session ? true : false,
  };
};

//Working with language
export const saveLanguage = (language: string) =>
  localStorage.setItem("language", language);

export const getLanguage = () => localStorage.getItem("language");

//Working with user
export const userRegister = (data: Register) =>
  post(BASE_URL, {
    method: REGISTER_USER,
    ...data,
  });

export const userLogin = (data: Login) =>
  post(BASE_URL, {
    method: LOGIN,
    ...data,
  });

//Working with languages
export const getLanguages = (session: string) =>
  post(BASE_URL, {
    method: LANGUAGES,
    session,
  });
