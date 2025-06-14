import type { InputHTMLAttributes, ReactNode } from "react";

interface ThemedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  containerClassName?: string;
}

const ThemedInput = ({
  label,
  icon,
  className = "",
  containerClassName = "",
  id,
  ...rest
}: ThemedInputProps) => {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-2 rounded-sm border border-gray-300 px-2 py-1.5 text-xs ${containerClassName}`}
    >
      <div className="flex items-center">{icon}</div>
      <div className="relative w-full">
        <input
          id={id}
          required
          placeholder=" "
          className={`peer ml-1 w-full border-none bg-white pt-4.5 pb-1 text-xs font-medium text-black placeholder-transparent focus:outline-none ${className}`}
          {...rest}
        />
        <span className="absolute top-1 left-1 text-[10px] text-black transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-black">
          {label}
        </span>
      </div>
    </label>
  );
};

export default ThemedInput;
