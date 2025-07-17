import React, { useEffect, useState, useRef } from "react";
const mugunghwaImg = "/images/rose-of-sharon.png";

type Flower = {
  id: number;
  left: number;
  size: number;
  bottom: number;
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
  const flowerId = useRef(0);

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // flower 위치는 고정, size만 반응형으로 조절
  useEffect(() => {
    if (windowWidth === null || windowWidth < 640) return;
    const { flowerCount, radius, minSize, maxSize, baseBottom } =
      getResponsiveConfig(windowWidth);
    const centerX = 50;
    // t값을 -0.85~0.85로 조정해 양 끝 여백 확보
    setFlowers((prev) => {
      if (prev.length === flowerCount) {
        // 위치 고정, size만 업데이트
        return prev.map((f, i) => {
          const size =
            i === 0 || i === flowerCount - 1
              ? minSize
              : Math.random() * (maxSize - minSize) + minSize;
          return { ...f, size };
        });
      }
      // 최초 생성: 위치 랜덤, 양 끝은 작게
      return Array.from({ length: flowerCount }).map((_, i) => {
        // -0.85~0.85로 패딩
        const t = (i / (flowerCount - 1)) * 1.7 - 0.85; // -0.85~0.85
        const y = Math.sqrt(1 - t * t);
        const left = centerX + t * radius;
        const size =
          i === 0 || i === flowerCount - 1
            ? minSize
            : Math.random() * (maxSize - minSize) + minSize;
        // 꽃 사이 최소 간격 보장(겹치지 않게): 크기와 반지름을 조합해 bottom을 조정
        // (y가 1에 가까울수록 위로 올라가게)
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
        return { id: flowerId.current++, left, size, bottom };
      });
    });
  }, [windowWidth]);

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
            transition: "width 0.5s, height 0.5s",
          }}
        />
      ))}
    </div>
  );
}
