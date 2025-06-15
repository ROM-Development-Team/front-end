import type { ButtonHTMLAttributes } from "react";

interface ThemedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const ThemedButton = ({
  value,
  className = "",
  ...rest
}: ThemedButtonProps) => {
  return (
    <button
      {...rest}
      className={`bg-accent hover:bg-accent-hover cursor-pointer rounded p-2 text-white ${className}`}
    >
      {value}
    </button>
  );
};
export default ThemedButton;
