"use client";

import React, { useState } from "react";
import TimeConverter from "../../components/TimeConverter";
import { useParams } from "next/navigation";
import ChangeLocale from "../../components/ChangeLocale";

const flagImages = {
  korea: "/images/flag/south-korea.webp",
  toronto: "/images/flag/canada.webp",
};

export default function LocalePage() {
  const [baseZone, setBaseZone] = useState<"korea" | "toronto">("korea");
  const flagBg = flagImages[baseZone];
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* 전체 배경 국기 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${flagBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.13,
          filter: "blur(1.5px)",
          transition: "background-image 0.3s",
        }}
        aria-hidden="true"
      />
      <div className="absolute top-6 right-6 z-20">
        <ChangeLocale />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <TimeConverter
          baseZone={baseZone}
          setBaseZone={setBaseZone}
          locale={locale}
        />
      </div>
    </div>
  );
}
