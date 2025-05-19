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

export default function VisualEditingLayout({
	headerNavigation,
	footerNavigation,
	globals,
	children,
}: VisualEditingLayoutProps) {
	const { isVisualEditingEnabled, apply } = useVisualEditing();
	const router = useRouter();

	return (
		<>
			{children}
		</>
	);
}
