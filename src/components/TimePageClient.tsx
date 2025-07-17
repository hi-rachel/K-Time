"use client";

import React, { useState } from "react";
import TimeConverter, { KOREA, CANADA } from "./TimeConverter";
import ChangeLocale from "./ChangeLocale";

const flagImages = {
  [KOREA]: "/images/flag/south-korea.webp",
  [CANADA]: "/images/flag/canada.webp",
};

type TimePageClientProps = { locale: string };

export default function TimePageClient({ locale }: TimePageClientProps) {
  const [baseCountry, setBaseCountry] = useState<typeof KOREA | typeof CANADA>(
    KOREA
  );
  const flagBg = flagImages[baseCountry];

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
          baseCountry={baseCountry}
          setBaseCountry={setBaseCountry}
          locale={locale}
        />
      </div>
    </div>
  );
}
