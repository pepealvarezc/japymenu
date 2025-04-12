// app/layout.tsx (o RootLayout)
import { CssBaseline, Container } from "@mui/material";
import { Inter } from "next/font/google";
import Logo from "@/app/assets/logo.png";
import Image from "next/image";
import Providers from "./providers/Providers"; // 👈 Nuevo
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JapyMenu",
  description: "App para registrar pedidos en línea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
          <Providers>
            <Image src={Logo} alt="logo" width={100} />
            <CssBaseline />
            {children}
          </Providers>
        </Container>
      </body>
    </html>
  );
}
