import { PageBlock } from '@/types/directus-schema';
import StandardTemplate from './StandardTemplate';

interface TemplateManagerProps {
  sections: PageBlock[];
  headerNavigation?: any;
  footerNavigation?: any;
  globals?: any;
  theme?: any;
}

export default function TemplateManager({ 
  sections, 
  headerNavigation, 
  footerNavigation, 
  globals,
  theme
}: TemplateManagerProps) {
  // Chỉ sử dụng StandardTemplate và truyền toàn bộ props cần thiết
  return (
    <StandardTemplate 
      sections={sections} 
      headerNavigation={headerNavigation}
      footerNavigation={footerNavigation}
      globals={globals}
      theme={theme}
    />
  );
} 