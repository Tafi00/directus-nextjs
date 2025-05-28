'use client';

import React, { useState, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import Container from '@/components/ui/container';
import { setAttr } from '@directus/visual-editing';
import { createFormSubmission } from '@/lib/directus/fetchers';
// Import SuccessDialog khi bạn đã tạo xong component
// import SuccessDialog from '@/components/modals/SuccessDialog';

interface FooterProps {
	footer?: {
		id: string;
		copyright_text?: string | null;
		terms_url?: string | null;
		privacy_url?: string | null;
		desktop_background?: any | null;
		footer_logo?: any | null;
		mobile_background?: any | null;
		info?: {
			id: number;
			title: string;
			subtitle?: string | null;
			type: string;
			email?: string | null;
			phone?: string | null;
			url?: string | null;
			info_id: number;
			icon?: string | null;
		}[] | null;
	};
}

const Footer = forwardRef<HTMLDivElement, FooterProps>(({ footer }, ref) => {
	const [formData, setFormData] = useState({
		fullName: "",
		phoneNumber: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [formError, setFormError] = useState("");
	const [isMobile, setIsMobile] = useState(false);
	const [userAgent, setUserAgent] = useState('');
	const [currentPermalink, setCurrentPermalink] = useState('');
	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

	// Kiểm tra kích thước màn hình để xác định mobile hay desktop
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		
		// Kiểm tra khi component mount
		checkMobile();
		
		// Thêm event listener
		window.addEventListener('resize', checkMobile);
		
		// Get user agent
		setUserAgent(typeof window !== 'undefined' ? window.navigator.userAgent : '');
		
		// Get current page permalink from URL
		if (typeof window !== 'undefined') {
			// Extract permalink from URL path (remove leading slash)
			const path = window.location.pathname;
			const permalink = path === '/' ? 'home' : path.replace(/^\//, '');
			setCurrentPermalink(permalink);
		}
		
		// Cleanup
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setFormError("");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Kiểm tra tên và số điện thoại không rỗng
		if (!formData.fullName || !formData.phoneNumber) {
			setFormError("Vui lòng nhập đầy đủ họ tên và số điện thoại");
			return;
		}

		try {
			setIsLoading(true);
			setFormError("");

			// Create form data entry in the pages collection's form field (many-to-many relationship)
			try {
				await createFormSubmission({
					name: formData.fullName,
					phone: formData.phoneNumber,
					form_id: 'FooterForm',
					useragent: userAgent,
					permalink: currentPermalink
				});
				console.log('Footer form data created in pages collection');
			} catch (directusError) {
				console.error('Error creating form data in pages collection:', directusError);
			}

			setShowSuccess(true);
			setFormData({
				fullName: "",
				phoneNumber: "",
			});
		} catch (error) {
			console.error("Error submitting form:", error);
			setFormError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
		} finally {
			setIsLoading(false);
		}
	};

	const infoData = footer?.info?.map((item, index) => {
		if (item.type === 'email') {
			return (
				<span
					onClick={() => item.email && window.open(`mailto:${item.email}`)}
					key={index}
					className="leading-[1.4] text-[1vw] cursor-pointer"
				>
					{item.title}
				</span>
			);
		} else if (item.type === 'phone') {
			return (
				<span
					onClick={() => item.phone && window.open(`tel:${item.phone}`)}
					key={index}
					className="leading-[1.4] text-[1vw] cursor-pointer"
				>
					{item.title}
				</span>
			);
		} else {
			return (
				<span key={index} className="leading-[1.4] text-[1vw]">
					{item.title}
					{item.subtitle && (
						<>
							<br />
							<span className="text-[0.7vw] font-light">
								{item.subtitle}
							</span>
						</>
					)}
				</span>
			);
		}
	}) || [];

	// Desktop Version
	const renderDesktopVersion = () => (
		<div ref={ref} className="relative h-[calc(100vh-70px)] w-full font-gotham overflow-hidden pb-[2vw]">
			<div
				className="absolute inset-0 bg-cover bg-bottom"
				style={{ 
					backgroundImage: footer?.desktop_background 
						? `url(${directusURL}/assets/${footer.desktop_background.id})` 
						: "url('/images/section12_bg.jpg')" 
				}}
				data-directus={footer ? setAttr({
					collection: 'global_footer',
					item: footer.id,
					fields: 'desktop_background',
					mode: 'modal',
				}) : undefined}
			/>
			<div
				className="absolute top-[4%] left-[24%] z-10 w-[62vw] flex flex-col items-center"
				style={{ position: "relative" }}
			>
				{footer?.footer_logo && (
					<img
						src={`${directusURL}/assets/${footer.footer_logo.id}`}
						alt="logo"
						className="w-[26%] h-auto"
						data-directus={footer ? setAttr({
							collection: 'global_footer',
							item: footer.id,
							fields: 'footer_logo',
							mode: 'modal',
						}) : undefined}
					/>
				)}
				<div className="flex items-center gap-[2vw] mt-[2%]">
					<div
					data-directus={footer ? setAttr({
						collection: 'global_footer',
						item: footer.id,
						fields: 'info',
						mode: 'modal',
					}) : undefined}
					className="flex flex-col items-start gap-[1.4vw]">
						{infoData.map((infoItem, i) => (
							<div
								key={i}
								className="text-white flex items-start gap-[1.2vw] text-[1.6vw] leading-[1.4]"
								
							>
								<img
									alt="icon"
									src={footer?.info && footer.info[i]?.icon 
										? `${directusURL}/assets/${footer.info[i].icon}` 
										: `/images/sec-12-icon-${i + 1}.png`}
									className="w-[1.8vw] h-[1.8vw]"
								/>
								{infoItem}
							</div>
						))}
					</div>

					<div
						className="w-[22vw] h-[22vw] rounded-full flex flex-col items-center justify-center text-white p-[2.5vw]"
						style={{
							background: "linear-gradient(180deg, #1D705D 0%, #129463 100%)",
						}}
					>
						<h2 className="!text-[1.6vw] font-bold leading-none mb-[1vw]">
							ĐĂNG KÝ
						</h2>
						<p className="text-[1.2vw] leading-none tracking-wide mb-[1.5vw]">
							NHẬN TƯ VẤN VÀ BÁO GIÁ
						</p>

						<form
							id="FooterForm"
							className="w-full flex flex-col gap-[1vw]"
							onSubmit={handleSubmit}
						>
							<div className="relative w-full">
								<input
									type="text"
									name="fullName"
									value={formData.fullName}
									onChange={handleInputChange}
									placeholder="Họ tên (*)"
									required
									className="w-full py-[0.5vw] px-[1.2vw] rounded-[0.2vw] bg-transparent border border-white text-white placeholder:text-white text-[0.85vw] outline-none"
								/>
							</div>
							<div className="relative w-full">
								<input
									type="tel"
									name="phoneNumber"
									value={formData.phoneNumber}
									onChange={handleInputChange}
									placeholder="Số điện thoại (*)"
									required
									pattern="(?:7|0\d|\+84\d)\d{8}"
									title="Vui lòng nhập số điện thoại hợp lệ"
									className="w-full py-[0.5vw] px-[1.2vw] rounded-[0.2vw] bg-transparent border border-white text-white placeholder:text-white text-[0.85vw] outline-none"
								/>
							</div>
							{formError && (
								<p className="text-red-500 text-[0.7vw] text-center">
									{formError}
								</p>
							)}
							<button
								type="submit"
								disabled={isLoading}
								className={`dangkythanhcong mt-[0.5vw] bg-white text-[#1D705D] font-medium py-[0.4vw] px-[2.5vw] rounded-full text-[1vw] hover:bg-opacity-90 transition-all duration-300 w-fit mx-auto ${
									isLoading ? "opacity-70 cursor-not-allowed" : ""
								}`}
							>
								{isLoading ? "ĐANG GỬI..." : "GỬI THÔNG TIN"}
							</button>
						</form>
					</div>
				</div>
			</div>
			
			{/* Footer */}
			<div className="w-full flex justify-between items-center text-[0.8vw] text-white py-[0.1vw] px-[1.5vw] mt-[4vw] bg-[#146a65]/40 rounded-[0.2vw] z-30 absolute bottom-0">
				<div
					data-directus={footer ? setAttr({
						collection: 'global_footer',
						item: footer.id,
						fields: 'copyright_text',
						mode: 'popover',
					}) : undefined}
				>
					{footer?.copyright_text || "Copyright 2025 © The Infinity Dĩ An"}
				</div>
				<div className="flex items-center space-x-[1vw]">
					<Link 
						href={footer?.terms_url ?? "#"} 
						className="hover:underline"
						data-directus={footer ? setAttr({
							collection: 'global_footer',
							item: footer.id,
							fields: 'terms_url',
							mode: 'popover',
						}) : undefined}
					>
						Terms of Service
					</Link>
					<span>|</span>
					<Link 
						href={footer?.privacy_url ?? "#"} 
						className="hover:underline"
						data-directus={footer ? setAttr({
							collection: 'global_footer',
							item: footer.id,
							fields: 'privacy_url',
							mode: 'popover',
						}) : undefined}
					>
						Privacy Policy
					</Link>
				</div>
			</div>
		</div>
	);

	// Mobile Version
	const renderMobileVersion = () => (
		<section ref={ref} id="section12" className="relative flex flex-col text-white">
			<div className="relative">
				<img 
					src={footer?.mobile_background 
						? `${directusURL}/assets/${footer.mobile_background.id}` 
						: "/images/bg-section12-0.jpg"} 
					alt="bg" 
					className="w-full"
					data-directus={footer ? setAttr({
						collection: 'global_footer',
						item: footer.id,
						fields: 'mobile_background',
						mode: 'modal',
					}) : undefined}
				/>
				<div className="absolute top-0 flex flex-col justify-center">
					{footer?.footer_logo && (
						<img
							src={`${directusURL}/assets/${footer.footer_logo.id}`}
							alt="logo"
							className="w-screen mt-[5%]"
							data-directus={footer ? setAttr({
								collection: 'global_footer',
								item: footer.id,
								fields: 'footer_logo',
								mode: 'modal',
							}) : undefined}
						/>
					)}
					<div
						className="w-[90vw] h-[90vw] rounded-full flex flex-col items-center justify-center text-white px-[10vw] mt-[12%] mx-auto"
						style={{
							background: "linear-gradient(180deg, #1D705D 0%, #129463 100%)",
						}}
					>
						<h2 className="!text-[5.6vw] font-bold leading-none mb-[4vw]">
							ĐĂNG KÝ
						</h2>
						<p className="text-[4.2vw] leading-none tracking-wide mb-[2vw]">
							NHẬN TƯ VẤN VÀ BÁO GIÁ
						</p>

						<form
							className="w-full flex flex-col gap-[1vw]"
							onSubmit={handleSubmit}
						>
							<div className="relative w-full mt-[2vw]">
								<input
									type="text"
									name="fullName"
									value={formData.fullName}
									onChange={handleInputChange}
									placeholder="Họ tên (*)"
									required
									className="w-full py-[3vw] px-[4vw] rounded-xl bg-transparent border border-white text-white placeholder:text-white text-[3vw] outline-none"
								/>
							</div>
							<div className="relative w-full mt-[2vw]">
								<input
									type="tel"
									name="phoneNumber"
									value={formData.phoneNumber}
									onChange={handleInputChange}
									placeholder="Số điện thoại (*)"
									required
									pattern="(?:7|0\d|\+84\d)\d{8}"
									title="Vui lòng nhập số điện thoại hợp lệ"
									className="w-full py-[3vw] px-[4vw] rounded-xl bg-transparent border border-white text-white placeholder:text-white text-[3vw] outline-none"
								/>
							</div>
							{formError && (
								<p className="text-red-500 text-[3vw] text-center">
									{formError}
								</p>
							)}
							<button
								type="submit"
								disabled={isLoading}
								className={`mt-[3vw] bg-white text-[#1D705D] font-medium py-[2vw] px-[6vw] rounded-full text-[4vw] hover:bg-opacity-90 transition-all duration-300 w-fit mx-auto ${
									isLoading ? "opacity-70 cursor-not-allowed" : ""
								}`}
							>
								{isLoading ? "ĐANG GỬI..." : "GỬI THÔNG TIN"}
							</button>
						</form>
					</div>
					<div className="flex flex-col items-start gap-[1.4vw] mx-auto">
						<div 
							className="text-white/90 text-[3.6vw] leading-[1.4] text-center mt-[4%] no-underline"
							data-directus={footer?.info?.[0] ? setAttr({
								collection: 'global_footer_info',
								item: footer.id,
								fields: 'info',
								mode: 'modal',
							}) : undefined}
						>
							{footer?.info && footer.info.map((item, index) => {
								if (item.type === 'email' || item.type === 'phone') {
									const parts = item.title.split(':');
									const label = parts[0] || '';
									const value = parts.length > 1 ? parts[1].trim() : '';
									
									return (
										<div key={index} className="mb-[3vw]">
											<span className="font-bold text-white uppercase">{label}:</span>{" "}
											{value}
										</div>
									);
								} else {
									return (
										<div key={index} className="mb-[3vw]">
											<span className="font-bold text-white">{item.title}</span>
											<br />
											{item.subtitle}
										</div>
									);
								}
							})}
						</div>
					</div>

					{/* Footer */}
					<div className="w-full flex flex-col items-center text-[3vw] text-white px-[4vw] mt-[2vw] py-[1vw] bg-[#146a65]/90">
						<div 
							className="mb-[1vw]"
							data-directus={footer ? setAttr({
								collection: 'global_footer',
								item: footer.id,
								fields: 'copyright_text',
								mode: 'popover',
							}) : undefined}
						>
							{footer?.copyright_text || "Copyright 2025 © The Infinity Dĩ An"}
						</div>
						<div className="flex items-center space-x-[3vw]">
							{footer?.terms_url && (
								<Link 
									href={footer.terms_url} 
									className="hover:underline"
									data-directus={footer ? setAttr({
										collection: 'global_footer',
										item: footer.id,
										fields: 'terms_url',
										mode: 'popover',
									}) : undefined}
								>
									Terms of Service
								</Link>
							)}
							<span>|</span>
							{footer?.privacy_url && (
								<Link 
									href={footer.privacy_url} 
									className="hover:underline"
									data-directus={footer ? setAttr({
										collection: 'global_footer',
										item: footer.id,
										fields: 'privacy_url',
										mode: 'popover',
									}) : undefined}
								>
									Privacy Policy
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Tạm thời comment SuccessDialog cho đến khi bạn tạo xong component
			<SuccessDialog
				isOpen={showSuccess}
				onClose={() => setShowSuccess(false)}
			/>
			*/}
		</section>
	);

	
  return isMobile ? renderMobileVersion() : renderDesktopVersion();
});

Footer.displayName = 'Footer';
export default Footer;
