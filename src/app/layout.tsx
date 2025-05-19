import '@/styles/globals.css';
import '@/styles/fonts.css';
import { Montserrat } from "next/font/google";


const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
  });
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ReactNode } from 'react';
import { Metadata } from 'next';

import VisualEditingLayout from '@/components/layout/VisualEditingLayout';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { fetchSiteData } from '@/lib/directus/fetchers';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';

export async function generateMetadata(): Promise<Metadata> {
	const { globals } = await fetchSiteData();

	const siteTitle = globals?.title || 'Simple CMS';
	const siteDescription = globals?.description || 'A starter CMS template powered by Next.js and Directus.';
	const faviconURL = globals?.favicon ? getDirectusAssetURL(globals.favicon) : '/favicon.ico';

	return {
		title: {
			default: siteTitle,
			template: `%s | ${siteTitle}`,
		},
		description: siteDescription,
		icons: {
			icon: faviconURL,
		},
	};
}

export default async function RootLayout({ children }: { children: ReactNode }) {
	const { globals, headerNavigation, footerNavigation } = await fetchSiteData();
	const accentColor = globals?.accent_color || '#6644ff';

	return (
		<html lang="en" style={{ '--accent-color': accentColor } as React.CSSProperties} suppressHydrationWarning>
			<body className={`${montserrat.variable} font-montserrat antialiased flex flex-col min-h-screen`}>
				<ThemeProvider>
					<VisualEditingLayout
						headerNavigation={headerNavigation}
						footerNavigation={footerNavigation}
						globals={globals}
					>
						<main className="flex-grow">{children}</main>
					</VisualEditingLayout>
				</ThemeProvider>
			</body>
		</html>
	);
}
