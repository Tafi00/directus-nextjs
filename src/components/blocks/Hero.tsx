'use client';

import Tagline from '../ui/Tagline';
import Headline from '@/components/ui/Headline';
import BaseText from '@/components/ui/Text';
import DirectusImage from '@/components/shared/DirectusImage';
import ButtonGroup from '@/components/blocks/ButtonGroup';
import { cn } from '@/lib/utils';
import { setAttr } from '@directus/visual-editing';
import Description from '../ui/Description';

interface HeroProps {
	data: {
		id: string;
		tagline: string;
		headline: string;
		description: string;
		layout: 'image_left' | 'image_center' | 'image_right';
		image?: string;
		desktop_image?: string;
		mobile_image?: string;
		button_group?: {
			id: string;
			buttons: Array<{
				id: string;
				label: string | null;
				variant: string | null;
				url: string | null;
				type: 'url' | 'page' | 'post';
				pagePermalink?: string | null;
				postSlug?: string | null;
			}>;
		};
	};
}

export default function Hero({ data }: HeroProps) {
	const { id, layout, tagline, headline, description, image, desktop_image, mobile_image, button_group } = data;

	return (
		<section
			className={cn(
				'relative w-full mx-auto flex flex-col gap-6 md:gap-12',
				layout === 'image_center'
					? 'items-center text-center'
					: layout === 'image_left'
						? 'md:flex-row-reverse items-center'
						: 'md:flex-row items-center',
			)}
		>
			<div
				className={cn(
					'flex flex-col w-full',
					layout === 'image_center' ? 'w-full items-center' : 'md:w-1/2 items-start',
				)}
			>
				<Headline
					headline={headline}
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: 'headline',
						mode: 'popover',
					})}
				/>
				<Tagline
					tagline={tagline}
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: 'tagline',
						mode: 'popover',
					})}
				/>
				
				{description && (
					<Description
					description={description}
						data-directus={setAttr({
							collection: 'block_hero',
							item: id,
							fields: 'description',
							mode: 'popover',
						})}
						className="mt-4 w-full"
					/>
				)}
				{button_group && button_group.buttons.length > 0 && (
					<div
						className={cn(layout === 'image_center' && 'flex justify-center', 'mt-6')}
						data-directus={setAttr({
							collection: 'block_button_group',
							item: button_group.id,
							fields: 'buttons',
							mode: 'modal',
						})}
					>
						<ButtonGroup buttons={button_group.buttons} />
					</div>
				)}
			</div>
			{(desktop_image || mobile_image || image) && (
				<div
					className={cn(
						'relative w-full',
						layout === 'image_center' ? 'w-full ' : 'md:w-1/2 h-auto',
					)}
					data-directus={setAttr({
						collection: 'block_hero',
						item: id,
						fields: ['image', 'desktop_image', 'mobile_image', 'layout','description','tagline','headline'],
						mode: 'modal',
					})}
				>
					{desktop_image && (
							<DirectusImage
								uuid={desktop_image}
								alt={tagline || headline || 'Hero Image'}
								className="object-contain hidden md:block"
							/>
					)}
					{mobile_image && (
							<DirectusImage
								uuid={mobile_image}
								alt={tagline || headline || 'Hero Image'}
								className="object-contain block md:hidden"
							/>
					)}
					{!desktop_image && !mobile_image && image && (
						<DirectusImage
							uuid={image}
							alt={tagline || headline || 'Hero Image'}
							className="object-contain"
						/>
					)}
				</div>
			)}
		</section>
	);
}
