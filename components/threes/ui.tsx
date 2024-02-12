export function GridSpace() {
  return <div className="w-24 h-32 rounded bg-gray-300"></div>;
}

export function Tile({
  value,
  position,
}: {
  value: number;
  position: { x: number; y: number };
}) {
  const deltaX = 112;
  const deltaY = 144;

  let bgColor = "bg-white";
  if (value === 1) bgColor = "bg-red-400";
  if (value === 2) bgColor = "bg-blue-400";

  return (
    <div
      className="w-24 h-32 absolute flex items-center justify-center text-6xl rounded bg-red-400 transition-all duration-250 ease-in-out"
      style={{
        transform: `translate(${position.x * deltaX + 16}px, ${
          position.y * deltaY + 16
        }px)`,
      }}
    >
      {value}
    </div>
  );
}
