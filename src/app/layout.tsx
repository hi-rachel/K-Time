import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "K-Time | 한국-캐나다 시차 쉽게 확인하세요",
  description:
    "밴쿠버, 토론토 등 캐나다 주요 도시와 한국 시간 차이, 한눈에 확인! 서머타임도 자동 반영되는 똑똑한 시차 계산기",
  keywords:
    "한국 캐나다 시차, 시간 변환, 밴쿠버 시간, 토론토 시간, 서머타임 계산, 다국어 지원, K-Time",
  openGraph: {
    title: "K-Time | 한국-캐나다 시차 쉽게 확인하세요",
    description:
      "한국과 캐나다(밴쿠버, 토론토 등) 간의 시간 차이를 자동 계산! 서머타임도 반영되는 스마트 시간 변환기",
    url: "https://k-time.vercel.app/ko/",
    siteName: "K-Time",
    images: [
      {
        url: "/images/k-time-og.png",
        width: 1200,
        height: 600,
        alt: "K-Time 대표 미리보기 이미지",
      },
    ],
    locale: "ko",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Time | 한국-캐나다 시차 자동 계산기",
    description:
      "해외 친구, 회의, 화상통화 전에 시차 계산 그만! 서머타임까지 자동 반영된 정확한 시간 변환기",
    images: ["/images/k-time-og.png"],
  },
  alternates: {
    canonical: "https://k-time.vercel.app/ko/",
    languages: {
      ko: "https://k-time.vercel.app/ko",
      en: "https://k-time.vercel.app/en",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta
          name="google-site-verification"
          content="gPP7sY1hto9tigiWfmR9RgG3B7_Ts2S-SLsfxt5X-Xo"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>{children}</main>
        <GoogleTagManager gtmId={"GTM-MSJ686TL"} />
        <GoogleAnalytics gaId={"G-6SL4DGV2YT"} />
      </body>
    </html>
  );
}
