import React, { useEffect, useState } from "react";

export const useMousePosition = (ref: React.RefObject<HTMLDivElement>) => {
  const [mousePosition, setMousePosition] = useState<{
    x: number | null;
    y: number | null;
  }>({
    x: null,
    y: null,
  });

  useEffect(() => {
    const updateMousePosition = (e: Event) => {
      if (!isMouseEvent(e)) {
        throw new Error("not a Mouse event");
      }
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const elementRef = ref.current;
    if (elementRef === null) {
      return;
    }

    elementRef.addEventListener("mousemove", updateMousePosition);
    return () => {
      elementRef.removeEventListener("mousemove", updateMousePosition);
    };
  }, [ref]);

  return mousePosition;
};

function isMouseEvent(event: Event): event is MouseEvent {
  return "x" in event;
}
