type Response<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

const debug = true;
const baseURL = "http://localhost:5000/api";

export const request = async <T>(
  url: string,
  config?: {
    method?: "QUERY" | "GET" | "POST" | "PUT" | "DELETE";
    body?: string;
  }
) => {
  const response = await fetch(`${baseURL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    method: config?.method || "GET",
    body: config?.body,
  });

  if (response.ok) {
    const json = await response.json();
    if (debug) {
      console.log("REQUEST", config, `${url}`, "RESPONSE", json);
    }
    return json as Response<T>;
  } else {
    const text = await response.text();
    if (debug) {
      console.log("REQUEST", config, `${url}`, "RESPONSE", text);
    }
    return { ok: false, error: text };
  }
};
