import '@/styles/globals.css';
import '@/styles/fonts.css';
import { Montserrat } from 'next/font/google';
const montserrat = Montserrat({
	variable: '--font-montserrat',
	subsets: ['latin'],
});
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ReactNode } from 'react';

export default function RootLayout({ children, permalink }: { children: ReactNode; permalink?: string }) {
	return (
		<html lang="en" className={`${montserrat.variable} font-montserrat antialiased flex flex-col min-h-screen`}>
			<body className={`${montserrat.variable} font-montserrat antialiased flex flex-col min-h-screen`}>
				<main className="flex-grow">{children}</main>
			</body>
		</html>
	);
}
