"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { useTranslation } from "@/i18n/client";
import MapleLeafRain from "./MapleLeafRain";
import FlowerBed from "./FlowerBed";
import Image from "next/image";

export const KOREA = "KOREA" as const;
export const CANADA = "CANADA" as const;
export type BaseCountry = typeof KOREA | typeof CANADA;

export const CANADA_CITIES = [
  { name: "Vancouver", tz: "America/Vancouver" },
  { name: "Edmonton", tz: "America/Edmonton" },
  { name: "Winnipeg", tz: "America/Winnipeg" },
  { name: "Toronto / Montreal / Ottawa", tz: "America/Toronto" },
  { name: "Halifax", tz: "America/Halifax" },
];

const TIMEZONES = {
  [KOREA]: "Asia/Seoul",
  [CANADA]: "America/Toronto", // 기본값(토론토)
};

function getOtherCountry(country: BaseCountry) {
  return country === KOREA ? CANADA : KOREA;
}

interface TimeConverterProps {
  baseCountry: BaseCountry;
  setBaseCountry: (country: BaseCountry) => void;
  locale: string;
}

export default function TimeConverter({
  baseCountry,
  setBaseCountry,
  locale,
}: TimeConverterProps) {
  const { t } = useTranslation(locale, "common");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [start, setStart] = useState<string>("10:00");
  const [end, setEnd] = useState<string>("12:00");
  // 캐나다 입력 모드일 때 도시(타임존) 선택
  const [canadaTz, setCanadaTz] = useState<string>(CANADA_CITIES[3].tz); // 토론토 기본

  // 변환된 시간 계산 (정확한 타임존 변환)
  const getConverted = (time: string) => {
    const baseTz = baseCountry === KOREA ? TIMEZONES[KOREA] : canadaTz;
    const otherCountry = getOtherCountry(baseCountry);
    const otherTz = otherCountry === KOREA ? TIMEZONES[KOREA] : canadaTz;
    const iso = `${date}T${time}:00`;
    const utc = fromZonedTime(iso, baseTz);
    const converted = toZonedTime(utc, otherTz);
    return format(converted, "yyyy-MM-dd HH:mm");
  };

  // 구글 캘린더 링크 생성 (fromZonedTime + formatInTimeZone)
  const getGoogleCalUrl = () => {
    const baseTz = baseCountry === KOREA ? TIMEZONES[KOREA] : canadaTz;
    const dtStart = `${date}T${start}:00`;
    const dtEnd = `${date}T${end}:00`;
    const utcStart = fromZonedTime(dtStart, baseTz);
    const utcEnd = fromZonedTime(dtEnd, baseTz);
    // 반드시 UTC로 포맷!
    const fmt = (d: Date) => formatInTimeZone(d, "UTC", "yyyyMMdd'T'HHmmss'Z'");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      "회의"
    )}&dates=${fmt(utcStart)}/${fmt(utcEnd)}`;
  };

  const otherCountry = getOtherCountry(baseCountry);
  const convertedStart = getConverted(start);
  const convertedEnd = getConverted(end);

  return (
    <>
      <div className="w-full max-w-md mx-auto relative rounded-xl shadow-lg border border-gray-200 overflow-hidden bg-white">
        {/* 카드 내부 중앙에 국기 이미지 */}
        <Image
          src={
            baseCountry === CANADA
              ? "/images/flag/canada.webp"
              : "/images/flag/south-korea.webp"
          }
          alt="국기"
          className="absolute left-1/2 top-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 opacity-10 blur-sm pointer-events-none select-none z-0"
          width={100}
          height={100}
          aria-hidden="true"
        />
        {/* 카드 내용 */}
        <div className="relative z-10 p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {t("title")}
          </h2>
          <div className="flex gap-2 mb-2">
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition border ${
                baseCountry === KOREA
                  ? "bg-blue-500 text-white border-blue-500 shadow"
                  : "bg-gray-100 text-blue-500 border-gray-200"
              }`}
              onClick={() => setBaseCountry(KOREA)}
            >
              🇰🇷 {t("korea")} {t("inputTime")}
            </button>
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition border ${
                baseCountry === CANADA
                  ? "bg-[#FF4B4B] text-white border-[#FF4B4B] hover:bg-[#FF6F61]"
                  : "bg-gray-100 text-[#FF4B4B] border-gray-200"
              }`}
              onClick={() => setBaseCountry(CANADA)}
            >
              🇨🇦 {t("canada")} {t("inputTime")}
            </button>
          </div>
          {/* 캐나다 입력 모드일 때 도시 선택 */}
          {baseCountry === CANADA && (
            <label className="text-gray-700 text-sm mb-2 w-full relative">
              {t("selectCity")}
              <div className="relative">
                <select
                  id="select-canada-city"
                  value={canadaTz}
                  onChange={(e) => setCanadaTz(e.target.value)}
                  className="block w-full mt-1 bg-white text-gray-900 rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 appearance-none leading-[1.5rem] pr-10"
                >
                  {CANADA_CITIES.map((city) => (
                    <option key={city.tz} value={city.tz}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {/* 커스텀 V 아이콘 */}
                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </label>
          )}
          <div className="flex flex-col gap-3">
            <label className="text-gray-700 text-sm">
              {t("startTime")}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full mt-1 bg-white text-gray-900 rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <div className="flex gap-2">
              <label className="flex-1 text-gray-700 text-sm">
                {t("startTime")}
                <input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="block w-full mt-1 bg-white text-gray-900 rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="flex-1 text-gray-700 text-sm">
                {t("endTime")}
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="block w-full mt-1 bg-white text-gray-900 rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
          </div>
          <div
            className={`${
              baseCountry === CANADA
                ? "bg-red-50 border-red-100"
                : "bg-blue-50 border-blue-100"
            } rounded-lg p-4 text-blue-800 text-sm flex flex-col gap-2 border`}
          >
            <div
              className={`font-semibold ${
                baseCountry === CANADA ? "text-[#FF4B4B]" : "text-blue-500"
              }`}
            >
              {baseCountry === KOREA
                ? t("korea") + " " + t("time")
                : (CANADA_CITIES.find((c) => c.tz === canadaTz)?.name || "") +
                  " " +
                  t("time")}
            </div>
            <div className="pl-2 text-base font-mono text-black">
              {date} {start} ~ {end}
            </div>
            <div
              className={`font-semibold mt-2 ${
                baseCountry === CANADA ? "text-[#FF4B4B]" : "text-blue-500"
              }`}
            >
              {otherCountry === KOREA
                ? t("korea") + " " + t("time")
                : (CANADA_CITIES.find((c) => c.tz === canadaTz)?.name || "") +
                  " " +
                  t("time")}
            </div>
            <div className="pl-2 text-base font-mono text-black">
              {convertedStart.split(" ")[0]} {convertedStart.split(" ")[1]} ~{" "}
              {convertedEnd.split(" ")[1]}
            </div>
          </div>
          <a
            href={getGoogleCalUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-2 w-full py-3 rounded-lg text-white text-center font-semibold text-base transition border shadow
              ${
                baseCountry === CANADA
                  ? "bg-[#FF4B4B] text-white border-[#FF4B4B] hover:bg-[#FF6F61]"
                  : "bg-blue-500 border-blue-500 hover:bg-blue-500"
              }
            `}
          >
            {t("addToGoogleCalendar")}
          </a>
        </div>
        {baseCountry === CANADA && <MapleLeafRain />}
      </div>
      {baseCountry === KOREA && <FlowerBed />}
    </>
  );
}
