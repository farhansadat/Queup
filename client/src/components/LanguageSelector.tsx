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
      <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'de')}>
        <SelectTrigger className="w-20 h-8 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="de">DE</SelectItem>
          <SelectItem value="en">EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}