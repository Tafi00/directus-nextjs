'use client';

import { useEffect, useState, useRef } from 'react';
import { BlockCarouselItem } from '@/types/directus-schema';
import Tagline from '@/components/ui/Tagline';
import Headline from '@/components/ui/Headline';
import Description from '@/components/ui/Description';
import { setAttr } from '@directus/visual-editing';
import SwiperCarousel from './carousel-styles/SwiperCarousel';
import CoverflowCarousel from './carousel-styles/CoverflowCarousel';
import CardsV2Carousel from './carousel-styles/CardsV2Carousel';

interface CarouselProps {
  data: {
    id: string;
    tagline?: string | null;
    headline?: string | null;
    description?: string | null;
    autoplay?: boolean | null;
    interval?: number | null;
    image_ratio?: string | null;
    show_pagination?: boolean | null;
    show_arrows?: boolean | null;
    style?: string | null;
    carousel_items?: BlockCarouselItem[];
  };
  blockId: string;
  itemId?: string;
}

const Carousel = ({ data, blockId }: CarouselProps) => {
  const { 
    id, 
    tagline, 
    headline, 
    description,
    autoplay = true, 
    interval = 5000,
    image_ratio = '4/3',
    show_pagination = false,
    show_arrows = true,
    style = 'standard',
    carousel_items = [] 
  } = data;
  

  
  const carouselRef = useRef<HTMLDivElement>(null);

  const sortedItems = carousel_items
    ? [...carousel_items].sort((a, b) => {
        return (a.sort || 0) - (b.sort || 0);
      })
    : [];


  if (sortedItems.length === 0) {
    return null;
  }

  return (
    <div id={blockId} className="w-full">
      <div className="container mx-auto">
        
        
        {headline && (
          <Headline
            headline={headline}
            data-directus={setAttr({
              collection: 'block_carousel',
              item: id,
              fields: 'headline',
              mode: 'popover',
            })}
          />
        )}
        {tagline && (
          <Tagline
            tagline={tagline}
            data-directus={setAttr({
              collection: 'block_carousel',
              item: id,
              fields: 'tagline',
              mode: 'popover',
            })}
          />
        )}
        {description && (
          <Description
            description={description}
            data-directus={setAttr({
              collection: 'block_carousel',
              item: id,
              fields: 'description',
              mode: 'popover',
            })}
            className="mt-4"
          />
        )}
        <div 
          ref={carouselRef}
          className="mt-8 relative"
          data-directus={setAttr({
            collection: 'block_carousel',
            item: id,
            fields: ['tagline', 'headline', 'description', 'carousel_items', 'autoplay', 'interval', 'image_ratio', 'show_pagination', 'show_arrows', 'style'],
            mode: 'modal',
          })}
        >
          {style === 'coverflow' ? (
            <CoverflowCarousel 
              items={sortedItems}
              autoplay={!!autoplay}
              interval={interval || 5000}
              imageRatio={image_ratio || '4/3'}
              showPagination={!!show_pagination}
              showArrows={!!show_arrows}
            />
          ) : style === 'cards_v2' ? (
            <CardsV2Carousel 
              items={sortedItems}
              autoplay={!!autoplay}
              interval={interval || 5000}
              imageRatio={image_ratio || '4/3'}
              showPagination={!!show_pagination}
              showArrows={!!show_arrows}
            />
          ) : (
            <SwiperCarousel 
              items={sortedItems}
              autoplay={!!autoplay}
              interval={interval || 5000}
              imageRatio={image_ratio || '4/3'}
              showPagination={!!show_pagination}
              showArrows={!!show_arrows}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Carousel; 