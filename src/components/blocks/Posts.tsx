'use client';

import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { setAttr } from '@directus/visual-editing';
import Headline from '@/components/ui/Headline';
import Tagline from '@/components/ui/Tagline';
import NewsDialog from '../ui/NewsDialog';

import DirectusImage from '../shared/DirectusImage';

interface PostsProps {
	data: {
		id: string;
		tagline: string;
		headline: string;
	};
	posts?: Array<{
		id: number;
		title: string;
		description: string;
		thumbnail: string;
		content: string | null;
		type: 'url' | 'popup';
		url: string | null;
	}>;
	pageId?: string;
}

export default function Posts({ data, posts, pageId }: PostsProps) {
	const { id, headline, tagline } = data;
	const swiperPcRef = useRef<any>(null);
	const swiperMobileRef = useRef<any>(null);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
	const [selectedNews, setSelectedNews] = useState<any>(null);
	const [isMobile, setIsMobile] = useState(false);

	// Check screen size to determine mobile or desktop
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Check when component mounts
		checkMobile();

		// Add event listener
		window.addEventListener('resize', checkMobile);

		// Cleanup
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	// Group posts into groups of 3 (for mobile)
	const groupPosts = (posts: any[] | undefined) => {
		if (!posts) return [];
		const result = [];
		for (let i = 0; i < posts.length; i += 3) {
			result.push(posts.slice(i, i + 3));
		}
		return result;
	};

	const groupedPosts = groupPosts(posts);

	// Handle news item click
	const handleNewsClick = (post: any) => {
		if (post.type === 'url' && post.url) {
			// Open link in new tab if it's a URL type
			window.open(post.url, '_blank', 'noopener,noreferrer');
		} else {
			// Show dialog if it's a popup type
			setSelectedNews(post);
		}
	};

	return (
		<section
			className="relative w-full font-gotham overflow-hidden pt-4 md:pt-[50px]"
			data-directus={setAttr({
				collection: 'block_posts',
				item: id,
				fields: ['headline', 'tagline', 'posts'],
				mode: 'modal',
			})}
		>
			<div className="flex flex-col items-center w-full h-full justify-center">
				<Headline
					headline={headline}
					data-directus={setAttr({
						collection: 'block_posts',
						item: id,
						fields: 'headline',
						mode: 'popover',
					})}
				/>
				<Tagline
					tagline={tagline}
					data-directus={setAttr({
						collection: 'block_posts',
						item: id,
						fields: 'tagline',
						mode: 'popover',
					})}
				/>

				{/* Desktop News Section */}
				<div
					data-directus={setAttr({
						collection: 'pages',
						item: pageId || '',
						fields: ['posts'],
						mode: 'modal',
					})}
					className={`${isMobile ? 'hidden' : 'flex'} items-center relative px-[2.4vw] w-[70vw]`}
				>
					{!posts || posts.length === 0 ? (
						<div className="w-[62vw] mt-[4vh] flex items-center justify-center">
							<div className="text-primary text-xl">No posts available</div>
						</div>
					) : (
						<Swiper
							loop={false}
							slidesPerView={3}
							pagination={{ clickable: true, enabled: true }}
							allowTouchMove
							onSwiper={(swiper) => {
								swiperPcRef.current = swiper;
							}}
							autoplay={{
								delay: 5000,
								disableOnInteraction: false,
							}}
							onSlideChange={(e) => setCurrentIndex(e.activeIndex)}
							className="w-[62vw] mt-[1vw] opacity-100"
						>
							{posts.map((post, i) => (
								<SwiperSlide key={i} className="flex items-start opacity-100 p-[0.5vw]" style={{ opacity: 1 }}>
									<div
										onClick={() => handleNewsClick(post)}
										className={`bg-white flex flex-col w-full h-[24vw] text-[#d7d7d7] p-[1.3vw] pt-[1.6vw] cursor-pointer group bg-gradient-2 rounded-2xl overflow-hidden opacity-100`}
										style={{ opacity: 1 }}
									>
										<div className="w-full h-[12vw] overflow-hidden rounded-xl opacity-100" style={{ opacity: 1 }}>
											<DirectusImage
												alt="thumbnail"
												uuid={post.thumbnail}
												className="w-full h-full object-cover group-hover:scale-110 transition duration-500 !opacity-100"
												style={{ opacity: 1 }}
											/>
										</div>
										<div className="relative flex flex-col flex-1">
											<div className="line-clamp-2 text-[0.95vw] leading-[1.4] mt-2 relative text-[#0C5B3E] text-justify font-semibold">
												{post.title}
											</div>
											<div className="text-left text-[0.75vw] line-clamp-3 text-[#233F35] leading-[1.6] mt-[0.5vw]">
												{post.description}
											</div>
											<div className="text-[#233F35] text-[0.9vw] mt-auto text-left flex gap-[0.5vw] items-center">
												<DirectusImage
													uuid="d399f4e1-f8ea-470e-8663-6a2986b93e84"
													alt="calendar"
													className="w-[1.2vw] h-auto object-contain opacity-100"
													style={{ opacity: 1 }}
												/>
												{new Date().toLocaleDateString('vi-VN')}
											</div>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					)}
				</div>

				{/* Mobile News Section */}
				<div className={`${isMobile ? 'flex' : 'hidden'} items-center relative px-[5vw] w-screen`}>
					{!posts || posts.length === 0 ? (
						<div className="w-full mt-[5vw] flex items-center justify-center">
							<div className="text-primary text-[5vw]">No posts available</div>
						</div>
					) : (
						<Swiper
							loop={false}
							slidesPerView={1}
							spaceBetween={20}
							pagination={{ clickable: true, enabled: true }}
							allowTouchMove
							onSwiper={(swiper) => {
								swiperMobileRef.current = swiper;
							}}
							autoplay={{
								delay: 5000,
								disableOnInteraction: false,
							}}
							onSlideChange={(e) => setCurrentMobileIndex(e.activeIndex)}
							className="w-full mt-[3vw]"
						>
							{groupedPosts.map((group, groupIndex) => (
								<SwiperSlide key={groupIndex} className="w-full">
									<div className="flex flex-col gap-[3vw]">
										{group.map((post, postIndex) => (
											<div
												key={postIndex}
												onClick={() => handleNewsClick(post)}
												className="bg-white flex w-full rounded-xl overflow-hidden shadow-md p-[3vw] cursor-pointer"
											>
												<div className="w-[40%] h-[30vw] overflow-hidden">
													<DirectusImage
														alt="thumbnail"
														uuid={post.thumbnail}
														className="w-full h-full object-cover rounded-xl"
													/>
												</div>
												<div className="flex-1 px-[2vw] flex flex-col justify-between">
													<div>
														<div className="text-[3.4vw] leading-[1.4] font-semibold text-[#0C5B3E] line-clamp-3">
															{post.title}
														</div>
														<div className="text-[2.6vw] text-[#233F35] mt-[1vw] line-clamp-2">{post.description}</div>
													</div>
													<div className="flex justify-between items-center mt-auto">
														<div className="flex items-center text-[#0C5B3E] text-[2.8vw] font-medium">
															XEM THÊM
															<svg
																width="16"
																height="16"
																viewBox="0 0 24 24"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
																className="ml-[1vw]"
															>
																<path
																	d="M8.91003 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91003 4.08"
																	stroke="#0C5B3E"
																	strokeWidth="2"
																	strokeMiterlimit="10"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																/>
															</svg>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					)}
				</div>

				{/* Desktop Pagination */}
				{posts && posts.length > 0 && !isMobile && (
					<div className="flex items-center gap-[1vw] my-[1vw]">
						{Array.from({ length: Math.ceil((posts.length || 0) / 3) }).map((_, i) => (
							<div
								onClick={() => {
									swiperPcRef.current?.slideTo(i);
									setCurrentIndex(i);
								}}
								key={i}
								className={`cursor-pointer text-[1vw] flex items-center justify-center h-[2vw] w-[2vw] rounded-full border-double border-[3px] ${
									currentIndex === i
										? 'bg-white text-[#0C5B3E] border-[#0C5B3E]'
										: ' border-white bg-[#0C5B3E] text-white'
								}`}
							>
								{i + 1}
							</div>
						))}
					</div>
				)}

				{/* Mobile Pagination */}
				{posts && posts.length > 0 && isMobile && (
					<div className="flex items-center gap-[3vw] my-[4vw]">
						{Array.from({ length: Math.ceil((posts.length || 0) / 3) }).map((_, i) => (
							<div
								onClick={() => {
									swiperMobileRef.current?.slideTo(i);
									setCurrentMobileIndex(i);
								}}
								key={i}
								className={`cursor-pointer text-[3.5vw] flex items-center justify-center h-[8vw] w-[8vw] rounded-full border-double border-[3px] ${
									currentMobileIndex === i
										? 'bg-white text-[#0C5B3E] border-[#0C5B3E]'
										: ' border-white bg-[#0C5B3E] text-white'
								}`}
							>
								{i + 1}
							</div>
						))}
					</div>
				)}
			</div>
			<NewsDialog isOpen={!!selectedNews} onClose={() => setSelectedNews(null)} news={selectedNews} />
		</section>
	);
}
