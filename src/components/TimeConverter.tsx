"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { useTranslation } from "@/i18n/client";

const timezones = {
  korea: "Asia/Seoul",
  toronto: "America/Toronto",
};

const canadaCities = [
  { name: "Vancouver", tz: "America/Vancouver" },
  { name: "Edmonton", tz: "America/Edmonton" },
  { name: "Winnipeg", tz: "America/Winnipeg" },
  { name: "Toronto / Montreal / Ottawa", tz: "America/Toronto" },
  { name: "Halifax", tz: "America/Halifax" },
];

function getOpposite(zone: "korea" | "toronto") {
  return zone === "korea" ? "toronto" : "korea";
}

interface TimeConverterProps {
  baseZone: "korea" | "toronto";
  setBaseZone: (zone: "korea" | "toronto") => void;
  locale: string;
}

export default function TimeConverter({
  baseZone,
  setBaseZone,
  locale,
}: TimeConverterProps) {
  const { t } = useTranslation(locale, "common");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [start, setStart] = useState<string>("10:00");
  const [end, setEnd] = useState<string>("12:00");
  // 캐나다 입력 모드일 때 도시(타임존) 선택
  const [canadaTz, setCanadaTz] = useState<string>(canadaCities[3].tz); // 토론토 기본

  // 변환된 시간 계산 (정확한 타임존 변환)
  const getConverted = (time: string) => {
    const baseTz = baseZone === "korea" ? timezones.korea : canadaTz;
    const oppoZone = getOpposite(baseZone);
    const oppoTz = oppoZone === "korea" ? timezones.korea : canadaTz;
    const iso = `${date}T${time}:00`;
    const utc = fromZonedTime(iso, baseTz);
    const converted = toZonedTime(utc, oppoTz);
    return format(converted, "yyyy-MM-dd HH:mm");
  };

  // 구글 캘린더 링크 생성 (fromZonedTime + formatInTimeZone)
  const getGoogleCalUrl = () => {
    const baseTz = baseZone === "korea" ? timezones.korea : canadaTz;
    const dtStart = `${date}T${start}:00`;
    const dtEnd = `${date}T${end}:00`;
    const utcStart = fromZonedTime(dtStart, baseTz);
    const utcEnd = fromZonedTime(dtEnd, baseTz);
    // 반드시 UTC로 포맷!
    const fmt = (d: Date) => formatInTimeZone(d, "UTC", "yyyyMMdd'T'HHmmss'Z'");
    const details = `${t("title")} (${
      baseZone === "korea"
        ? t("korea")
        : canadaCities.find((c) => c.tz === canadaTz)?.name
    } ${t("inputTime")})`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      t("title")
    )}&dates=${fmt(utcStart)}/${fmt(utcEnd)}&details=${encodeURIComponent(
      details
    )}`;
  };

  const oppoZone = getOpposite(baseZone);
  const convertedStart = getConverted(start);
  const convertedEnd = getConverted(end);

  return (
    <div className="w-full max-w-md mx-auto relative rounded-xl shadow-lg border border-gray-200 overflow-hidden bg-white">
      <div className="relative z-10 p-8 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-blue-600 mb-2">{t("title")}</h2>
        <div className="flex gap-2 mb-2">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition border ${
              baseZone === "korea"
                ? "bg-blue-500 text-white border-blue-500 shadow"
                : "bg-gray-100 text-blue-600 border-gray-200"
            }`}
            onClick={() => setBaseZone("korea")}
          >
            {t("korea")} {t("inputTime")}
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition border ${
              baseZone === "toronto"
                ? "bg-blue-500 text-white border-blue-500 shadow"
                : "bg-gray-100 text-blue-600 border-gray-200"
            }`}
            onClick={() => setBaseZone("toronto")}
          >
            {t("canada")} {t("inputTime")}
          </button>
        </div>
        {/* 캐나다 입력 모드일 때 도시 선택 */}
        {baseZone === "toronto" && (
          <label className="text-gray-700 text-sm mb-2">
            {t("selectCity")}
            <select
              value={canadaTz}
              onChange={(e) => setCanadaTz(e.target.value)}
              className="block w-full mt-1 bg-white text-gray-900 rounded px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {canadaCities.map((city) => (
                <option key={city.tz} value={city.tz}>
                  {city.name}
                </option>
              ))}
            </select>
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
        <div className="bg-blue-50 rounded-lg p-4 text-blue-800 text-sm flex flex-col gap-2 border border-blue-100">
          <div className="font-semibold text-blue-600">
            {baseZone === "korea"
              ? t("korea") + " " + t("time")
              : (canadaCities.find((c) => c.tz === canadaTz)?.name || "") +
                " " +
                t("time")}
          </div>
          <div className="pl-2 text-base font-mono text-black">
            {date} {start} ~ {end}
          </div>
          <div className="font-semibold text-blue-600 mt-2">
            {oppoZone === "korea"
              ? t("korea") + " " + t("time")
              : (canadaCities.find((c) => c.tz === canadaTz)?.name || "") +
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
          className="mt-2 w-full py-3 rounded-lg bg-blue-500 text-white text-center font-semibold text-base transition hover:bg-blue-600 border border-blue-500 shadow"
        >
          {t("addToGoogleCalendar")}
        </a>
      </div>
    </div>
  );
}
