import { MetadataRoute } from 'next';
import { fetchPaginatedPosts, fetchPageData } from '@/lib/directus/fetchers';

// Fallback URL if environment variable is not set
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	try {
		// Fetch all published pages
		const homePage = await fetchPageData('/');
		if (!homePage) {
			throw new Error('Home page not found');
		}

		// For simplicity, we'll just include the home page
		// You may want to add more pages by fetching them from Directus
		const pages = [homePage];

		// Fetch all published blog posts (first 100 for simplicity)
		const posts = await fetchPaginatedPosts(100, 1);

		// Create sitemap entries for pages
		const pagesEntries = pages.map((page) => ({
			url: `${siteUrl}${page.permalink}`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 1.0,
		}));

		// Create sitemap entries for blog posts
		const postsEntries = posts.map((post) => ({
			url: `${siteUrl}/blog/${post.slug}`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.8,
		}));

		return [...pagesEntries, ...postsEntries];
	} catch (error) {
		console.error('Error generating sitemap:', error);
		
		// Return a minimal sitemap if there's an error
		return [
			{
				url: siteUrl,
				lastModified: new Date(),
				changeFrequency: 'weekly' as const,
				priority: 1.0,
			},
		];
	}
}
