"use client";

import { useEffect, useRef, useState } from "react";
import { headers } from "next/headers";

import Background from "@/components/panel/Background";
import Image from "next/image";
import useLenis from "@/hooks/useLenis";
import Socials from "@/components/Socials";
import GlassAudioPlayer from "@/components/audio-player/GlassAudioPlayer";
import Marquee from "@/components/Marquee";

const songs = [
  {
    id: "0",
    title: "гиблое эго",
    artist: "VELIAL SQUAD",
    src: "/music/гиблое эго.flac",
    cover: "/music/images/гиблое эго.png",
  },
  {
    id: "1",
    title: "GRAVELAND (prod. shawtyglock x blayze)",
    artist: "VELIAL SQUAD",
    src: "/music/VELIAL SQUAD - GRAVELAND.flac",
    cover: "/music/images/VELIAL SQUAD - GRAVELAND.webp",
  },
  {
    id: "2",
    title: "Creepers",
    artist: "VELIAL SQUAD",
    src: "/music/VELIAL SQUAD - CREEPERS.mpeg",
    cover: "/music/images/VELIAL SQUAD - CREEPERS.jpg",
  },
  {
    id: "3",
    title: "what else can you ask for",
    artist: "IVOXYGEN",
    src: "/music/IVOXYGEN - what else can you ask for.flac",
    cover: "/music/images/IVOXYGEN - what else can you ask for.jpg",
  },
  {
    id: "4",
    title: "Headlock",
    artist: "Imogen Heap",
    src: "/music/Imogen Heap - Headlock.flac",
    cover: "/music/images/Imogen Heap - Headlock.jpg",
  },
  {
    id: "5",
    title: "Вампирский щит",
    artist: "VELIAL SQUAD",
    src: "/music/VELIAL SQUAD - Вампирский щит.mp3",
    cover: "/music/images/vampire.jpg",
  },
  {
    id: "6",
    title: "Черная река",
    artist: "VELIAL SQUAD",
    src: "/music/Черная_Река_ft_Trantor_p_shawtyglock.mp3",
    cover: "/music/images/reka.png",
  },
  {
    id: "7",
    title: "ATRA PLAGUE",
    artist: "VELIAL SQUAD",
    src: "/music/ATRA PLAGUE [p. shawtyglock x Yung Meep]   VELIAL SQUAD.mp3",
    cover: "/music/images/d3ff548ecce04776e30c95a93cc342a9.webp",
  },
];

function isMobileDevice(userAgent: string): boolean {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent.toLowerCase()
  );
}

export default function Home() {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const initialIsMobile = isMobileDevice(userAgent);

  useLenis();

  const parallaxRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const greetingRef = useRef<HTMLHeadingElement>(null);

  const [scale, setScale] = useState(1);
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const handleScroll = () => {
      const imageRect = imageContainerRef.current?.getBoundingClientRect();
      if (!imageRect) return;

      const startDistance = 35;
      const maxDistance = 1000;
      const maxBlur = 11;
      const minScale = 0.7;
      const minBrightness = 0.01;

      const distanceFromStart =
        window.scrollY - (imageRect.top + window.scrollY - startDistance);
      const progress = Math.min(
        Math.max(distanceFromStart / maxDistance, 0),
        1,
      );

      setScale(1 - (1 - minScale) * progress);
      setBlur(progress * maxBlur);
      setBrightness(1 - (1 - minBrightness) * progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Background initialIsMobile={initialIsMobile}/>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0, 0, 0, 0)",
          zIndex: -100,
          pointerEvents: "none",
        }}
      />

      <div className="relative">
        <div
          ref={parallaxRef}
          className="transition-transform duration-300 ease-out will-change-transform,filter"
          style={{
            transform: `scale(${scale})`,
            filter: `blur(${blur}px) brightness(${brightness})`,
            transformOrigin: "center top",
          }}
        >
          <div
            ref={titleRef}
            className="mb-[3rem] text-center"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
            }}
          >

            <h1
              className="mt-10 sm:mt-16 lg:mt-[2%] text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold whitespace-nowrap bg-clip-text text-transparent
              bg-gradient-to-r from-[#fcfcfc] via-[#fafafa] to-[#181818] bg-[length:300%_auto] drop-shadow-[0_0_30px_rgba(229,229,229,0.6)]
              animate-gradientFlow pb-2"
              style={{
                fontFamily: 'ui-title-bold, sans-serif'
              }}
            >
              1000yearsofwrath
            </h1>

           
          </div>

          <div
            ref={imageContainerRef}
            className="w-[160px] h-[160px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] mx-auto relative mb-8"
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "scale(1)" : "scale(0.8)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: "0.2s",
            }}
          >
            <div
              className="absolute inset-0 z-10 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(10,10,10,0) 80%, var(--bg-primary) 100%)",
              }}
            />

            <div className="absolute inset-0 rounded-full overflow-hidden">
              <Image
                src="/images/i.webp"
                alt="000"
                fill
                className="object-cover rounded-full"
                style={{
                  filter: "brightness(1.05)",
                  backgroundColor: "transparent",
                }}
                loading="eager"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzc3IiBoZWlnaHQ9IjM3NyIgdmlld0JveD0iMCAwIDM3NyAzNzciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
                onLoad={() => setIsLoaded(true)}
              />
            </div>

            <div
              className="absolute inset-0 z-5 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
                mixBlendMode: "overlay",
              }}
            />

            <div
              className="absolute top-2 left-0 right-0 z-20 text-center opacity-20"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "10px",
                letterSpacing: "1px",
              }}
            >
              <div className="mb-1">✧･ﾟ: *✧･ﾟ:* *:･ﾟ✧*:･ﾟ✧</div>
            </div>
          </div>

          <h2
            ref={greetingRef}
            className="text-base sm:text-lg md:text-xl text-center mt-6 sm:mt-8 md:mt-10 mb-4 font-bold text-white/90 leading-relaxed text-shadow-xs text-shadow-black/60 px-4 sm:px-6 md:px-8"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: "0.4s",
              fontFamily: 'ui-regular, sans-serif' 
            }}
          >
            Привет, я Авиа. Занимаюсь разработкой сайтов, софтов, low-level
            софта, блокчейн технологий, ds/tg ботов и просто web3 enjoyer.
          </h2>

          <div
            className="flex justify-center mb-8 sm:mb-10 mt-[2rem]"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "0.6s",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
            }}
          >
            <Socials
              isLoaded={isLoaded}
              socials={[
                {
                  href: "https://discordapp.com/users/1014171982696296468/",
                  src: "/logo/Discord.png",
                  alt: "Discord",
                },
                {
                  href: "https://github.com/Aviaplanes",
                  src: "/logo/GitHub.png",
                  alt: "GitHub",
                },
                {
                  href: "https://twitter.com/1000letgneva",
                  src: "/logo/X.png",
                  alt: "Twitter",
                },
              ]}
              className="mb-8 sm:mb-12 mt-[-10px]"
            />
          </div>

          {/* Marquee компонент */}
          <div style={{
                fontFamily: 'ui-regular, sans-serif'
              }}>
            <Marquee

              text="— powered by av\aplanes     "
              speed={500}
              isLoaded={isLoaded}
              className="w-3/4 mx-auto text-gray-500 mb-[3rem]"
              
            />
          </div>
        </div>

        <div
          className="hidden md:block"
          style={{
            position: "fixed",
            bottom: "7px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: 9999,
          }}
        >
          <GlassAudioPlayer songs={songs} />
        </div>
      </div>
    </>
  );
}
