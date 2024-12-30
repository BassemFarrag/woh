import { LANGUAGES } from '../constants/languages.js';

class LanguageService {
  constructor() {
    this.currentLanguage = LANGUAGES[0]; // Default to English
  }

  setLanguage(languageCode) {
    const language = LANGUAGES.find(lang => lang.code === languageCode);
    if (language) {
      this.currentLanguage = language;
      document.documentElement.lang = languageCode;
      return true;
    }
    return false;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}

export const languageService = new LanguageService();