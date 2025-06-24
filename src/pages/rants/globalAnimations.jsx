export const GlobalAnimations = () => {
  return (
    <style jsx global>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes slideInDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-3deg); }
        75% { transform: rotate(3deg); }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.3); }
        50% { box-shadow: 0 0 40px rgba(255, 107, 53, 0.6); }
      }
      @keyframes typing {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      @keyframes floatUp {
        0% { transform: translateY(0px); opacity: 1; }
        100% { transform: translateY(-100vh); opacity: 0; }
      }
    `}</style>
  );
};