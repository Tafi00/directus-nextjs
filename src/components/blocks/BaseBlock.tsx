'use client';

import RichText from '@/components/blocks/RichText';
import Hero from '@/components/blocks/Hero';
import Gallery from '@/components/blocks/Gallery';
import Pricing from '@/components/blocks/Pricing';
import Form from '@/components/blocks/Form';
import InfoBox from '@/components/blocks/InfoBox';
import InfoGroup from '@/components/blocks/InfoGroup';
import Carousel from '@/components/blocks/Carousel';

interface BaseBlockProps {
	block: {
		collection: string;
		item: any;
		id: string;
	};
}

const BaseBlock = ({ block }: BaseBlockProps) => {
	const components: Record<string, React.ElementType> = {
		block_hero: Hero,
		block_richtext: RichText,
		block_gallery: Gallery,
		block_pricing: Pricing,
		block_form: Form,
		block_infobox: InfoBox,
		block_info_group: InfoGroup,
		block_carousel: Carousel,
	};

	const Component = components[block.collection];

	if (!Component) {
		return null;
	}
	const itemId = block.item?.id;

	return <Component data={block.item} blockId={block.id} itemId={itemId} />;
};

export default BaseBlock;
