'use client';

import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BlockCarouselItem } from '@/types/directus-schema';
import DirectusImage from '@/components/shared/DirectusImage';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// Import modules
import {
  Autoplay,
  Pagination,
  EffectCoverflow,
} from 'swiper/modules';

interface CoverflowCarouselProps {
  items: BlockCarouselItem[];
  autoplay?: boolean;
  interval?: number;
  imageRatio?: string | 'auto';
  showPagination?: boolean;
  showArrows?: boolean;
}

const CoverflowCarousel = ({
  items,
  autoplay = true,
  interval = 5000,
  imageRatio = '1/1',
  showPagination = false,
  showArrows = true,
}: CoverflowCarouselProps) => {
  const swiperRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const swiperContainerRef = useRef<HTMLDivElement>(null);

  // Kiểm tra kích thước màn hình để xác định mobile hay desktop
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Kiểm tra khi component được mount
    checkIfMobile();

    // Theo dõi sự thay đổi kích thước màn hình
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Xác định modules cần dùng dựa trên cấu hình
  const swiperModules = [EffectCoverflow];
  if (showPagination) swiperModules.push(Pagination);
  if (autoplay) swiperModules.push(Autoplay);

  return (
    <div className="relative w-full">
      <style jsx global>{`
        .coverflow-swiper .swiper-slide {
          opacity: 0;
          transition: opacity 0.8s ease;
        }

        .coverflow-swiper .swiper-slide-active,
        .coverflow-swiper .swiper-slide-prev,
        .coverflow-swiper .swiper-slide-next {
          opacity: 1;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          30% {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .coverflow-swiper .animate-fadeIn {
          animation: fadeIn 0.8s ease forwards;
        }

        /* Mobile Swiper Styles */
        .mobile-coverflow-swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #edd8a7;
          opacity: 0.5;
        }

        .mobile-coverflow-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #d4af37;
        }
        
        /* Loại bỏ outline và border khi focus */
        .carousel-nav-btn:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        
        /* Pagination styles */
        .custom-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 14px;
        }
        
        .custom-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #edd8a7;
          opacity: 0.5;
          margin: 0 5px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .custom-pagination .swiper-pagination-bullet-active {
          background: #d4af37;
          opacity: 1;
          width: 12px;
          height: 12px;
        }
      `}</style>

      {/* Desktop View */}
      {!isMobile ? (
        <div className="flex gap-5 items-center relative w-full">
          {showArrows && (
            <button
              className="carousel-nav-btn absolute left-[34%] z-20 !border-none !outline-none focus:outline-none focus:border-none cursor-pointer text-white hover:scale-110 transition-transform duration-300"
              onClick={() => {
                swiperRef.current?.slidePrev();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[2vw] h-[2vw]"
              >
                <path
                  fillRule="evenodd"
                  d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 20,
              modifier: 10,
              slideShadows: false,
            }}
            slidesPerView={2.8}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              // Tạm dừng autoplay ban đầu nếu cần
              if (!autoplay && swiper.autoplay) {
                swiper.autoplay.stop();
              }
            }}
            autoplay={
              autoplay
                ? {
                    delay: interval,
                    disableOnInteraction: false,
                  }
                : false
            }
            pagination={
              showPagination
                ? {
                    clickable: true,
                    el: '.custom-pagination',
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                  }
                : false
            }
            initialSlide={2}
            modules={swiperModules}
            onRealIndexChange={(e) => setCurrentIndex(e.realIndex)}
            className="coverflow-swiper"
            speed={800}
            autoHeight={true}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 1.8,
              },
              1024: {
                slidesPerView: 2.8,
              },
            }}
          >
            {items.map((item, i) => (
              <SwiperSlide key={i}>
                {({ isActive, isVisible }) => (
                  <div
                    className={`relative pt-[1vw] pb-[2vw] flex justify-center items-center transition-all duration-800 ${
                      isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {item.url ? (
                      <Link 
                        href={item.url} 
                        className={`rounded-full overflow-hidden relative ${
                          isActive ? 'border-2 border-[#D4AF37]' : ''
                        } w-[22vw] ${imageRatio === 'auto' ? 'h-auto' : 'h-[22vw] aspect-square'} transition-all duration-800 shadow-md cursor-pointer block`}
                      >
                        {item.image && (() => {
                          const imageUuid = typeof item.image === 'string' ? item.image : item.image.id;
                          const imageAlt = item.title || `Slide ${i + 1}`;
                          if (imageRatio === 'auto') {
                            const imgWidth = (typeof item.image !== 'string' && item.image.width) ? item.image.width : 1600;
                            const imgHeight = (typeof item.image !== 'string' && item.image.height) ? item.image.height : 900;
                            
                            return (
                              <DirectusImage
                                uuid={imageUuid}
                                alt={imageAlt}
                                width={imgWidth}
                                height={imgHeight}
                                className={`w-full h-auto object-contain transition-transform duration-700 hover:scale-110 ${
                                  !isActive ? 'opacity-70' : ''
                                }`}
                              />
                            );
                          } else {
                            return (
                              <DirectusImage
                                uuid={imageUuid}
                                alt={imageAlt}
                                className={`w-full h-full object-cover transition-transform duration-700 hover:scale-110 ${
                                  !isActive ? 'opacity-70' : ''
                                }`}
                              />
                            );
                          }
                        })()}
                        {!isActive && (
                          <div className="absolute inset-0 bg-primary/30 mix-blend-multiply"></div>
                        )}
                      </Link>
                    ) : (
                      item.image && (
                        <div
                          className={`rounded-full overflow-hidden relative ${
                            isActive ? 'border-2 border-[#D4AF37]' : ''
                          } w-[22vw] ${imageRatio === 'auto' ? 'h-auto' : 'h-[22vw] aspect-square'} transition-all duration-800 shadow-md cursor-pointer`}
                        >
                          {item.image && (() => {
                            const imageUuid = typeof item.image === 'string' ? item.image : item.image.id;
                            const imageAlt = item.title || `Slide ${i + 1}`;
                            if (imageRatio === 'auto') {
                              const imgWidth = (typeof item.image !== 'string' && item.image.width) ? item.image.width : 1600;
                              const imgHeight = (typeof item.image !== 'string' && item.image.height) ? item.image.height : 900;
                              
                              return (
                                <DirectusImage
                                  uuid={imageUuid}
                                  alt={imageAlt}
                                  width={imgWidth}
                                  height={imgHeight}
                                  className={`w-full h-auto object-contain transition-transform duration-700 hover:scale-110 ${
                                    !isActive ? 'opacity-70' : ''
                                  }`}
                                />
                              );
                            } else {
                              return (
                                <DirectusImage
                                  uuid={imageUuid}
                                  alt={imageAlt}
                                  className={`w-full h-full object-cover transition-transform duration-700 hover:scale-110 ${
                                    !isActive ? 'opacity-70' : ''
                                  }`}
                                />
                              );
                            }
                          })()}
                          {!isActive && (
                            <div className="absolute inset-0 bg-primary/30 mix-blend-multiply"></div>
                          )}
                        </div>
                      )
                    )}
                    
                    {isActive && item.title && (
                      <div className="bg-primary text-white text-[1vw] font-medium px-[2vw] py-[0.5vw] rounded-full absolute bottom-[5%] z-10 border-2 border-white shadow-md animate-fadeIn">
                        {item.title}
                      </div>
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {showArrows && (
            <button
              className="carousel-nav-btn absolute right-[34%] z-20 !border-none !outline-none focus:outline-none focus:border-none cursor-pointer text-white hover:scale-110 transition-transform duration-300"
              onClick={() => {
                swiperRef.current?.slideNext();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[2vw] h-[2vw]"
              >
                <path
                  fillRule="evenodd"
                  d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      ) : (
        /* Mobile View */
        <div ref={swiperContainerRef} className="w-full relative">
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            slidesPerView={1}
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
            pagination={
              showPagination
                ? {
                    clickable: true,
                    el: '.custom-pagination',
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active',
                  }
                : false
            }
            modules={swiperModules}
            onRealIndexChange={(e) => setCurrentIndex(e.realIndex)}
            className="mobile-coverflow-swiper"
            speed={800}
            autoHeight={true}
          >
            {items.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col items-center pb-[6%]">
                  {item.url ? (
                    <Link 
                      href={item.url}
                      className={`rounded-full overflow-hidden relative border-2 border-[#D4AF37] w-[95%] ${imageRatio === 'auto' ? 'h-auto' : 'aspect-square'} shadow-md mx-auto block`}
                    >
                      {item.image && (() => {
                        const imageUuid = typeof item.image === 'string' ? item.image : item.image.id;
                        const imageAlt = item.title || `Slide ${i + 1}`;
                        if (imageRatio === 'auto') {
                          const imgWidth = (typeof item.image !== 'string' && item.image.width) ? item.image.width : 1600;
                          const imgHeight = (typeof item.image !== 'string' && item.image.height) ? item.image.height : 900;
                          
                          return (
                            <DirectusImage
                              uuid={imageUuid}
                              alt={imageAlt}
                              width={imgWidth}
                              height={imgHeight}
                              className="w-full h-auto object-contain transition-transform duration-700 hover:scale-110"
                            />
                          );
                        } else {
                          return (
                            <DirectusImage
                              uuid={imageUuid}
                              alt={imageAlt}
                              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                          );
                        }
                      })()}
                    </Link>
                  ) : (
                    item.image && (
                      <div 
                        className={`rounded-full overflow-hidden relative border-2 border-[#D4AF37] w-[95%] ${imageRatio === 'auto' ? 'h-auto' : 'aspect-square'} shadow-md mx-auto`}
                      >
                        {item.image && (() => {
                          const imageUuid = typeof item.image === 'string' ? item.image : item.image.id;
                          const imageAlt = item.title || `Slide ${i + 1}`;
                          if (imageRatio === 'auto') {
                            const imgWidth = (typeof item.image !== 'string' && item.image.width) ? item.image.width : 1600;
                            const imgHeight = (typeof item.image !== 'string' && item.image.height) ? item.image.height : 900;
                            
                            return (
                              <DirectusImage
                                uuid={imageUuid}
                                alt={imageAlt}
                                width={imgWidth}
                                height={imgHeight}
                                className="w-full h-auto object-contain transition-transform duration-700 hover:scale-110"
                              />
                            );
                          } else {
                            return (
                              <DirectusImage
                                uuid={imageUuid}
                                alt={imageAlt}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                              />
                            );
                          }
                        })()}
                      </div>
                    )
                  )}
                  
                  {item.title && (
                    <div className="bg-primary text-white text-sm font-medium px-[4vw] py-[1vw] rounded-full mt-[-5vw] z-20 border-2 border-white shadow-md">
                      {item.title}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {showArrows && (
            <>
              <button
                className="carousel-nav-btn absolute left-2 top-[40%] z-20 !border-none !outline-none focus:outline-none focus:border-none cursor-pointer text-white hover:scale-110 transition-transform duration-300"
                onClick={() => {
                  swiperRef.current?.slidePrev();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                className="carousel-nav-btn absolute right-2 top-[40%] z-20 !border-none !outline-none focus:outline-none focus:border-none cursor-pointer text-white hover:scale-110 transition-transform duration-300"
                onClick={() => {
                  swiperRef.current?.slideNext();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Container tùy chỉnh cho pagination - chỉ hiển thị khi showPagination = true */}
      {showPagination && <div className="custom-pagination"></div>}
    </div>
  );
};

export default CoverflowCarousel; 