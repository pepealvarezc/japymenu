"use client";

import Logo from "@/app/assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LogoComponent() {
  const router = useRouter();

  return (
    <Image src={Logo} alt="logo" width={100} onClick={() => router.push("/")} />
  );
}
