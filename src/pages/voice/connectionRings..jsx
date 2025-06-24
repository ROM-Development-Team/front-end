export const ConnectionRings = ({ isConnected, connectionPulse }) => {
  if (!isConnected) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-orange-300"
          style={{
            animation: `ping 2s cubic-bezier(0, 0, 0.2, 1) infinite`,
            animationDelay: `${i * 0.7}s`,
            opacity: connectionPulse === i ? 0.6 : 0.2,
          }}
        />
      ))}
    </div>
  );
};