"use client";

import { useEffect } from "react";
import { SnackbarProvider } from "notistack";
import { OrderProvider } from "../context/OrderContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isReload = e.key.toLowerCase() === "r";

      // Bloquea Cmd+R en Mac o Ctrl+R en Windows
      if (
        (isMac && e.metaKey && isReload) ||
        (!isMac && e.ctrlKey && isReload)
      ) {
        e.preventDefault();
        console.log("Recarga bloqueada");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <OrderProvider>{children}</OrderProvider>
    </SnackbarProvider>
  );
}
