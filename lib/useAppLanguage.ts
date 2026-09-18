import { useCallback, useEffect, useState } from 'react';
import { copy, getLanguage, setLanguage as saveLanguage } from './i18n';
import { Language } from './types';

export function useAppLanguage() {
  const [language, setLanguageState] = useState<Language>('en');
  useEffect(() => { getLanguage().then(setLanguageState); }, []);
  const setLanguage = useCallback(async (l: Language) => {
    await saveLanguage(l);
    setLanguageState(l);
  }, []);
  return { language, setLanguage, t: copy[language] };
}
