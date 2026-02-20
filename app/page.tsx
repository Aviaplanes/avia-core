import { headers } from "next/headers";
import ClientPage from "./HomePage";

function isMobileDevice(userAgent: string): boolean {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
}

export default async function Page() {
  // Вызываем серверные функции безопасно!
  const headersList = await headers(); 
  const userAgent = headersList.get("user-agent") || "";
  const initialIsMobile = isMobileDevice(userAgent);

  // Рендерим твой клиентский код, передавая ему знание об устройстве
  return <ClientPage initialIsMobile={initialIsMobile} />;
}