export async function apiClient(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
//   console.log(token)

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let msg = "Unexpected API error";
    try {
      const errorData = await res.json();
      msg = errorData.error || msg;
    } catch {}
	console.log("API ERROR:", msg)
    throw new Error(msg);
  }

  return res.json();
}
