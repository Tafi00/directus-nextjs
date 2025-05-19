import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BlockCarouselItem } from '@/types/directus-schema';
import DirectusImage from '@/components/shared/DirectusImage';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import modules
import { Navigation, Autoplay, Pagination } from 'swiper/modules';

interface SwiperCarouselProps {
  items: BlockCarouselItem[];
  autoplay?: boolean;
  interval?: number;
  imageRatio?: string | 'auto';
  showPagination?: boolean;
  showArrows?: boolean;
}

const SwiperCarousel = ({
  items,
  autoplay = true,
  interval = 5000,
  imageRatio = '4/3',
  showPagination = false,
  showArrows = true,
}: SwiperCarouselProps) => {
  // Xác định modules cần dùng dựa trên cấu hình
  const swiperModules = [];
  const swiperRef = useRef<any>(null);
  
  if (autoplay) swiperModules.push(Autoplay);
  if (showPagination) swiperModules.push(Pagination);


  return (
    <div className="relative mt-6 w-full">
      <style jsx global>{`
        .custom-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 12px;
        }
        
        .custom-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #ccc;
          opacity: 1;
          margin: 0 5px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .custom-pagination .swiper-pagination-bullet-active {
          background: #333;
          width: 12px;
          height: 12px;
        }
        .custom-pagination{
          height: 14px;
        }
        
        /* Phần style của pagination được giữ nguyên */
      `}</style>
      
      {showArrows && (
        <button
          onClick={() => {
            swiperRef.current?.slidePrev();
          }}
          className="absolute top-1/2 left-6 md:left-4 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}
      
      <Swiper
        modules={swiperModules}
        navigation={false} // Vô hiệu hóa nút navigate mặc định
        pagination={showPagination ? {
          clickable: true,
          el: '.custom-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        } : false}
        slidesPerView={3}
        spaceBetween={16}
        loop={true}
        className="standard-swiper"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        autoplay={
          autoplay
            ? {
                delay: interval,
                disableOnInteraction: false,
              }
            : false
        }
        autoHeight={true}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-lg overflow-hidden cursor-pointer">
              {item.url ? (
                <Link href={item.url} className="block">
                  <div className="relative w-screen md:w-full" style={imageRatio === 'auto' ? {} : { aspectRatio: imageRatio }}>
                    {item.image && (() => {
                      const imageUuid = typeof item.image === 'string' ? item.image : item.image.id;
                      const imageAlt = item.title || `Slide ${index + 1}`;

                      if (imageRatio === 'auto') {
                        const imgWidth = (typeof item.image !== 'string' && item.image.width) ? item.image.width : 1600;
                        const imgHeight = (typeof item.image !== 'string' && item.image.height) ? item.image.height : 900;
                        
                        return (
                          <DirectusImage
                            uuid={imageUuid}
                            alt={imageAlt}
                            width={imgWidth}
                            height={imgHeight}
                            className="w-full h-auto object-contain"
                          />
                        );
                      } else {
                        return (
                          <DirectusImage
                            uuid={imageUuid}
                            alt={imageAlt}
                            className="w-full h-full object-cover"
                          />
                        );
                      }
                    })()}
                  </div>
                </Link>
              ) : (
                item.image && (
                  <div className="relative w-full" style={imageRatio === 'auto' ? {} : { aspectRatio: imageRatio }}>
                    {item.image && (() => {
                      const imageUuid = typeof item.image === 'string' ? item.image : item.image.id;
                      const imageAlt = item.title || `Slide ${index + 1}`;

                      if (imageRatio === 'auto') {
                        const imgWidth = (typeof item.image !== 'string' && item.image.width) ? item.image.width : 1600;
                        const imgHeight = (typeof item.image !== 'string' && item.image.height) ? item.image.height : 900;
                        
                        return (
                          <DirectusImage
                            uuid={imageUuid}
                            alt={imageAlt}
                            width={imgWidth}
                            height={imgHeight}
                            className="w-full h-auto object-contain"
                          />
                        );
                      } else {
                        return (
                          <DirectusImage
                            uuid={imageUuid}
                            alt={imageAlt}
                            className="size-full object-cover"
                          />
                        );
                      }
                    })()}
                  </div>
                )
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {showArrows && (
        <button
          onClick={() => {
            swiperRef.current?.slideNext();
          }}
          className="absolute top-1/2 right-6 md:right-4 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 md:w-6 md:h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}
      
      {/* Container tùy chỉnh cho pagination - chỉ hiển thị khi showPagination = true */}
      {showPagination && <div className="custom-pagination"></div>}
    </div>
  );
};

export default SwiperCarousel; 