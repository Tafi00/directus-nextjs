import { PageBlock } from '@/types/directus-schema';
import StandardTemplate from './StandardTemplate';

interface TemplateManagerProps {
  sections: PageBlock[];
  template?: string | null;
  headerNavigation?: any;
  footerNavigation?: any;
  globals?: any;
}

export default function TemplateManager({ 
  sections, 
  headerNavigation, 
  footerNavigation, 
  globals 
}: TemplateManagerProps) {
  // Chỉ sử dụng StandardTemplate và truyền toàn bộ props cần thiết
  return (
    <StandardTemplate 
      sections={sections} 
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      globals={globals}
    />
  );
} 