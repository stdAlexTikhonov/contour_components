import { DataForQuery, Login, Register, ApiTypes } from "./types";
import { LOGIN, REGISTER_USER, LANGUAGES, BASE_URL } from "./constants";
import hash from "object-hash";
import {
  _getFilters,
  _getFilterById,
  _setFilter,
  _getFullHierarchy,
  _saveServerData,
  _getServerData,
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
  /*
  const query_hash = hash(data);
  const check_data = await _getServerData(query_hash);
  if (check_data) return check_data;
  */
  const res = await post(BASE_URL, data);

  /*
  _saveServerData({ id: query_hash, data: res });
  */
  return res;
};

export const getFilters = async () => await _getFilters();

export const getFullHierarchy = async () => await _getFullHierarchy();

export const getFilterByCode = async (code: string) =>
  await _getFilterById(code);

export const setFiltersOnServer = (code: string, filters: string) =>
  _setFilter(code, filters);

//Working with session
export const saveSession = (data: any) =>
  localStorage.setItem("user", JSON.stringify(data));

export const removeSession = () => localStorage.removeItem("user");

export const getSession = async () => {
  const user = localStorage.getItem("user");
  const { session, first_name, last_name, name, email } = user
    ? JSON.parse(user)
    : {
        session: null,
        first_name: null,
        last_name: null,
        name: null,
        email: null,
      };

  const guest = {
    user: "guest",
    password: "guest",
  };

  const data = await userLogin(guest);

  return {
    session: session ? session : data.session,
    logged_in: session ? true : false,
    name,
    first_name,
    last_name,
    email,
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
