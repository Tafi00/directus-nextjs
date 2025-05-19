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
}

export default function StandardTemplate({ 
  sections, 
  headerNavigation, 
  footerNavigation, 
  globals
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

  // Debug logs for registerForm
  console.log('Global object in StandardTemplate:', globals);
  console.log('Register Form object:', globals?.register_form);

  return (
    <div className="min-h-screen w-screen md:w-full flex flex-col bg-[#FEFBF2]">
      {/* Header với NavigationBar */}
      {headerNavigation && globals && (
        <NavigationBar ref={navRef} navigation={headerNavigation} globals={globals} />
      )}

      {/* Hero Section */}
      {globals && globals.hero && (
        <HeroSection ref={heroRef} hero={globals.hero} />
      )}

      {/* Nội dung chính */}
      <main className="py-8 sm:py-12 lg:py-16 mx-auto">
        <div className="md:flex gap-6 lg:gap-8">
          {/* Left Column - Project Content */}
          <div className="w-screen lg:w-[60vw]">
            <PageBuilder sections={sections} />
          </div>

          {/* Right Column - Sticky Form */}
          <div className="hidden lg:block lg:sticky lg:top-[80px] h-fit">
            {globals && globals.register_form && (
              <RegisterForm ref={registerFormRef} registerForm={globals.register_form} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      {footerNavigation && globals && globals.footer && (
        <Footer ref={footerRef} footer={globals.footer} />
      )}

      {/* BottomBar cho mobile */}
      <BottomBar />
    </div>
  );
} 