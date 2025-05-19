'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import { setAttr } from '@directus/visual-editing';

interface HeroSectionProps {
  hero?: {
    id: string;
    desktop_image?: string;
    mobile_image?: string;
    alt_text?: string;
  };
}

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(({ hero }, ref) => {
  const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  const desktopImageUrl = hero?.desktop_image 
    ? `${directusURL}/assets/${hero.desktop_image}` 
    : '/images/main_banner.jpg';
  const mobileImageUrl = hero?.mobile_image 
    ? `${directusURL}/assets/${hero.mobile_image}` 
    : '/images/main_banner_mb.jpg';
  const altText = hero?.alt_text || 'Hero Banner';

  return (
    <div 
      ref={ref}
      className="w-full relative mt-[70px]"
      data-directus={
        hero
          ? setAttr({
              collection: 'global_hero',
              item: hero.id,
              fields: ['desktop_image', 'mobile_image', 'alt'],
              mode: 'modal',
            })
          : undefined
      }
    >
      <Image
        src={desktopImageUrl}
        alt={altText}
        width={1920}
        height={800}
        priority
        className="object-cover w-full hidden md:block"
        unoptimized
      />
      <Image
        src={mobileImageUrl}
        alt={altText}
        width={800}
        height={600}
        priority
        className="object-cover w-full md:hidden"
        unoptimized
      />
    </div>
  );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection; 