import Link from "next/link";

interface ButtonProps {
  text: string;
  href: string;
  className?: string;
}

export default function Hyperlink({ text, href, className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`${className} inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-semibold`}
    >
      {text}
    </Link>
  );
}
