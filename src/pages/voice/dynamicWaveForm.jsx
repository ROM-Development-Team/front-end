import { useEffect, useRef } from "react";

export const DynamicWaveform = ({ level = 100, isActive }) => {
  const barRefs = useRef([]);
  const phase = useRef(0);
  const animationRef = useRef();

  useEffect(() => {
    const animate = () => {
      if (!isActive) {
        barRefs.current.forEach((bar) => {
          if (bar) bar.style.height = "10px";
        });
        return;
      }

      phase.current += 0.05;

      barRefs.current.forEach((bar, i) => {
        if (!bar) return;
        const position = i / 24;
        const wave = Math.sin(position * Math.PI * 2 + phase.current) * 0.3 + 0.7;
        const levelMultiplier = level / 100;
        const height = wave * levelMultiplier * 80 + 10;
        bar.style.height = `${Math.max(5, height)}px`;
        bar.style.opacity = `${0.8 + (height / 100) * 0.2}`;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isActive, level]);

  return (
    <div className="flex items-end justify-center gap-1 h-24 px-4">
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (barRefs.current[i] = el)}
          className={`rounded-full transition-all duration-100 ${
            isActive ? "bg-gradient-to-t from-orange-600 to-orange-400" : "bg-gray-300"
          }`}
          style={{
            width: "4px",
            height: "10px",
            transition: "height 0.1s linear, opacity 0.1s linear",
          }}
        />
      ))}
    </div>
  );
};
