import { useDirectus } from './directus';
import { readItems, aggregate, readItem, readSingleton, withToken, QueryFilter, createItem, updateItem } from '@directus/sdk';
import { FormData, Page } from './types';

/**
 */
export const fetchPageData = async (permalink: string, postPage = 1) => {
	const { directus, readItems } = useDirectus();

	try {
		const pageData = await directus.request(
			readItems('pages', {
				filter: { permalink: { _eq: permalink } },
				limit: 1,
				fields: [
					"*",
					"posts.post_id.*",
					"modals.modals_id.*",
					"modals.modals_id.*.*",
					"navigations.navigation_id.*",
					"navigations.navigation_id.*.*",
					"global.*",
					"theme.*",
					"theme.*.*",
					"theme.*.*.*",
					"blocks.*",
					"blocks.item.*.*.*" as any,
				  ],
				deep: {
					blocks: { _sort: ['sort'], _filter: { hide_block: { _neq: true } } },
				},
			}),
		);

		if (!pageData.length) {
			throw new Error('Page not found');
		}

		const page = pageData[0];


		return page;
	} catch (error) {
		console.error('Error fetching page data:', error);
		throw new Error('Failed to fetch page data');
	}
};

export const fetchModalData = async () => {
	const { directus, readItems } = useDirectus();

	try {
		const modalData = await directus.request(
			readItems('modals' as any, {
				fields: [
					"*",
				],
			}),
		);

		if (!modalData.length) {
			throw new Error('Modal not found');
		}

		const modals = modalData;


		return modals;
	} catch (error) {
		console.error('Error fetching modal data:', error);
		throw new Error('Failed to fetch modal data');
	}
};
/**
 * Fetches global site data, header navigation, and footer navigation.
 */
/**
 * Creates a new form submission entry in the pages collection with a many-to-many relationship
 * Uses the current page's permalink to find the correct page to update
 */
export const createFormSubmission = async (data: {
	name: string;
	phone: string;
	form_id: string;
	useragent: string;
	permalink: string; // Added permalink to identify the page
}) => {
	const { directus } = useDirectus();

	try {
		// First, find the page by permalink
		const pages = await directus.request(
			readItems('pages', {
				filter: { permalink: { _eq: data.permalink } },
				limit: 1,
				fields: ['id']
			})
		);

		if (!pages || pages.length === 0) {
			throw new Error(`Page with permalink '${data.permalink}' not found`);
		}

		const pageId = pages[0].id;

		try {
			// First, create a form data entry in the appropriate collection
			// We're using 'as any' to bypass TypeScript's strict checking since we're working with a dynamic schema
			console.log('Creating form data with:', {
				name: data.name,
				phone: data.phone,
				form_id: data.form_id,
				useragent: data.useragent
			});
			
			// Based on the curl example, we need to structure the data correctly
			// The form data should be nested within a form_id object
			const submission = await directus.request(
				updateItem('pages', pageId, {
					// Add form data directly to the page using the correct structure
					form: {
						create: [
							{
								// The form_id is an object containing the form data
								form_id: {
									name: data.name,
									phone: data.phone,
									form_id: data.form_id,
									useragent: data.useragent
								}
							}
						],
						update: [],
						delete: []
					}
				} as any)
			);
			
			console.log('Form submission result:', submission);
			
			return submission;
		} catch (formError: any) {
			console.error('Error in form data creation/connection:', formError);
			throw new Error(`Form data operation failed: ${formError?.message || String(formError)}`);
		}
	} catch (error: any) {
		console.error('Error updating page with form data:', error);
		throw new Error(`Failed to update page with form data: ${error?.message || String(error)}`);
	}
};

/**
 * Fetches only the theme.header and theme.body for a page with the specified permalink
 * @param permalink - The permalink of the page to fetch theme data for
 */
export const fetchPageTheme = async (permalink: string) => {
	const { directus } = useDirectus();

	try {
		const pageData = await directus.request(
			readItems('pages', {
				filter: { permalink: { _eq: permalink } },
				limit: 1,
				fields: [
					"id",
					"theme.*" as any
				],
			}),
		);

		if (!pageData.length) {
			throw new Error('Page not found');
		}

		return pageData[0];
	} catch (error) {
		console.error('Error fetching page theme data:', error);
		throw new Error('Failed to fetch page theme data');
	}
};

export const fetchSiteData = async () => {
	const { directus } = useDirectus();

	try {
		const [globals, headerNavigation, footerNavigation] = await Promise.all([
			directus.request(
				readSingleton('globals', {
					fields: ['*','hero.*', 'footer.*', 'register_form.*', 'register_form.buttons.*' as any],
				}),
			),
			directus.request(
				readItem('navigation', 'main', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								{
									page: ['permalink'],
									children: ['id', 'title', 'url', { page: ['permalink'] }],
								},
							],
						},
					],
					deep: { items: { _sort: ['sort'] } },
				}),
			),
			directus.request(
				readItem('navigation', 'footer', {
					fields: [
						'id',
						'title',
						{
							items: [
								'id',
								'title',
								{
									page: ['permalink'],
									children: ['id', 'title', 'url', { page: ['permalink'] }],
								},
							],
						},
					],
				}),
			),
		]);

		return { globals, headerNavigation, footerNavigation };
	} catch (error) {
		console.error('Error fetching site data:', error);
		throw new Error('Failed to fetch site data');
	}
};

