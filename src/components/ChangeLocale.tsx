"use client";

import { useRouter, useParams, usePathname } from "next/navigation";

export default function ChangeLocale() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const currentLocale = params.locale as string;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <div className="inline-block rounded-lg shadow border border-gray-200 bg-white dark:bg-white">
      <select
        value={currentLocale}
        onChange={handleChange}
        className="appearance-none px-4 py-2 rounded-lg bg-white text-black border-none focus:ring-2 focus:ring-blue-200 focus:outline-none transition text-sm font-medium min-w-[110px]"
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
