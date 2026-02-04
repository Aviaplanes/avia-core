"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function useLenis() {
  useEffect(() => {
    const isMobile = window.innerWidth < 768; // телефоны и маленькие экраны
    if (isMobile) return; // не инициализируем Lenis на мобильных

    const lenis = new Lenis({
      duration: 0,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1.8,
      touchMultiplier: 2.0,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}
