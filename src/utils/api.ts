import { DataForQuery, Login, Register, ApiTypes } from "./types";
import { LOGIN, REGISTER_USER, LANGUAGES } from "./constants";

export const post = async (
  url: string = "https://stat.world/biportal/api.jsp",
  data: ApiTypes
) => {
  const response = await fetch(url, {
    credentials: "same-origin", // параметр определяющий передвать ли разные сессионные данные вместе с запросом
    method: "POST", // метод POST
    body: JSON.stringify(data), // типа запрашиаемого документа
  });
  return response.json();
};

export const getData = async (data: DataForQuery) =>
  await post(process.env.REACT_APP_BI_URL, data);

//Working with session
export const saveSession = (session: string) =>
  localStorage.setItem("session", session);

export const removeSession = () => localStorage.removeItem("session");

export const getSession = () =>
  Promise.resolve(localStorage.getItem("session"));

//Working with user
export const userRegister = (data: Register) =>
  post(process.env.REACT_APP_BI_URL, {
    method: REGISTER_USER,
    ...data,
  });

export const userLogin = (data: Login) =>
  post(process.env.REACT_APP_BI_URL, {
    method: LOGIN,
    ...data,
  });

//Working with languages
export const getLanguages = (session: string) =>
  post(process.env.REACT_APP_BI_URL, {
    method: LANGUAGES,
    session,
  });
