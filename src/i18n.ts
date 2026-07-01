import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
const resources = {
  en: {
    translation: {
      "nav": {
        "destinations": "Destinations",
        "experiences": "Experiences",
        "planner": "AI Planner",
        "login": "Login"
      },
      "hero": {
        "badge": "AI-Powered Travel",
        "title1": "Discover India's",
        "title2": "Hidden Wonders",
        "subtitle": "Your elite AI concierge for breathtaking journeys across the Himalayas, tropical beaches, and royal palaces.",
        "cta": "Plan Your Escape"
      },
      "destinations": {
        "title": "Extraordinary Escapes",
        "explore": "Explore"
      }
    }
  },
  hi: {
    translation: {
      "nav": {
        "destinations": "मंज़िलें",
        "experiences": "अनुभव",
        "planner": "AI प्लानर",
        "login": "लॉग इन"
      },
      "hero": {
        "badge": "AI-संचालित यात्रा",
        "title1": "भारत के छिपे हुए",
        "title2": "अजूबों की खोज करें",
        "subtitle": "हिमालय, उष्णकटिबंधीय समुद्र तटों और शाही महलों में लुभावनी यात्राओं के लिए आपका कुलीन एआई कंसीयज।",
        "cta": "अपनी यात्रा की योजना बनाएं"
      },
      "destinations": {
        "title": "असाधारण पलायन",
        "explore": "अन्वेषण करें"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "destinations": "Destinations",
        "experiences": "Expériences",
        "planner": "Planificateur IA",
        "login": "Connexion"
      },
      "hero": {
        "badge": "Voyage propulsé par l'IA",
        "title1": "Découvrez les",
        "title2": "Merveilles Cachées",
        "subtitle": "Votre concierge IA d'élite pour des voyages époustouflants à travers l'Himalaya, les plages tropicales et les palais royaux.",
        "cta": "Planifiez votre évasion"
      },
      "destinations": {
        "title": "Évasions Extraordinaires",
        "explore": "Explorer"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
