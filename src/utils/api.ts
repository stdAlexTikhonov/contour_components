export const post = async (
  url: string = "https://stat.world/biportal/api.jsp",
  data: any
) => {
  const response = await fetch(url, {
    credentials: "same-origin", // параметр определяющий передвать ли разные сессионные данные вместе с запросом
    method: "POST", // метод POST
    body: JSON.stringify(data), // типа запрашиаемого документа
  });
  return response.json();
};

export const getData = async (data: any) =>
  await post(process.env.REACT_APP_BI_URL, data);
