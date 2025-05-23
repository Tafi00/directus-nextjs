'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { useVisualEditing } from '@/hooks/useVisualEditing';
import { useRouter } from 'next/navigation';

interface VisualEditingLayoutProps {
	headerNavigation: any;
	footerNavigation: any;
	globals: any;
	children: ReactNode;
}

export default function VisualEditingLayout({ children }: VisualEditingLayoutProps) {
	return <>{children}</>;
}
