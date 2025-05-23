'use client';

import { useState, forwardRef } from 'react';
import RegisterModal from '@/components/forms/modals/RegisterModal';
import PdfModal from '@/components/forms/modals/PdfModal';
import { setAttr } from '@directus/visual-editing';

interface RegisterFormProps {
	theme: any;
}

const RegisterForm = forwardRef<HTMLDivElement, RegisterFormProps>(({ theme }, ref) => {
	const registerForm = theme.register_form;
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
	const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

	const handleButtonClick = (type: string, url?: string | null, phone?: string | null) => {
		switch (type) {
			case 'modal1':
				setIsModalOpen(true);
				break;
			case 'modal2':
				setIsPdfModalOpen(true);
				break;
			case 'tel':
				if (phone) {
					const cleanPhoneNumber = phone.replace(/[^0-9]/g, '');
					window.location.href = `tel:${cleanPhoneNumber}`;
				}
				break;
			case 'zalo':
				if (phone) {
					const cleanZaloNumber = phone.replace(/[^0-9]/g, '');
					window.open(`https://zalo.me/${cleanZaloNumber}`, '_blank');
				}
				break;
			case 'url':
				if (url) {
					window.open(url, '_blank');
				}
				break;
			default:
				setIsModalOpen(true);
		}
	};

	return (
		<div ref={ref} className="form-container hidden md:block w-full lg:w-[400px] xl:w-[440px] 2xl:w-[480px]">
			<h2
				className="form-title text-lg sm:text-xl lg:text-2xl 2xl:text-[28px]"
				data-directus={
					registerForm
						? setAttr({
								collection: 'global_register_form',
								item: registerForm.id,
								fields: 'title',
								mode: 'popover',
							})
						: undefined
				}
			>
				{registerForm?.title || '30 suất cam kết\ncho thuê 144 triệu'}
			</h2>
			<p
				className="form-subtitle text-sm sm:text-base "
				data-directus={
					registerForm
						? setAttr({
								collection: 'global_register_form',
								item: registerForm.id,
								fields: 'subtitle',
								mode: 'popover',
							})
						: undefined
				}
			>
				{registerForm?.subtitle || 'Liên hệ ngay để được tư vấn và nhận ưu đãi !!!'}
			</p>
			<div
				className="form-buttons-container space-y-2 sm:space-y-3 lg:space-y-4"
				data-directus={
					registerForm
						? setAttr({
								collection: 'global_register_form',
								item: registerForm.id,
								fields: 'buttons',
								mode: 'modal',
							})
						: undefined
				}
			>
				{registerForm?.buttons &&
					registerForm.buttons
						.sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))
						.map((button: any) => (
							<button
								key={button.id}
								className="form-button h-[44px] sm:h-[50px] lg:h-[56px] text-sm sm:text-base"
								onClick={() => handleButtonClick(button.type, button.url, button.phone)}
							>
								{button.text}
							</button>
						))}
			</div>

			<RegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

			<PdfModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />
		</div>
	);
});

RegisterForm.displayName = 'RegisterForm';
export default RegisterForm;
