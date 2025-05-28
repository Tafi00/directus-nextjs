import { fetchPageData, fetchModalData } from '@/lib/directus/fetchers';
import { PageBlock } from '@/types/directus-schema';
import { notFound } from 'next/navigation';
import PageClient from './PageClient';
import { Metadata } from 'next';

// Fallback URL if environment variable is not set
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export async function generateMetadata({ params }: { params: Promise<{ permalink?: string[] }> }) {
	const { permalink } = await params;
	const permalinkSegments = permalink || [];
	const resolvedPermalink = permalinkSegments.join('/') || '/';

	try {
		const page = await fetchPageData(resolvedPermalink);

		if (!page) return;

		// Create base metadata
		const metadata: Metadata = {
			title: page.seo?.title ?? page.title ?? '',
			description: page.seo?.meta_description ?? '',
			openGraph: {
				title: page.seo?.title ?? page.title ?? '',
				description: page.seo?.meta_description ?? '',
				url: `${siteUrl}/${resolvedPermalink === '/' ? '' : resolvedPermalink}`,
				type: 'website',
			},
		};

		// Add custom header code if available
		if ((page as any).theme?.header) {
			// @ts-ignore - Adding custom head property
			metadata.head = {
				// This allows us to inject custom HTML into the head
				custom: (page as any).theme.header,
			};
		}

		return metadata;
	} catch (error) {
		console.error('Error loading page metadata:', error);

		return;
	}
}

export default async function Page({ params }: { params: Promise<{ permalink?: string[] }> }) {
	const { permalink } = await params;
	const permalinkSegments = permalink || [];
	const resolvedPermalink = permalinkSegments.join('/') || '/';

	let page;
	try {
		page = await fetchPageData(resolvedPermalink);
	} catch (error) {
		console.error('Error loading page or modal data:', error);
	}

	if (!page || !page.blocks) {
		notFound();
	}

	const blocks: PageBlock[] = page.blocks.filter(
		(block: any): block is PageBlock => typeof block === 'object' && block.collection,
	);

	const navigations = page.navigations;

	const headerNavigation = navigations.find(
		(navigation: any) => navigation.navigation_id && navigation.navigation_id.id === 'main',
	)?.navigation_id;

	const footerNavigation = navigations.find(
		(navigation: any) => navigation.navigation_id && navigation.navigation_id.id === 'footer',
	)?.navigation_id;

	const theme = (page as any).theme;
	const modalData = (page as any).modals.map((modal: any) => modal.modals_id);
	const posts = (page as any).posts
		.filter((post: any) => post.post_id?.visible === true)
		.map((post: any) => post.post_id);

	return (
		<>
			{/* Body scripts from theme */}
			{theme?.header && (
				<script
					dangerouslySetInnerHTML={{
						__html: theme.header.replace(/<script>|<\/script>/g, ''),
					}}
				/>
			)}
			<PageClient
				sections={blocks}
				pageId={page.id}
				headerNavigation={headerNavigation}
				footerNavigation={footerNavigation}
				globals={page.global}
				theme={theme}
				modalData={modalData}
				posts={posts}
			/>
			{/* Body scripts from theme */}
			{theme?.body && (
				<script
					dangerouslySetInnerHTML={{
						__html: theme.body.replace(/<script>|<\/script>/g, ''),
					}}
				/>
			)}
		</>
	);
}
