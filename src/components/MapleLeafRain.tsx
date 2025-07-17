import React, { useEffect, useRef, useState } from "react";
const mapleImg = "/images/maple-leaf.png";

type MapleLeaf = {
  id: number;
  left: number;
  size: number;
  duration: number;
  start: number;
  hit: boolean;
};

function getMapleLeft() {
  const r = Math.random();
  if (r < 0.4) return Math.random() * 20; // 0~20vw (왼쪽)
  if (r < 0.8) return 80 + Math.random() * 20; // 80~100vw (오른쪽)
  return 35 + Math.random() * 30; // 35~65vw (가운데, 적게)
}

export default function MapleLeafRain() {
  const [maples, setMaples] = useState<MapleLeaf[]>([]);
  const mapleId = useRef(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (windowWidth !== null && windowWidth < 640) return;
    const interval = setInterval(() => {
      const duration = Math.random() * 4 + 6; // 6~10초
      const now = Date.now();
      const newMaple = {
        id: mapleId.current++,
        left: getMapleLeft(),
        size: Math.random() * 20 + 28,
        duration,
        start: now,
        hit: false,
      };
      setMaples((prev) => [...prev, newMaple]);
      setTimeout(() => {
        setMaples((prev) => prev.filter((m) => m.id !== newMaple.id));
      }, (duration + 1) * 1000);
    }, 200);
    return () => clearInterval(interval);
  }, [windowWidth]);

  useEffect(() => {
    if (windowWidth !== null && windowWidth < 640) return;
    if (maples.length === 0) return;
    const interval = setInterval(() => {
      setMaples((prev) =>
        prev.map((m) => {
          const elapsed = (Date.now() - m.start) / (m.duration * 1000);
          if (elapsed < 0 || elapsed > 1) return m;
          const x = (m.left / 100) * window.innerWidth;
          const y = elapsed * (window.innerHeight * 1.3 + 60);
          const dx = cursor.x - (x + m.size / 2);
          const dy = cursor.y - (y + m.size / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const hit = dist < m.size * 0.7;
          if (hit && !m.hit) {
            setTimeout(() => {
              setMaples((prev2) =>
                prev2.map((mm) => (mm.id === m.id ? { ...mm, hit: false } : mm))
              );
            }, 500);
            return { ...m, hit: true };
          }
          return m;
        })
      );
    }, 30);
    return () => clearInterval(interval);
  }, [cursor, maples, windowWidth]);

  if (windowWidth !== null && windowWidth < 640) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {maples.map((m) => {
        const elapsed = (Date.now() - m.start) / (m.duration * 1000);
        if (elapsed < 0 || elapsed > 1) return null;
        const y = elapsed * (window.innerHeight * 1.3 + 60);
        const style = {
          left: `${m.left}vw`,
          width: m.size,
          height: m.size,
          position: "absolute" as const,
          top: y - m.size / 2,
          pointerEvents: "none" as const,
          zIndex: 50,
          opacity: 0.85,
          transition: m.hit ? "transform 0.2s cubic-bezier(.4,2,.6,1)" : "",
          transform: m.hit
            ? "scale(1.3) translateY(-30px) rotate(-20deg)"
            : `rotate(${elapsed * 360}deg)`,
        };
        return (
          <img
            key={m.id}
            src={mapleImg}
            alt="maple"
            style={style}
            className="select-none"
          />
        );
      })}
      <style jsx>{`
        @keyframes maple-fall {
          to {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
