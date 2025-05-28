import { PageBlock } from '@/types/directus-schema';
import BaseBlock from '@/components/blocks/BaseBlock';
import Container from '@/components/ui/container';

interface PageBuilderProps {
	sections: PageBlock[];
	posts?: any[];
	pageId?: string;
}

const PageBuilder = ({ sections, posts, pageId }: PageBuilderProps) => {
	const validBlocks = sections.filter(
		(block): block is PageBlock & { collection: string; item: object } =>
			typeof block.collection === 'string' && !!block.item && typeof block.item === 'object',
	);
	return (
		<div>
			{validBlocks.map((block: any) => (
				<section id={block.section_id} key={block.id} data-background={block.background} className="pb-8">
					<Container>
						<BaseBlock
							block={{
								collection: block.collection,
								item: block.item,
								id: block.id,
							}}
							posts={posts}
							pageId={pageId}
						/>
					</Container>
				</section>
			))}
		</div>
	);
};

export default PageBuilder;
