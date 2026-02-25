"use client";

import { useState, useEffect, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useClickOutside } from "@/hooks/useClickOutside";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "zh-CN", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ur", name: "اردو", flag: "🇵🇰" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
];

// Helper to get current language from cookie
const getCurrentLanguage = () => {
  if (typeof document === "undefined") return languages[0];
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  if (match) {
    const code = match[1];
    const found = languages.find((l) => l.code === code);
    return found || languages[0];
  }
  return languages[0];
};

export default function CustomLanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Load Google Translate script once
  useEffect(() => {
    if (document.querySelector("#google-translate-script")) return;

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: languages.map((l) => l.code).join(","),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    document.body.appendChild(script);
  }, []);

  // Update current language from cookie
  useEffect(() => {
    const updateFromCookie = () => {
      setCurrentLang(getCurrentLanguage());
    };
    updateFromCookie();

    // Optional: listen for cookie changes (if needed)
    const interval = setInterval(updateFromCookie, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLanguageChange = (lang) => {
    setIsOpen(false);
    // Set cookie and reload
    document.cookie = `googtrans=/en/${lang.code}; path=/; max-age=31536000`;
    console.log(`Language cookie set to: /en/${lang.code}`);
    window.location.reload();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1 text-gray-300 hover:text-white rounded transition-colors text-sm"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span className="font-medium">{currentLang.name}</span>
        <FiChevronDown
          size={12}
          className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-72 overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${
                currentLang.code === lang.code
                  ? "bg-gray-100 text-black font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.name}</span>
              {currentLang.code === lang.code && (
                <span className="ml-auto text-black">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Hidden Google Translate container */}
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
}
