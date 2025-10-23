const BASE_URL = "http://localhost:5000";

export const request = async (
  url,
  method,
  headers = {},
  body = {},
  isNotStringified = false
) => {
  let res;
  let data;

  try {
    switch (method) {
      case "GET":
        res = await fetch(BASE_URL + url, { headers });
        if (res.status === 401) throw new Error("UNAUTHORIZED");
        if (res.status !== 200 && res.status !== 201) throw new Error("ERROR");
        data = await res.json();
        return data;

      case "POST":
        if (isNotStringified) {
          res = await fetch(BASE_URL + url, { headers, method, body });
        } else {
          res = await fetch(BASE_URL + url, {
            headers: {
              "Content-Type": "application/json",
              ...headers,
            },
            method,
            body: JSON.stringify(body),
          });
        }
        if (res.status === 401) throw new Error("UNAUTHORIZED");
        if (res.status !== 200 && res.status !== 201) throw new Error("ERROR");
        data = await res.json();
        return data;

      case "PUT":
        res = await fetch(BASE_URL + url, {
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          method,
          body: JSON.stringify(body),
        });
        if (res.status === 401) throw new Error("UNAUTHORIZED");
        if (res.status !== 200 && res.status !== 201) throw new Error("ERROR");
        data = await res.json();
        return data;

      case "DELETE":
        res = await fetch(BASE_URL + url, { headers, method });
        if (res.status === 401) throw new Error("UNAUTHORIZED");
        if (res.status !== 200 && res.status !== 201) throw new Error("ERROR");
        data = await res.json();
        return data;
      default:
        return;
    }
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
};
