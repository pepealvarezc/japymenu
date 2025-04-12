"use client";

import { SnackbarProvider } from "notistack";
import { OrderProvider } from "../context/OrderContext";

export default function Providers({ children }: { children: React.ReactNode }) {
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
