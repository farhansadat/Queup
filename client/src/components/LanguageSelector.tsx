import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../lib/i18n';

interface LanguageSelectorProps {
  className?: string;
  variant?: 'default' | 'glassmorphism';
}

export function LanguageSelector({ className = "", variant = 'default' }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  const isGlassmorphism = variant === 'glassmorphism';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className={`w-4 h-4 ${isGlassmorphism ? 'text-white text-opacity-80' : 'text-gray-600'}`} />
      <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'de')}>
        <SelectTrigger className={`w-20 h-8 text-sm ${
          isGlassmorphism 
            ? 'bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 text-white'
            : 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50'
        }`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={
          isGlassmorphism 
            ? 'bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg border border-white border-opacity-30'
            : 'bg-white border border-gray-200 shadow-lg'
        }>
          <SelectItem value="de" className="text-gray-900 hover:bg-purple-100">DE</SelectItem>
          <SelectItem value="en" className="text-gray-900 hover:bg-purple-100">EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}