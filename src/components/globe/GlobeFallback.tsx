/* The 2D stand-in for the WebGL flag avenue. Pure CSS: it costs nothing to
 * run, so it is what devices without WebGL — or visitors who have asked
 * for reduced motion — get instead. A static row of small flags along
 * each edge, shrinking and fading upward to suggest the same recession
 * into the distance as the 3D avenue, without any animation. */

const COLORS = ["#E8C27A", "#F3E9D2", "#B8892F", "#8A5A6E", "#4A6B7A", "#6E5A8A"];
const ROWS = 9;

function flagColumn(side: "left" | "right") {
  const alignClass = side === "left" ? "items-start left-0" : "items-end right-0";
  return (
    <div className={`absolute top-0 flex h-full w-24 flex-col justify-start gap-[3.4vh] pt-[6vh] ${alignClass}`}>
      {Array.from({ length: ROWS }, (_, i) => {
        const t = i / (ROWS - 1);
        const scale = 1 - t * 0.65;
        const opacity = 0.55 - t * 0.42;
        return (
          <span
            key={i}
            className="block h-3 w-6 rounded-[1px]"
            style={{
              backgroundColor: COLORS[i % COLORS.length],
              transform: `scale(${scale})`,
              opacity,
              marginLeft: side === "left" ? `${t * 2}vw` : undefined,
              marginRight: side === "right" ? `${t * 2}vw` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

export function GlobeFallback() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {flagColumn("left")}
      {flagColumn("right")}
    </div>
  );
}
