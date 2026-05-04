// src/components/LanguageDropdown.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.language.toUpperCase());

  const languages = [
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];



  const handleSelect = (lang) => {
    setSelected(lang.code.toUpperCase());
    setIsOpen(false);
    i18n.changeLanguage(lang.code);
    localStorage.setItem("lang", lang.code); 
  };

  console.log(i18n.language  , "i18n.language in language dropdown");


  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        🌐 {selected}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
