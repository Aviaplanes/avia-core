"use client";

import React from 'react';

interface SocialIcon {
  href: string;
  src: string;
  alt: string;
}

interface SocialIconsProps {
  socials: SocialIcon[];
  isLoaded: boolean;
  className?: string;
}

const Socials: React.FC<SocialIconsProps> = ({
  socials,
  isLoaded,
  className = ""
}) => {
  return (
    <div
      className={`flex justify-center items-center gap-4 sm:gap-8 ${className}`}
      style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(20px)",
        transitionDelay: "0.6s",
        transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
      }}
    >
      {socials.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-transform hover:scale-110"
        >
          <img
            src={social.src}
            alt={social.alt}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 block"
            style={{ objectFit: "contain" }}
          />
        </a>
      ))}
    </div>
  );
};

export default Socials;