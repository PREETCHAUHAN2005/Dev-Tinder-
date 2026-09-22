export const Base_Url =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:7777");

export const Socket_Url = import.meta.env.PROD ? undefined : Base_Url;
