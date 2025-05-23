'use client';

import { useState, useEffect, forwardRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { setAttr } from '@directus/visual-editing';

interface NavigationBarProps {
	navigation: any;
	globals: any;
}

interface NavigationItem {
	id: string;
	title: string;
	url?: string;
	type?: string; // thêm type để xác định loại mục (ví dụ: 'section')
	section_id?: string; // thêm section_id để dùng cho scroll tới section
	page?: {
		permalink?: string;
	};
	children?: NavigationItem[];
}

const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(({ navigation, globals }, ref) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();
	const isHomePage = pathname === '/';

	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
	const lightLogoUrl = globals?.logo ? `${directusURL}/assets/${globals.logo}` : '/images/logo.svg';
	const darkLogoUrl = globals?.logo_dark_mode ? `${directusURL}/assets/${globals.logo_dark_mode}` : '';

	// Ngăn scroll khi menu mở
	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isMenuOpen]);

	const handleScroll = (e: React.MouseEvent, id: string): void => {
		e.preventDefault();

		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
			setIsMenuOpen(false);
		}
	};

	// Kiểm tra và cuộn đến phần được chỉ định sau khi trang chủ được tải
	useEffect(() => {
		if (isHomePage) {
			const scrollToId = sessionStorage.getItem('scrollToId');
			if (scrollToId) {
				// Sử dụng requestAnimationFrame để đảm bảo rằng DOM đã sẵn sàng
				const scrollToElement = (): void => {
					const element = document.getElementById(scrollToId);
					if (element) {
						// Cuộn ngay lập tức để giảm độ trễ cảm nhận
						element.scrollIntoView({ behavior: 'smooth', block: 'start' });
						// Xóa item sau khi đã sử dụng
						sessionStorage.removeItem('scrollToId');
						// Xóa hash khỏi URL
						if (window.history && window.history.replaceState) {
							window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
						}
					} else {
						// Nếu element chưa tồn tại, thử lại sau một thời gian ngắn
						setTimeout(scrollToElement, 100);
					}
				};

				// Kiểm tra nếu DOM đã sẵn sàng hoặc đăng ký sự kiện load nếu chưa
				if (document.readyState === 'complete' || document.readyState === 'interactive') {
					scrollToElement();
				} else {
					window.addEventListener('DOMContentLoaded', scrollToElement);
					// Đề phòng sự kiện DOMContentLoaded đã kích hoạt
					setTimeout(scrollToElement, 100);
				}
			}
		}
	}, [isHomePage]);

	const handleLogoClick = (e: React.MouseEvent): void => {
		if (!isHomePage) {
			e.preventDefault();
			window.location.href = '/';
		}
	};

	// Hàm để xử lý permalink
	const formatPermalink = (
		permalink?: string,
		url?: string,
		type?: string,
		sectionId?: string,
		pathname?: string,
	): string => {
		if (!permalink && !url) return '#';

		// Nếu là URL hoặc permalink bắt đầu bằng # hoặc /, trả về nguyên gốc
		if (url) return url;
		if (permalink?.startsWith('#') || permalink?.startsWith('/')) return permalink;

		// Nếu type là section thì giữ nguyên pathname hiện tại và chỉ nối #id-section
		if (type === 'section' && sectionId && pathname) {
			return `${pathname}#${sectionId}`;
		}

		// Nếu permalink không bắt đầu bằng /, thêm / vào đầu
		return `/${permalink}`;
	};

	return (
		<nav ref={ref} className="w-full border-b fixed top-0 bg-background z-50">
			<div
				className={`container-width flex items-center h-[70px] relative px-4 transition-all duration-300 ${
					isMenuOpen ? 'bg-transparent' : 'bg-background'
				}`}
			>
				{/* Logo - Hidden on Mobile */}
				<div className="hidden md:block">
					<Link href="/" onClick={handleLogoClick}>
						<Image
							data-directus={setAttr({
								collection: 'globals',
								item: globals.id,
								fields: ['logo'],
								mode: 'modal',
							})}
							src={lightLogoUrl}
							alt="Logo"
							width={160}
							height={49}
							priority
							className="h-[60px] w-auto transition-transform duration-300 hover:scale-105 dark:hidden"
							unoptimized
						/>
						{darkLogoUrl && (
							<Image
								data-directus={setAttr({
									collection: 'globals',
									item: globals.id,
									fields: ['logo_dark_mode'],
									mode: 'modal',
								})}
								src={darkLogoUrl}
								alt="Logo (Dark Mode)"
								width={160}
								height={49}
								priority
								className="h-[60px] w-auto transition-transform duration-300 hover:scale-105 hidden dark:block"
								unoptimized
							/>
						)}
					</Link>
				</div>

				{/* Mobile Menu Button and Center Logo Container */}
				<div className="flex-1 md:flex-none flex justify-between items-center md:hidden">
					<button
						className="p-2 flex flex-col items-center justify-center w-8 h-8 relative z-50"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<div
							className={`w-6 h-0.5 bg-primary absolute transition-all duration-500 ${
								isMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
							}`}
						></div>
						<div
							className={`w-6 h-0.5 bg-primary absolute transition-all duration-500 ${
								isMenuOpen ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
							}`}
						></div>
						<div
							className={`w-6 h-0.5 bg-primary absolute transition-all duration-500 ${
								isMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
							}`}
						></div>
					</button>
					{/* Mobile Logo */}
					<div className="absolute left-1/2 -translate-x-1/2 md:hidden">
						<Link href="/" onClick={handleLogoClick}>
							<Image
								data-directus={setAttr({
									collection: 'globals',
									item: globals.id,
									fields: ['logo'],
									mode: 'modal',
								})}
								src={lightLogoUrl}
								alt="Logo"
								width={160}
								height={49}
								priority
								className="h-[60px] w-auto transition-transform duration-300 hover:scale-105 dark:hidden"
								unoptimized
							/>
							{darkLogoUrl && (
								<Image
									data-directus={setAttr({
										collection: 'globals',
										item: globals.id,
										fields: ['logo_dark_mode'],
										mode: 'modal',
									})}
									src={darkLogoUrl}
									alt="Logo (Dark Mode)"
									width={160}
									height={49}
									priority
									className="h-[60px] w-auto transition-transform duration-300 hover:scale-105 hidden dark:block"
									unoptimized
								/>
							)}
						</Link>
					</div>
					<div className="w-8"></div> {/* Spacer for mobile layout balance */}
				</div>

				{/* Desktop Menu */}
				<div
					className="hidden md:flex gap-4 md:gap-6 xl:gap-8 ml-auto"
					data-directus={
						navigation
							? setAttr({
									collection: 'navigation',
									item: navigation.id,
									fields: ['items'],
									mode: 'modal',
								})
							: undefined
					}
				>
					{navigation?.items?.map((item: NavigationItem) => {
						const isSection = item.type === 'section' && item.section_id;
						const href = isSection ? `${pathname}#${item.section_id}` : formatPermalink(item.page?.permalink, item.url);
						return (
							<a
								key={item.id}
								href={href}
								className="nav-link relative group py-2"
								onClick={(e) => {
									if (isSection) {
										e.preventDefault();
										handleScroll(e, item.section_id!);
									}
								}}
							>
								{item.title}
								<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
							</a>
						);
					})}
				</div>
			</div>

			{/* Mobile Menu - Full Screen */}
			<div
				className={`fixed inset-0 bg-white z-40 transition-all duration-500 ${
					isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
				}`}
			>
				<div className="container-width h-screen flex flex-col items-center px-6">
					{/* Logo section */}
					<div className="h-[70px]"></div> {/* Spacing for navbar */}
					{/* Menu Items Container */}
					<div className="flex-1 flex flex-col justify-center items-center gap-8 -mt-[150px]">
						{navigation?.items?.map((item: NavigationItem, index: number) => (
							<a
								key={item.id}
								href={formatPermalink(item.page?.permalink, item.url)}
								className={`nav-link text-2xl font-medium transform transition-all duration-500 
									hover:text-primary hover:scale-110 hover:-translate-y-1
									${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
								`}
								style={{
									transitionDelay: `${index * 100}ms`,
									animation: isMenuOpen ? `fadeInUp 0.5s ease forwards ${index * 100}ms` : 'none',
								}}
								onClick={(e) => {
									// If URL starts with #, handle as scroll anchor
									const href = formatPermalink(item.page?.permalink, item.url);
									if (href.startsWith('#')) {
										const id = href.slice(1);
										handleScroll(e, id);
									} else {
										setIsMenuOpen(false);
									}
								}}
							>
								{item.title}
							</a>
						))}
					</div>
					{/* Bottom Space */}
					<div className="h-[70px]"></div>
				</div>

				{/* Background Pattern - Optional */}
				<div className="absolute inset-0 opacity-5 pointer-events-none">
					<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-100 to-transparent"></div>
				</div>
			</div>
		</nav>
	);
});

NavigationBar.displayName = 'NavigationBar';
export default NavigationBar;
