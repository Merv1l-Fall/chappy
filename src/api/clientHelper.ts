export async function apiClient(path: string, options: RequestInit = {}, opts: { raw?: boolean } = {}) {
  const token = localStorage.getItem("token");

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
      const text = await res.text();
      const parsed = text ? JSON.parse(text) : null;
      msg = parsed?.error || parsed || msg;
    } catch {
      try {
        const text = await res.text();
        msg = text || msg;
      } catch {}
    }
    console.log("API ERROR:", msg);
    throw new Error(String(msg));
  }

  if (opts.raw) return res;
  
  try {
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}