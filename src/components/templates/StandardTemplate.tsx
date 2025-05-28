'use client';

import { useEffect, useRef, useState } from 'react';
import { PageBlock } from '@/types/directus-schema';
import PageBuilder from '@/components/layout/PageBuilder';
import NavigationBar from '@/components/layout/NavigationBar';
import Footer from '@/components/layout/Footer';
import { useVisualEditing } from '@/hooks/useVisualEditing';
import { useRouter } from 'next/navigation';
import BottomBar from '@/components/layout/BottomBar';
import RegisterForm from '@/components/forms/RegisterForm';
import HeroSection from '@/components/blocks/HeroSection';

interface StandardTemplateProps {
	sections: PageBlock[];
	headerNavigation?: any;
	footerNavigation?: any;
	globals?: any;
	theme?: any;
	modalData?: any;
	posts?: any;
	pageId?: string;
}

export default function StandardTemplate({
	sections,
	headerNavigation,
	globals,
	theme,
	modalData,
	posts,
	pageId,
}: StandardTemplateProps) {
	const navRef = useRef<HTMLElement>(null);
	const footerRef = useRef<HTMLDivElement>(null);
	const heroRef = useRef<HTMLDivElement>(null);
	const registerFormRef = useRef<HTMLDivElement>(null);
	const { isVisualEditingEnabled, apply } = useVisualEditing();
	const router = useRouter();

	useEffect(() => {
		if (isVisualEditingEnabled) {
			// Apply visual editing for the navigation bar if its ref is set.
			if (navRef.current) {
				apply({
					elements: [navRef.current],
					onSaved: () => router.refresh(),
				});
			}
			// Apply visual editing for the hero section if its ref is set.
			if (heroRef.current) {
				apply({
					elements: [heroRef.current],
					onSaved: () => router.refresh(),
				});
			}
			// Apply visual editing for the footer if its ref is set.
			if (footerRef.current) {
				apply({
					elements: [footerRef.current],
					onSaved: () => router.refresh(),
				});
			}
			// Apply visual editing for the register form if its ref is set.
			if (registerFormRef.current) {
				apply({
					elements: [registerFormRef.current],
					onSaved: () => router.refresh(),
				});
			}
		}
	}, [isVisualEditingEnabled, apply, router]);

	return (
		<div className="min-h-screen w-screen md:w-full flex flex-col bg-background">
			{/* Header với NavigationBar */}
			{headerNavigation && globals && <NavigationBar ref={navRef} navigation={headerNavigation} globals={globals} />}

			{/* Hero Section - Sử dụng theme.hero thay vì globals.hero */}
			{theme && theme.hero && <HeroSection ref={heroRef} hero={theme.hero} />}

			{/* Nội dung chính */}
			<main className="py-8 sm:py-12 lg:py-16 mx-auto">
				<div className="md:flex gap-6 lg:gap-8">
					{/* Left Column - Project Content */}
					<div className="w-screen lg:w-[60vw]">
						<PageBuilder sections={sections} posts={posts} pageId={pageId} />
					</div>

					{/* Right Column - Sticky Form - Sử dụng theme.register_form thay vì globals.register_form */}
					<div className="hidden lg:block lg:sticky lg:top-[80px] h-fit">
						{theme && theme.register_form && <RegisterForm ref={registerFormRef} theme={theme} modalData={modalData} />}
					</div>
				</div>
			</main>

			{/* Footer - Sử dụng theme.footer thay vì globals.footer */}
			{theme && theme.footer && <Footer ref={footerRef} footer={theme.footer} />}

			{/* BottomBar cho mobile */}
			<BottomBar />
		</div>
	);
}
