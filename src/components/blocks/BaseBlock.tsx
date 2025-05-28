'use client';

import RichText from '@/components/blocks/RichText';
import Hero from '@/components/blocks/Hero';
import Gallery from '@/components/blocks/Gallery';
import Pricing from '@/components/blocks/Pricing';
import InfoBox from '@/components/blocks/InfoBox';
import InfoGroup from '@/components/blocks/InfoGroup';
import Carousel from '@/components/blocks/Carousel';
import Posts from '@/components/blocks/Posts';

interface BaseBlockProps {
	block: {
		collection: string;
		item: any;
		id: string;
	};
	posts?: any[];
	pageId?: string;
}

const BaseBlock = ({ block, posts, pageId }: BaseBlockProps) => {
	const components: Record<string, React.ElementType> = {
		block_hero: Hero,
		block_richtext: RichText,
		block_gallery: Gallery,
		block_pricing: Pricing,
		block_infobox: InfoBox,
		block_info_group: InfoGroup,
		block_carousel: Carousel,
		block_posts: Posts,
	};

	const Component = components[block.collection];

	if (!Component) {
		return null;
	}
	const itemId = block.item?.id;

	return (
		<Component
			posts={block.collection == 'block_posts' ? posts : undefined}
			data={block.item}
			blockId={block.id}
			itemId={itemId}
			pageId={pageId}
		/>
	);
};

export default BaseBlock;
