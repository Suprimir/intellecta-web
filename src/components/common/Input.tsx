interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({ className, ...props }: InputProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border-2 border-[#CDD1DC]">
      <input
        {...props}
        className={`text-sm/6 text-[#031B4E] font-semibold px-3 py-1.5 ${className}`}
      />
    </div>
  );
}
