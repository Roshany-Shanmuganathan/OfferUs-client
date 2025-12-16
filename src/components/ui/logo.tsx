"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  variant?: "auto" | "light" | "dark";
}

export function Logo({
  className,
  width = 120,
  height = 40,
  variant = "auto",
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During server-side rendering and hydration, render a placeholder or default to prevent mismatch
  // However, for logos, it's often better to render one and hide/swap via CSS if possible,
  // or just accept the flash. Using mounted check prevents hydration mismatch.
  if (!mounted) {
    // Return a placeholder of the same size
    return (
      <div style={{ width, height }} className={className} aria-hidden="true" />
    );
  }

  // Determine which logo to show based on variant
  let src: string;
  if (variant === "light") {
    // Light logo for dark backgrounds
    src = "/assets/logo-light.png";
  } else if (variant === "dark") {
    // Dark logo for light backgrounds
    src = "/assets/logo-dark.png";
  } else {
    // Auto mode: based on theme
    // Dark background -> light logo, Light background -> dark logo
    const isDark = resolvedTheme === "dark";
    src = isDark ? "/assets/logo-light.png" : "/assets/logo-dark.png";
  }

  return (
    <Image
      src={src}
      alt="OfferUs Logo"
      width={width}
      height={height}
      className={`object-contain ${className || ""}`}
      priority
    />
  );
}
