import { fetchPageData, fetchSiteData } from '@/lib/directus/fetchers';
import { PageBlock } from '@/types/directus-schema';
import { notFound } from 'next/navigation';
import PageClient from './PageClient';

// Fallback URL if environment variable is not set
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export async function generateMetadata({ params }: { params: Promise<{ permalink?: string[] }> }) {
	const { permalink } = await params;
	const permalinkSegments = permalink || [];
	const resolvedPermalink = `/${permalinkSegments.join('/')}`.replace(/\/$/, '') || '/';

	try {
		const page = await fetchPageData(resolvedPermalink);

		if (!page) return;

		return {
			title: page.seo?.title ?? page.title ?? '',
			description: page.seo?.meta_description ?? '',
			openGraph: {
				title: page.seo?.title ?? page.title ?? '',
				description: page.seo?.meta_description ?? '',
				url: `${siteUrl}${resolvedPermalink}`,
				type: 'website',
			},
		};
	} catch (error) {
		console.error('Error loading page metadata:', error);

		return;
	}
}

export default async function Page({ params }: { params: Promise<{ permalink?: string[] }> }) {
	const { permalink } = await params;
	const permalinkSegments = permalink || [];
	const resolvedPermalink = `/${permalinkSegments.join('/')}`.replace(/\/$/, '') || '/';

	let page;
	let siteData;
	
	try {
		[page, siteData] = await Promise.all([
			fetchPageData(resolvedPermalink),
			fetchSiteData()
		]);
	} catch (error) {
		console.error('Error loading page:', error);
	}

	if (!page || !page.blocks) {
		notFound();
	}

	const blocks: PageBlock[] = page.blocks.filter(
		(block: any): block is PageBlock => typeof block === 'object' && block.collection,
	);

	const { globals, headerNavigation, footerNavigation } = siteData || {};

	return (
		<PageClient 
			sections={blocks} 
			pageId={page.id} 
			template={page.template}
			headerNavigation={headerNavigation}
			footerNavigation={footerNavigation}
			globals={globals}
		/>
	);
}
