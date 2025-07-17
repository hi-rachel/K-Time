import React, { useEffect, useState, useRef } from "react";
const mugunghwaImg = "/images/rose-of-sharon.png";

type Flower = {
  id: number;
  left: number;
  size: number;
  bottom: number;
  hit?: boolean;
};

function getResponsiveConfig(windowWidth: number) {
  // 화면 크기에 따라 꽃 개수/반지름/크기 조정 (구간 세분화)
  if (windowWidth <= 668) {
    return {
      flowerCount: 7,
      radius: 24,
      minSize: 48,
      maxSize: 90,
      baseBottom: 12,
    };
  } else if (windowWidth <= 1180) {
    return {
      flowerCount: 11,
      radius: 38,
      minSize: 48,
      maxSize: 90,
      baseBottom: 12,
    };
  } else if (windowWidth < 1200) {
    return {
      flowerCount: 11,
      radius: 38,
      minSize: 56,
      maxSize: 110,
      baseBottom: 14,
    };
  } else if (windowWidth < 1600) {
    return {
      flowerCount: 13,
      radius: 46,
      minSize: 56,
      maxSize: 140,
      baseBottom: 12,
    };
  } else {
    return {
      flowerCount: 17,
      radius: 58,
      minSize: 70,
      maxSize: 180,
      baseBottom: 16,
    };
  }
}

export default function FlowerBed() {
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const flowerId = useRef(0);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 커서 위치 추적
  useEffect(() => {
    if (windowWidth === null || windowWidth < 640) return;
    const handleMove = (e: MouseEvent) =>
      setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [windowWidth]);

  // 반응형 꽃 생성/크기 조절
  useEffect(() => {
    if (windowWidth === null || windowWidth < 640) return;
    const { flowerCount, radius, minSize, maxSize, baseBottom } =
      getResponsiveConfig(windowWidth);
    const centerX = 50;
    setFlowers((prev) => {
      if (prev.length === flowerCount) {
        return prev.map((f, i) => {
          const size =
            i === 0 || i === flowerCount - 1
              ? minSize
              : Math.random() * (maxSize - minSize) + minSize;
          return { ...f, size };
        });
      }
      return Array.from({ length: flowerCount }).map((_, i) => {
        const t = (i / (flowerCount - 1)) * 1.7 - 0.85; // -0.85~0.85
        const y = Math.sqrt(1 - t * t);
        const left = centerX + t * radius;
        const size =
          i === 0 || i === flowerCount - 1
            ? minSize
            : Math.random() * (maxSize - minSize) + minSize;
        const bottom =
          baseBottom +
          (1 - y) *
            (windowWidth <= 680
              ? 20
              : windowWidth < 1200
              ? 40
              : windowWidth < 1600
              ? 60
              : 80);
        return { id: flowerId.current++, left, size, bottom, hit: false };
      });
    });
  }, [windowWidth]);

  // 커서-꽃 충돌 판정 및 hit 애니메이션
  useEffect(() => {
    if (windowWidth === null || windowWidth < 640) return;
    if (flowers.length === 0) return;
    const interval = setInterval(() => {
      setFlowers((prev) =>
        prev.map((f) => {
          const x = (f.left / 100) * window.innerWidth;
          const y = window.innerHeight - f.bottom - f.size / 2;
          const dx = cursor.x - (x + f.size / 2);
          const dy = cursor.y - (y + f.size / 2);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const hit = dist < f.size * 0.7;
          if (hit && !f.hit) {
            setTimeout(() => {
              setFlowers((prev2) =>
                prev2.map((ff) => (ff.id === f.id ? { ...ff, hit: false } : ff))
              );
            }, 700);
            return { ...f, hit: true };
          }
          return f;
        })
      );
    }, 30);
    return () => clearInterval(interval);
  }, [cursor, flowers, windowWidth]);

  if (windowWidth !== null && windowWidth < 640) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 bottom-0 z-40 select-none"
      style={{
        height:
          windowWidth && windowWidth > 1200
            ? windowWidth > 1600
              ? 180
              : 120
            : windowWidth && windowWidth <= 680
            ? 60
            : 80,
      }}
    >
      {flowers.map((f) => (
        <img
          key={f.id}
          src={mugunghwaImg}
          alt="무궁화"
          style={{
            position: "absolute",
            left: `${f.left}vw`,
            bottom: `${f.bottom}px`,
            width: f.size,
            height: f.size,
            zIndex: 40,
            pointerEvents: "none",
            userSelect: "none",
            opacity: 0.92,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
            transition: f.hit
              ? "transform 0.45s cubic-bezier(.22,1.2,.36,1), width 0.5s, height 0.5s"
              : "width 0.5s, height 0.5s",
            transform: f.hit
              ? "scale(1.3) translateY(-30px) rotate(-20deg)"
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
