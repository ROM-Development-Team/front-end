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
      className={`flex cursor-pointer items-center gap-2 rounded-sm border border-gray-300 p-1 ${containerClassName}`}
    >
      <div className="ml-2 flex items-center">{icon}</div>
      <div className="relative w-full">
        <input
          id={id}
          required
          placeholder=" "
          className={`peer ml-1 w-full border-none bg-white pt-6 pb-1 text-sm font-semibold text-black placeholder-transparent focus:outline-none ${className}`}
          {...rest}
        />
        <span className="absolute top-1 left-1 text-xs text-black transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-black">
          {label}
        </span>
      </div>
    </label>
  );
};
export default ThemedInput;
