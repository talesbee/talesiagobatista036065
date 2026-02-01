import Logo from '../assets/Logo.png';
import { Button } from '../components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { PetIcon, TutorIcon } from '../assets/icons';

interface HeaderProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  onSearch: () => void;
}

export const HeaderPage: React.FC<HeaderProps> = ({ searchInput, setSearchInput, onSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-6">
      <button
        type="button"
        onClick={() => navigate('/pets')}
        className="focus:outline-none"
        aria-label={t('pets.title')}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ height: '300px', maxHeight: '40vh' }}
          className="object-contain"
        />
      </button>
      <nav className="flex gap-4" style={{ marginLeft: '-40px' }}>
        {location.pathname === '/pets' && (
          <button
            type="button"
            onClick={() => navigate('/tutores')}
            className="focus:outline-none"
            aria-label={t('tutors.title')}
          >
            <TutorIcon style={{ width: 60, height: 60 }} className="text-brand-blue" />
            <span className="text-brand-blue">{t('tutors.title')}</span>
          </button>
        )}
        {location.pathname === '/tutores' && (
          <button
            type="button"
            onClick={() => navigate('/pets')}
            className="focus:outline-none"
            aria-label={t('pets.title')}
          >
            <PetIcon style={{ width: 60, height: 60 }} className="text-brand-blue" />
            <span className="text-brand-blue">{t('pets.title')}</span>
          </button>
        )}
      </nav>
      <form
        className="flex-1 flex justify-end"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
      >
        <input
          type="text"
          placeholder={location.pathname === '/pets' ? t('pets.search') : t('tutors.search')}
          className="border border-gray-300 rounded-l px-3 py-2 w-64 focus:outline-none"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r"
        >
          {location.pathname === '/pets' ? t('pets.searchBtn') : t('tutors.searchBtn')}
        </Button>
      </form>
    </div>
  );
};
