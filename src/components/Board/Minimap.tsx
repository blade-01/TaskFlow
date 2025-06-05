import { useEffect, useRef, useState } from "react";

interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>;
  totalColumns: number;
}

export default function Minimap({ containerRef, totalColumns }: Props) {
  const [thumbStyle, setThumbStyle] = useState({ width: 0, left: 0 });
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  const MINIMAP_WIDTH = 200; // px
  const COLUMN_WIDTH = MINIMAP_WIDTH / totalColumns;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateThumb = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const ratio = clientWidth / scrollWidth;
      const width = ratio * MINIMAP_WIDTH;
      const left = (scrollLeft / scrollWidth) * MINIMAP_WIDTH;
      setThumbStyle({ width, left });
    };

    container.addEventListener("scroll", updateThumb);
    updateThumb();

    return () => container.removeEventListener("scroll", updateThumb);
  }, [containerRef, totalColumns]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeftStart.current = containerRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const dx = e.clientX - startX.current;
    const container = containerRef.current;
    const scrollWidth = container.scrollWidth;
    const ratio = scrollWidth / MINIMAP_WIDTH;

    container.scrollLeft = scrollLeftStart.current + dx * ratio;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="fixed bottom-6 right-3 bg-sidebar-bg rounded-md shadow-md p-1 flex items-center gap-1 z-50"
      style={{ width: `${MINIMAP_WIDTH}px`, height: "50px" }}
    >
      {/* Column Blocks */}
      {[...Array(totalColumns)].map((_, i) => (
        <div
          key={i}
          className="bg-main-bg rounded-sm !h-full"
          style={{
            width: `${COLUMN_WIDTH - 4}px`,
            height: "18px"
          }}
        />
      ))}

      {/* Scroll Thumb */}
      <div
        className="absolute top-1/2 -translate-y-1/2 left-0 h-[80%] border border-btn-bg bg-sidebar-bg/30 rounded-md cursor-grab"
        style={{
          width: `${thumbStyle.width}px`,
          left: `${thumbStyle.left}px`
          //background: "rgba(59,130,246,0.2)"
        }}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
}
