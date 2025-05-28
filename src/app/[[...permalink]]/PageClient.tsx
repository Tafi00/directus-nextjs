'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVisualEditing } from '@/hooks/useVisualEditing';
import { PageBlock } from '@/types/directus-schema';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { setAttr } from '@directus/visual-editing';
import TemplateManager from '@/components/templates/TemplateManager';
import ScriptInjector from '@/components/ScriptInjector';

interface PageClientProps {
	sections: PageBlock[];
	pageId?: string;
	template?: string | null;
	headerNavigation?: any;
	footerNavigation?: any;
	globals?: any;
	theme?: any;
	modalData?: any;
	posts?: any[];
}

interface VisualEditingOptions {
	customClass?: string;
	onSaved?: () => void;
}

export default function PageClient({
	sections,
	pageId,
	headerNavigation,
	footerNavigation,
	globals,
	theme,
	modalData,
	posts,
}: PageClientProps) {
	const { isVisualEditingEnabled, apply } = useVisualEditing();
	const router = useRouter();

	useEffect(() => {
		if (isVisualEditingEnabled) {
			apply({
				onSaved: () => {
					router.refresh();
				},
			} as VisualEditingOptions);

			apply({
				elements: document.querySelector('#visual-editing-button') as HTMLElement,
				customClass: 'visual-editing-button-class',
				onSaved: () => {
					router.refresh();
				},
			} as VisualEditingOptions);
		}
	}, [isVisualEditingEnabled, apply, router]);

	// Render based on template using TemplateManager
	const renderTemplate = () => {
		return (
			<TemplateManager
				sections={sections}
				headerNavigation={headerNavigation}
				footerNavigation={footerNavigation}
				globals={globals}
				theme={theme}
				modalData={modalData}
				posts={posts}
				pageId={pageId}
			/>
		);
	};
	const primaryColor = theme?.primary || '#0C5B3E';
	const secondaryColor = theme?.secondary || '#D4A437';
	const contentColor = theme?.content || '#141414';
	const backgroundColor = theme?.background || '#FEFBF2';

	// Add the ScriptInjector component to inject code into head and body
	return (
		<>
			<div
				className="relative"
				style={
					{
						'--primary-color': primaryColor,
						'--secondary-color': secondaryColor,
						'--content-color': contentColor,
						'--background-color': backgroundColor,
					} as React.CSSProperties
				}
				suppressHydrationWarning
			>
				{renderTemplate()}

				{isVisualEditingEnabled && pageId && (
					<div className="fixed z-50 w-full bottom-4 inset-x-0 p-4 flex justify-center items-center gap-2">
						{/* If you're not using the visual editor it's safe to remove this element. Just a helper to let editors add edit / add new blocks to a page. */}
						<Button
							id="visual-editing-button"
							variant="secondary"
							className="visual-editing-button-class"
							data-directus={setAttr({
								collection: 'pages',
								item: pageId,
								fields: ['global', 'theme', 'modals', 'blocks', 'meta_m2a_button'],
								mode: 'modal',
							})}
						>
							<Pencil className="size-4 mr-2" />
							Edit All Blocks
						</Button>
					</div>
				)}
			</div>
			<style jsx global>{`
				/* Safe to remove this if you're not using the visual editor. */
				.directus-visual-editing-overlay.visual-editing-button-class .directus-visual-editing-edit-button {
					position: absolute;
					inset: 0;
					width: 100%;
					height: 100%;
					transform: none;
					background: transparent;
				}
			`}</style>
			{theme?.css && <style>{theme?.css}</style>}
		</>
	);
}
