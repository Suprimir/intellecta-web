import Link from "next/link";
import { ReactNode } from "react";

interface HyperlinkProps {
  text: string;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
  iconPosition?: "left" | "right";
}

export default function Button({
  text,
  onClick,
  className = "",
  children,
  iconPosition = "left",
}: HyperlinkProps) {
  return (
    <button
      onClick={onClick}
      className={`${className} cursor-pointer inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-semibold`}
    >
      {iconPosition === "left" && children}
      <span>{text}</span>
      {iconPosition === "right" && children}
    </button>
  );
}
