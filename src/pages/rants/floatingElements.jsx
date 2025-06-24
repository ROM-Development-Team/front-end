export const FloatingElements = ({ elements }) => {
  return (
    <>
      {elements.map((element) => (
        <div
          key={element.id}
          className={`fixed pointer-events-none z-10 animate-[floatUp_3s_linear] ${element.color}`}
          style={{ left: element.x, top: element.y }}
        >
          {element.icon}
        </div>
      ))}
    </>
  );
};