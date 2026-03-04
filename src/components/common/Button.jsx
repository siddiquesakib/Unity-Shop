"use client";
import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const Button = ({
  children,
  href,
  variant = "dark", // "dark" (black/primary) or "light" (white/hero)
  className = "",
  showIcon = true,
  Icon = FiArrowRight,
  ...props
}) => {
  // Styles based on variant:
  // dark = black border/text, hover bg-black text-white
  // light = white border/text, hover bg-white text-black

  const isLight = variant === "light";

  const baseClasses =
    "group inline-flex items-center gap-2 px-5 py-2 text-sm font-bold border-2 rounded-lg relative overflow-hidden transition-colors duration-300";

  const colors = isLight
    ? "text-white border-white hover:text-black"
    : "text-black border-black hover:text-white";

  // The animated fill color
  const bgSpanClass = isLight ? "bg-white" : "bg-black";

  return (
    <Wrapper
      href={href}
      className={`${baseClasses} ${colors} ${className}`}
      {...props}
    >
      {/* Hover fill background */}
      <span
        className={`absolute inset-0 ${bgSpanClass} translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out`}
      />

      <span className="relative z-10">{children}</span>
      {showIcon && (
        <Icon className="relative z-10 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </Wrapper>
  );
};

const Wrapper = ({ href, children, ...props }) => {
  if (href) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return <button {...props}>{children}</button>;
};

export default Button;
