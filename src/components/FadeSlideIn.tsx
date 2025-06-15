import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface FadeSlideInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const FadeSlideIn = ({
  children,
  className = "",
  delay = 10,
}: FadeSlideInProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div
      className={`transform transition-all duration-500 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default FadeSlideIn;
