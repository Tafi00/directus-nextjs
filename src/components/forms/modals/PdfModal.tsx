'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DirectusImage from '@/components/shared/DirectusImage';
import SuccessDialog from './SuccessDialog';
import { setAttr } from '@directus/visual-editing';
import { createFormSubmission } from '@/lib/directus/fetchers';

interface PdfModalProps {
	isOpen: boolean;
	onClose: () => void;
	modalData?: any;
}

export default function PdfModal({ isOpen, onClose, modalData }: PdfModalProps) {
	const [isReady, setIsReady] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [currentPermalink, setCurrentPermalink] = useState('');

	// GTM tracking function (simplified implementation)
	const pushFormDataToGTM = (data: any) => {
		if (typeof window !== 'undefined' && (window as any).dataLayer) {
			(window as any).dataLayer.push({
				event: 'formSubmission',
				formData: data,
			});
			console.log('Data pushed to GTM:', data);
		}
	};

	const [userAgent, setUserAgent] = useState('');

	useEffect(() => {
		// Lấy User Agent
		setUserAgent(typeof window !== 'undefined' ? window.navigator.userAgent : '');

		// Get current page permalink from URL
		if (typeof window !== 'undefined') {
			// Extract permalink from URL path (remove leading slash)
			const path = window.location.pathname;
			const permalink = path === '/' ? 'home' : path.replace(/^\//, '');
			setCurrentPermalink(permalink);
		}

		if (isOpen) {
			// Đợi một chút trước khi cho phép input hoạt động
			const timer = setTimeout(() => {
				setIsReady(true);
			}, 100);
			return () => clearTimeout(timer);
		} else {
			setIsReady(false);
			setSubmitted(false);
			setIsLoading(false);
			setShowSuccess(false);
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		console.log('Submit PdfModal');
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const name = formData.get('entry.1878258216') as string;
		const phone = formData.get('entry.746140708') as string;

		// Kiểm tra name và phone không rỗng
		if (!name || !phone || name === '' || phone === '') {
			console.log('Name or phone is empty');
			return;
		}

		setIsLoading(true);
		const formDataObj = {
			name: name,
			phone: phone,
			formType: 'FormBaoGia',
			url: window.location.href,
			userAgent: userAgent,
		};

		// Push to GTM dataLayer
		pushFormDataToGTM(formDataObj);

		// Create form submission in Directus
		try {
			// Create new form data entry in the pages collection's form field (many-to-many relationship)
			const createDirectusSubmission = async () => {
				try {
					await createFormSubmission({
						name: name,
						phone: phone,
						form_id: 'FormBaoGia',
						useragent: userAgent,
						permalink: currentPermalink,
					});
					console.log('Form data created in pages collection');
				} catch (directusError) {
					console.error('Error creating form data in pages collection:', directusError);
				}
			};

			// Gửi form đến Google Forms
			fetch(e.currentTarget.action, {
				method: 'POST',
				body: formData,
				mode: 'no-cors',
			})
				.then(async () => {
					// Create in Directus after Google Forms success
					await createDirectusSubmission();

					setSubmitted(true);
					setIsLoading(false);
					// Đóng modal form và hiển thị Success Dialog
					onClose();
					setTimeout(() => {
						setShowSuccess(true);
					}, 300);
				})
				.catch((error) => {
					console.error('Error:', error);
					setIsLoading(false);
				});
		} catch (error) {
			console.error('Exception error:', error);
			setIsLoading(false);
		}
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent
					id={modalData?.modal_id}
					className="sm:max-w-[800px] p-0 overflow-hidden outline-none border-none py-10"
				>
					<button
						onClick={onClose}
						className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 outline-none border-none focus:ring-0 disabled:pointer-events-none"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
						<span className="sr-only">Đóng</span>
					</button>

					<div>
						<DialogHeader>
							<DialogTitle className="text-center text-2xl md:text-3xl text-white mb-6">{modalData?.title}</DialogTitle>
						</DialogHeader>

						<div className="px-6">
							{/* PDF File Name Section */}
							<div className="border border-white rounded-lg p-4 flex items-center justify-center space-x-2 mb-6">
								{modalData?.file_icon && (
									<DirectusImage uuid={modalData.file_icon} alt="PDF Icon" width={24} height={24} />
								)}
								<span className="text-white">{modalData?.subtitle}</span>
							</div>

							{/* Content Items */}
							{modalData?.info_list && Array.isArray(modalData.info_list) && (
								<div className="border border-white rounded-lg p-4 mb-6">
									<div className="space-y-3">
										{modalData.info_list.map((item: string, index: number) => (
											<div key={index} className="flex items-center space-x-2 text-white">
												{modalData.list_icon && (
													<DirectusImage uuid={modalData.list_icon} alt="Check" width={18} height={18} />
												)}
												<span>{item}</span>
											</div>
										))}
									</div>
								</div>
							)}

							<form
								id="FormBaoGia"
								onSubmit={handleSubmit}
								action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSdRe922s-eV3qN8UDMUYr7ApIidl7rqiG650F0-4ivrFgQEdw/formResponse"
								className="space-y-4"
							>
								<input type="hidden" name="entry.1668866940" value={userAgent} />
								<input type="hidden" name="entry.938798374" value={'FormBaoGia'} />
								<input
									id="167269404"
									type="hidden"
									name="entry.167269404"
									value={typeof window !== 'undefined' ? window.location.href : ''}
								/>
								<input
									type="text"
									id="entry.1878258216"
									name="entry.1878258216"
									placeholder="Họ tên"
									required
									autoComplete="off"
									autoFocus={false}
									readOnly={!isReady}
									tabIndex={!isReady ? -1 : 0}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21C4FF] transition-all bg-white"
								/>
								<input
									type="tel"
									id="entry.746140708"
									name="entry.746140708"
									placeholder="Số điện thoại"
									required
									pattern="(?:7|0\d|\+84\d)\d{8}"
									title="Vui lòng nhập số điện thoại hợp lệ"
									autoComplete="off"
									autoFocus={false}
									readOnly={!isReady}
									tabIndex={!isReady ? -1 : 0}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21C4FF] transition-all bg-white"
								/>
								<button
									type="submit"
									disabled={submitted || isLoading}
									className="baogiataiload w-full bg-white text-[#0F3B4C] border-2 border-[#AD8444] px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-bold disabled:opacity-50"
								>
									<span className="inline-block w-4 h-4 mr-2">
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path
												d="M5 12h14M12 5l7 7-7 7"
												stroke="#0F3B4C"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</span>
									{isLoading ? 'ĐANG XỬ LÝ...' : 'TẢI XUỐNG'}
								</button>
							</form>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<SuccessDialog isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
		</>
	);
}
