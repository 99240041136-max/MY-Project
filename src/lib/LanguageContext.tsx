import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'English' | 'Spanish' | 'French' | 'Hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  English: {
    'welcome': 'Welcome back',
    'dashboard': 'Dashboard',
    'courses': 'Courses',
    'mentor': 'AI Mentor',
    'settings': 'Settings',
    'logout': 'Sign Out',
    'quick_actions': 'Quick Actions',
    'translate': 'Translate Content',
    'tts': 'Text to Speech',
    'quiz': 'Take a Quiz',
    'progress': 'Course Progress',
    'streak': 'Study Streak',
    'interactions': 'AI Interactions',
    'daily_goal': 'Daily Goal',
    'study_time': 'Study Time',
    'focus_tools': 'Focus Tools',
    'need_help': 'Need help?',
    'ask_mentor': 'Ask our AI Mentor about specific concepts in this module.',
    'chat_mentor': 'Chat with Mentor',
    'mark_complete': 'Mark Module as Complete',
    'about_module': 'About this Module',
    'course_content': 'Course Content',
    'search_placeholder': 'Search topics, courses, or help...',
  },
  Spanish: {
    'welcome': 'Bienvenido de nuevo',
    'dashboard': 'Tablero',
    'courses': 'Cursos',
    'mentor': 'Mentor IA',
    'settings': 'Ajustes',
    'logout': 'Cerrar sesión',
    'quick_actions': 'Acciones rápidas',
    'translate': 'Traducir contenido',
    'tts': 'Texto a voz',
    'quiz': 'Hacer un cuestionario',
    'progress': 'Progreso del curso',
    'streak': 'Racha de estudio',
    'interactions': 'Interacciones IA',
    'daily_goal': 'Meta diaria',
    'study_time': 'Tiempo de estudio',
    'focus_tools': 'Herramientas de enfoque',
    'need_help': '¿Necesitas ayuda?',
    'ask_mentor': 'Pregunta a nuestro Mentor IA sobre conceptos específicos en este módulo.',
    'chat_mentor': 'Chatear con el mentor',
    'mark_complete': 'Marcar módulo como completado',
    'about_module': 'Acerca de este módulo',
    'course_content': 'Contenido del curso',
    'search_placeholder': 'Buscar temas, cursos o ayuda...',
  },
  French: {
    'welcome': 'Bon retour',
    'dashboard': 'Tableau de bord',
    'courses': 'Cours',
    'mentor': 'Mentor IA',
    'settings': 'Paramètres',
    'logout': 'Se déconnecter',
    'quick_actions': 'Actions rapides',
    'translate': 'Traduire le contenu',
    'tts': 'Synthèse vocale',
    'quiz': 'Faire un quiz',
    'progress': 'Progreso du cours',
    'streak': 'Série d\'études',
    'interactions': 'Interactions IA',
    'daily_goal': 'Objectif quotidien',
    'study_time': 'Temps d\'étude',
    'focus_tools': 'Outils de concentration',
    'need_help': 'Besoin d\'aide ?',
    'ask_mentor': 'Demandez à notre mentor IA des concepts spécifiques dans ce module.',
    'chat_mentor': 'Discuter avec le mentor',
    'mark_complete': 'Marquer le module comme terminé',
    'about_module': 'À propos de ce module',
    'course_content': 'Contenu du cours',
    'search_placeholder': 'Rechercher des sujets, des cours ou de l\'aide...',
  },
  Hindi: {
    'welcome': 'वापसी पर स्वागत है',
    'dashboard': 'डैशबोर्ड',
    'courses': 'कोर्स',
    'mentor': 'AI मेंटर',
    'settings': 'सेटिंग्स',
    'logout': 'साइन आउट',
    'quick_actions': 'त्वरित कार्य',
    'translate': 'सामग्री का अनुवाद करें',
    'tts': 'टेक्स्ट टू स्पीच',
    'quiz': 'क्विज़ लें',
    'progress': 'कोर्स की प्रगति',
    'streak': 'अध्ययन का सिलसिला',
    'interactions': 'AI बातचीत',
    'daily_goal': 'दैनिक लक्ष्य',
    'study_time': 'अध्ययन का समय',
    'focus_tools': 'फोकस टूल्स',
    'need_help': 'क्या आपको मदद चाहिए?',
    'ask_mentor': 'इस मॉड्यूल में विशिष्ट अवधारणाओं के बारे में हमारे AI मेंटर से पूछें।',
    'chat_mentor': 'मेंटर के साथ चैट करें',
    'mark_complete': 'मॉड्यूल को पूर्ण के रूप में चिह्नित करें',
    'about_module': 'इस मॉड्यूल के बारे में',
    'course_content': 'कोर्स की सामग्री',
    'search_placeholder': 'विषय, कोर्स या सहायता खोजें...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('English');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
