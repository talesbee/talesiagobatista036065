import brFlag from '../assets/flags/br.png';
import usFlag from '../assets/flags/us.png';
import { useTranslation } from 'react-i18next';
import i18nInstance from '../i18n';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <div className="flex gap-2 items-center">
      <button
        type="button"
        onClick={() => i18nInstance.changeLanguage('pt')}
        className={`w-7 h-7 rounded-full border-2 ${current === 'pt' ? 'border-blue-500' : 'border-transparent'} focus:outline-none`}
        title="Português"
        aria-label="Português"
      >
        <img src={brFlag} alt="Português" className="w-full h-full object-cover rounded-full" />
      </button>
      <button
        type="button"
        onClick={() => i18nInstance.changeLanguage('en')}
        className={`w-7 h-7 rounded-full border-2 ${current === 'en' ? 'border-blue-500' : 'border-transparent'} focus:outline-none`}
        title="English"
        aria-label="English"
      >
        <img src={usFlag} alt="English" className="w-full h-full object-cover rounded-full" />
      </button>
    </div>
  );
}
