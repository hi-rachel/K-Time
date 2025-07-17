"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";

export default function ChangeLocale() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = params.locale as string;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-end pointer-events-none">
        <button
          className="py-1 px-4 mr-2 mt-2 rounded-lg border border-gray-200 bg-white text-black font-semibold text-base shadow-sm z-50 pointer-events-auto"
          onClick={() => handleChange(currentLocale === "ko" ? "en" : "ko")}
        >
          {currentLocale === "ko" ? "KO" : "EN"}
        </button>
      </div>
    );
  }

  return (
    <div className="inline-block rounded-lg shadow border border-gray-200 bg-white dark:bg-white z-30 min-w-[60px] sm:min-w-[110px]">
      <label htmlFor="locale-select" className="sr-only">
        언어 선택
      </label>
      <select
        id="locale-select"
        value={currentLocale}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none px-4 py-2 rounded-lg bg-white text-black border-none focus:ring-2 focus:ring-blue-200 focus:outline-none transition text-sm font-medium min-w-[60px] sm:min-w-[110px]"
        style={{ boxShadow: "none" }}
      >
        <option value="ko">한국어</option>
        <option value="en">English</option>
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
