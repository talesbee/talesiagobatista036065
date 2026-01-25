import { LanguageSelector } from './index';

export default function Header() {
  return (
    <header className="w-full flex justify-end items-center px-6 py-4 fixed top-0 left-0">
      <LanguageSelector />
    </header>
  );
}
