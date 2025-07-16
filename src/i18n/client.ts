"use client";

import i18next from "i18next";
import {
  initReactI18next,
  useTranslation as useTransAlias,
} from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getOptions, languages } from "./settings";

const runsOnServerSide = typeof window === "undefined";

if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
      resourcesToBackend((language: string, namespace: string) =>
        fetch(`/locales/${language}/${namespace}.json`).then((res) =>
          res.json()
        )
      )
    )
    .init({
      ...getOptions(),
      lng: undefined, // detect the language on the client
      detection: {
        order: ["path", "htmlTag", "cookie", "navigator"],
      },
      preload: runsOnServerSide ? languages : [],
    });
}

export function useTranslation(lng: string, ns: string = "common") {
  const ret = useTransAlias(ns);
  const { i18n } = ret;
  // 클라이언트에서 lng가 바뀌면 i18n.changeLanguage 호출
  if (!runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  }
  return ret;
}
