import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from '../lib/i18n';

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-white text-opacity-80" />
      <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'de')}>
        <SelectTrigger className="w-20 h-8 text-sm bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg border border-white border-opacity-30">
          <SelectItem value="de" className="text-gray-900 hover:bg-purple-100">DE</SelectItem>
          <SelectItem value="en" className="text-gray-900 hover:bg-purple-100">EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}