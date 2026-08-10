// lib/context/ResellerContext.js
"use client"
import { createContext, useContext, useEffect, useState } from "react";

const ResellerContext = createContext();

export function ResellerProvider({ children }) {
  const [resellerCode, setResellerCode] = useState(null); // null = determining, "" = system reseller

  useEffect(() => {
    const url = new URL(window.location.href);
    const urlCode = url.searchParams.get("resellerCode");
    const storedCode = localStorage.getItem("resellerCode");

    if (urlCode) {
      // URL param takes priority - always update if present
      if (!storedCode || storedCode !== urlCode) {
        // New code or different code detected
        localStorage.setItem("resellerCode", urlCode);
      }
      setResellerCode(urlCode);
    } else if (storedCode) {
      // Fall back to stored (no URL param)
      setResellerCode(storedCode);
    } else {
      // No code found → system reseller
      setResellerCode("");
    }
  }, []);

  return (
    <ResellerContext.Provider value={{ resellerCode, isLoaded: resellerCode !== null }}>
      {children}
    </ResellerContext.Provider>
  );
}

export function useResellerCode() {
  const context = useContext(ResellerContext);
  if (!context) {
    throw new Error("useResellerCode must be used within ResellerProvider");
  }
  return context;
}