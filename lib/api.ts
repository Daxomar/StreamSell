const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    credentials: "include",   // send the BetterAuth session cookie
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Session expired / not logged in → redirect to login
// in lib/api.ts, replace the existing 401 block with:
if (res.status === 401) {
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
    window.location.href = "/auth/login"
  }
  throw new Error("Not authenticated")
}

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}